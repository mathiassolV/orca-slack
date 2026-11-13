# Slack for Orca

A small Orca plugin for using Slack inside Orca's built-in browser.

- **Unread count in the status bar.** Shows `Slack N` when your Slack tab has unread items.
- **Desktop notification** when the count goes up.
- **Open Slack** from the status bar item, `Ctrl/Cmd+Shift+L`, or the command palette
  ("Slack: Open in Orca browser"). It focuses your Slack tab, or opens `https://app.slack.com/client`.

No Slack token or Slack app is needed. Every 5 seconds the plugin reads the unread count from the
title of the Slack tab you are logged into in Orca's browser (`... - 3 new items - Slack`), using
the `orca tab` CLI.

## Install

In Orca: Settings → Plugins → install from repository, `mathiassolV/orca-slack`. Or:

```sh
orca plugin install mathiassolV/orca-slack
```

It runs a worker and shows notifications, so Orca asks you to approve it.

## Limits

- It counts unread items only. It can't tell mentions from DMs or show who sent a message.
- A Slack tab (`app.slack.com`) must be open somewhere in Orca.
- If Slack changes its page title format, the count stops updating.

## Develop

```sh
orca plugin validate .
orca plugin test .
orca plugin dev watch .
```
