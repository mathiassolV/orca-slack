import { assert, test } from 'orca/testing'
import { findSlackTab, unreadFromTitle } from './slack'

test('reads the unread count from the Slack title', () => {
  assert.equal(unreadFromTitle('ai-data-deployment (Channel) - Acme - 3 new items - Slack'), 3)
  assert.equal(unreadFromTitle('general (Channel) - Acme - 1 new item - Slack'), 1)
  assert.equal(unreadFromTitle('general (Channel) - Acme - Slack'), 0)
})

test('prefers the active app.slack.com tab and ignores slack.com landing pages', () => {
  const tabs = [
    { browserPageId: 'a', url: 'https://slack.com/', title: 'Welcome back | Slack', worktreeId: 'w' },
    { browserPageId: 'b', url: 'https://app.slack.com/client/E1/C1', title: 'x', worktreeId: 'w' },
    { browserPageId: 'c', url: 'https://app.slack.com/client/E1/C2', title: 'y', worktreeId: 'w', active: true },
  ]
  assert.equal(findSlackTab(tabs)?.browserPageId, 'c')
  assert.equal(findSlackTab(tabs.slice(0, 1)), undefined)
})
