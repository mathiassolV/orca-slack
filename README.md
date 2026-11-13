# Slack for Orca

A small Orca plugin that tells you about new Slack messages while you work in Orca.
Open Slack yourself in Orca's browser (`https://app.slack.com/client`); the plugin watches that tab.

- **Unread count in the status bar.** Shows `Slack N` when your Slack tab has unread items.
- **Desktop notification** when the count goes up.

No Slack token or Slack app is needed. Every 3 seconds the plugin reads the unread count from the
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
