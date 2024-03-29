import { Endpoints } from "@octokit/types"
import { octokit, config } from "./config.js"

export type Workflow = Endpoints["GET /repos/{owner}/{repo}/actions/workflows"]["response"]["data"]["workflows"][0]
export type WorkflowRun =
  Endpoints["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"]["response"]["data"]["workflow_runs"][0]

export async function getWorkflows(repo: string) {
  // https://octokit.github.io/rest.js/v18#actions-list-repo-workflows
  return octokit.paginate(octokit.rest.actions.listRepoWorkflows, {
    owner: config.org,
    repo,
    per_page: 100,
    state: "open",
  })
}

export async function getWorkflowRuns(repo: string, workflow: Workflow) {
  // https://octokit.github.io/rest.js/v18#actions-list-workflow-runs
  return octokit.paginate(octokit.rest.actions.listWorkflowRuns, {
    owner: config.org,
    repo,
    per_page: 100,
    workflow_id: workflow.id,
  })
}

export async function deleteWorkflowRun(repo: string, run: WorkflowRun) {
  // https://octokit.github.io/rest.js/v18#actions-delete-workflow-run
  return octokit.rest.actions.deleteWorkflowRun({
    owner: config.org,
    repo,
    run_id: run.id,
  })
}
