import { Endpoints } from "@octokit/types"

export type Workflow = Endpoints["GET /repos/{owner}/{repo}/actions/workflows"]["response"]["data"]["workflows"][0]
export type WorkflowRun =
  Endpoints["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"]["response"]["data"]["workflow_runs"][0]
