import { Endpoints } from "@octokit/types"
import chalk from "chalk"
import "dotenv/config"
import { octokit, owner, repo } from "./config.js"

type Workflow = Endpoints["GET /repos/{owner}/{repo}/actions/workflows"]["response"]["data"]["workflows"][0]
type WorkflowRun =
  Endpoints["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"]["response"]["data"]["workflow_runs"][0]

async function getWorkflows() {
  // https://octokit.github.io/rest.js/v18#actions-list-repo-workflows
  return octokit.paginate(octokit.rest.actions.listRepoWorkflows, {
    owner,
    repo,
    per_page: 100,
    state: "open",
  })
}

async function getWorkflowRuns(workflow: Workflow) {
  // https://octokit.github.io/rest.js/v18#actions-list-workflow-runs
  return octokit.paginate(octokit.rest.actions.listWorkflowRuns, {
    owner,
    repo,
    per_page: 100,
    workflow_id: workflow.id,
  })
}

async function deleteWorkflowRun(workflow: Workflow, run: WorkflowRun) {
  console.log(`Deleting workflow=${chalk.red(workflow.name)} run=${chalk.red(run.id)}`)

  // https://octokit.github.io/rest.js/v18#actions-delete-workflow-run
  return octokit.rest.actions.deleteWorkflowRun({
    owner,
    repo,
    run_id: run.id,
  })
}

async function main() {
  const workflows = await getWorkflows()
  const disabledWorkflows = workflows.filter((item) => item.state === "disabled_manually")

  for (const workflow of disabledWorkflows) {
    const runs = await getWorkflowRuns(workflow)

    console.log("--------------------------------------------------")
    console.log(`Deleting ${chalk.red(runs.length)} runs for workflow ${chalk.red(workflow.name)}`)
    console.log("--------------------------------------------------")

    for (const run of runs) {
      await deleteWorkflowRun(workflow, run)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
