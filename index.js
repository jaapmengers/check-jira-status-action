const core = require('@actions/core');
const github = require('@actions/github');
const JiraApi = require('jira-client');

async function run() {
  try {
    getJiraInfo('A20-4053');

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(JSON.stringify(payload, null, 2));
  } catch (error) {
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

  console.log(JSON.stringify(info, null, 2));
}

run();