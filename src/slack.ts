// Pure helpers: find the Slack tab among Orca's browser tabs and read its unread count from the
// page title, e.g. "ai-data (Channel) - Visma Group - 3 new items - Slack".

export type Tab = { browserPageId: string; url: string; title: string; worktreeId: string; active?: boolean }

export const SLACK_URL = 'https://app.slack.com/client'

export function findSlackTab(tabs: Tab[]): Tab | undefined {
  const slack = tabs.filter((t) => /^https:\/\/app\.slack\.com\//.test(t.url))
  return slack.find((t) => t.active) ?? slack[0]
}

export function unreadFromTitle(title: string): number {
  const m = /(\d+)\s+new items?\b/i.exec(title)
  return m ? Number(m[1]) : 0
}
