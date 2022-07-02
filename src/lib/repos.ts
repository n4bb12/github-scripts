import { Endpoints } from "@octokit/types"
import { octokit, owner, repo } from "./config.js"

export type Deployment = Endpoints["GET /repos/{owner}/{repo}/deployments"]["response"]["data"][0]

export async function getEnvironments() {
  // https://octokit.github.io/rest.js/v18#repos-get-all-environments
  return octokit.paginate(octokit.rest.repos.getAllEnvironments, {
    owner,
    repo,
    per_page: 100,
  })
}

export async function getDeployments() {
  // https://octokit.github.io/rest.js/v18#repos-list-deployments
  return octokit.paginate(octokit.rest.repos.listDeployments, {
    owner,
    repo,
    per_page: 100,
  })
}

export async function deleteDeployment(deployment: Deployment) {
  // https://octokit.github.io/rest.js/v18#repos-delete-deployment
  return await octokit.rest.repos.deleteDeployment({
    owner,
    repo,
    deployment_id: deployment.id,
  })
}
