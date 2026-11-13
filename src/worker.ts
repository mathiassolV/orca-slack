// Polls Orca's browser tabs through the `orca` CLI, shows Slack's unread count in the status bar
// and notifies when it goes up. Uses the Slack web session you are
// already logged into in Orca's browser, so no Slack token or app is needed.
import type { OrcaWorkerApi } from 'orca/worker'
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { findSlackTab, unreadFromTitle, type Tab } from './slack'

const POLL_MS = 3000

// The worker runs inside the Orca app (Electron-as-Node), where a bare `orca` can resolve to the
// app binary instead of the CLI. Prefer the CLI bundled next to the app, and drop the
// Electron-as-Node flag so the launcher behaves as it does in a shell. The worker's environment is
// also stripped, so restore the user folders the CLI uses to find the running Orca.
const bundled = join(dirname(process.execPath), 'resources', 'bin', process.platform === 'win32' ? 'orca.exe' : 'orca')
const ORCA = existsSync(bundled) ? bundled : 'orca'
const home = homedir()
const childEnv: NodeJS.ProcessEnv = {
  HOME: home,
  USERPROFILE: home,
  APPDATA: join(home, 'AppData', 'Roaming'),
  LOCALAPPDATA: join(home, 'AppData', 'Local'),
  ...process.env,
}
delete childEnv.ELECTRON_RUN_AS_NODE

function orcaCli(args: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    execFile(ORCA, [...args, '--json'], { env: childEnv, cwd: home, windowsHide: true, timeout: 15000 }, (err, stdout, stderr) => {
      if (err && !stdout) return reject(new Error(`${err.message} ${stderr}`.trim()))
      try {
        const out = JSON.parse(stdout)
        out.ok ? resolve(out.result) : reject(new Error(out.error?.message ?? 'orca cli failed'))
      } catch (e) {
        reject(e)
      }
    })
  })
}

async function listTabs(): Promise<Tab[]> {
  const result = await orcaCli(['tab', 'list', '--worktree', 'all'])
  return result?.tabs ?? []
}

let timer: ReturnType<typeof setInterval> | undefined

export default function activate(orca: OrcaWorkerApi): void {
  let last = -1

  async function poll() {
    try {
      const tab = findSlackTab(await listTabs())
      if (!tab) {
        last = -1
        await orca.host.call('statusBar.update', { id: 'slack', text: 'Slack', tone: 'neutral', tooltip: 'No Slack tab open in Orca' })
        return
      }
      const unread = unreadFromTitle(tab.title)
      if (unread !== last) {
        await orca.host.call('statusBar.update', {
          id: 'slack',
          text: unread > 0 ? `Slack ${unread}` : 'Slack',
          tone: unread > 0 ? 'accent' : 'neutral',
          tooltip: unread > 0 ? `${unread} new in Slack` : 'No unread Slack messages',
        })
        if (last >= 0 && unread > last) {
          await orca.host.call('notifications.show', {
            title: 'Slack',
            body: `${unread} new item${unread === 1 ? '' : 's'}`,
          })
        }
        last = unread
      }
    } catch (e) {
      orca.log(`poll failed: ${(e as Error).message}`)
    }
  }

  void poll()
  timer = setInterval(poll, POLL_MS)
}

export function deactivate(): void {
  if (timer) clearInterval(timer)
}
