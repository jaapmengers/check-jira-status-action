const core = require('@actions/core');
const github = require('@actions/github');
const JiraApi = require('jira-client');

async function run() {
  try {
    const { ref } = github.context.payload;
    const issueNr = ref.match(/.*(A20-\d{4}).*/)[1]

    console.log(`Found issue nr ${issueNr}`);

    const status = await getJiraInfo(issueNr);

    console.log(`Has status ${status}`);

    const acceptable = ['PO review', 'Done']

    if (!acceptable.includes(status)) {
      throw 'PR cannot be merged until JIRA ticket has state Done or PO review';
    }
  } catch (error) {
    console.error('Got error', error);
    core.setFailed(error.message);
  }
}

async function getJiraInfo(issueNumber) {
  const user = core.getInput('jira_user');
  const token = core.getInput('jira_token');
  const url = core.getInput('jira_url');

  const jira = new JiraApi({
    protocol: 'https',
    host: url,
    username: user,
    password: token,
    apiVersion: '2',
    strictSSL: true
  });

  const info = await jira.findIssue(issueNumber);
  return info.fields.status.name;
}

run();