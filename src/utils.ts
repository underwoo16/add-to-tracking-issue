import * as core from '@actions/core'

const TICK_MARKS = '```'
const BODY_REGEX =
  /(?<beforeTasklist>[\S\s]*?)(?<taskListOpener>```\[tasklist\]\s*)(?<taskListName>### Tasks\s*)?(?<taskList>[\S\s]*?)(?<taskListEnder>```)(?<afterTaskList>[\S\s]*)/

interface MatchingGroups {
  beforeTasklist?: string
  taskList?: string
  taskListOpener?: string
  taskListName?: string
  taskListEnder?: string
  afterTaskList?: string
}

export function addIssueLinkToBody(
  issueLink?: string | null,
  trackingIssueBody?: string | null
): string | null | undefined {
  if (!issueLink) {
    core.debug('No issue link provided, skipping adding to tracking issue')
    return trackingIssueBody
  }

  if (!trackingIssueBody) {
    core.debug('No tracking issue body provided, creating new tasklist')
    return buildNewTaskList(issueLink)
  }

  if (trackingIssueBody.includes(issueLink)) {
    core.debug('Issue link already exists in tracking issue body, skipping')
    return trackingIssueBody
  }

  if (!BODY_REGEX.test(trackingIssueBody)) {
    core.debug(
      'No matching tasklist found, adding new task list and issue link'
    )
    return addNewTaskListToBody(issueLink, trackingIssueBody)
  }

  const match = BODY_REGEX.exec(trackingIssueBody)
  if (!match || !match.groups) {
    core.debug(
      'No matching tasklist found, adding new task list and issue link'
    )
    return addNewTaskListToBody(issueLink, trackingIssueBody)
  }

  const {taskList} = match.groups
  if (taskList === null || taskList === undefined) {
    core.debug('No matching task list found, adding new task list')
    return addNewTaskListToBody(issueLink, trackingIssueBody)
  }

  return rebuildBodyFromGroups(issueLink, match.groups)
}

function buildIssueLink(issueLink: string): string {
  return `- [ ] ${issueLink}\n`
}

function buildNewTaskList(issueLink: string): string {
  return `${TICK_MARKS}[tasklist]\n### Tasks\n${buildIssueLink(
    issueLink
  )}${TICK_MARKS}`
}

function addNewTaskListToBody(
  issueLink: string,
  trackingIssueBody: string
): string {
  return `${trackingIssueBody}\n${buildNewTaskList(issueLink)}`
}

function rebuildBodyFromGroups(
  issueLink: string,
  groups: MatchingGroups
): string {
  const {
    beforeTasklist,
    taskListOpener,
    taskListName,
    taskList,
    taskListEnder,
    afterTaskList
  } = groups

  return [
    beforeTasklist,
    taskListOpener,
    taskListName,
    taskList,
    buildIssueLink(issueLink),
    taskListEnder,
    afterTaskList
  ].join('')
}

export function getTrackingIssueLabel(): string {
  const input = core.getInput('tracking-issue-label')

  if (!input) return 'tracking-issue'

  return input
}
