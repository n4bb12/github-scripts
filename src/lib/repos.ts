import { octokit, config } from "./config.js"

import { components } from "@octokit/openapi-types"

export type Deployment = components["schemas"]["deployment"]

export async function getRepos() {
  // https://octokit.github.io/rest.js/v18#repos-list-for-org
  return octokit.paginate(octokit.rest.repos.listForOrg, {
    org: config.org,
    per_page: 100,
  })
}

export async function getRepoNamesToProcess() {
  if (config.repos?.length) {
    return config.repos
  }
  const repos = await getRepos()
  return repos
    .filter((repo) => !repo.archived)
    .map((repo) => repo.name)
    .sort()
}

export async function getEnvironments(repo: string) {
  // https://octokit.github.io/rest.js/v18#repos-get-all-environments
  return octokit.paginate(octokit.rest.repos.getAllEnvironments, {
    owner: config.org,
    repo,
    per_page: 100,
  })
}

export async function getDeployments(repo: string) {
  // https://octokit.github.io/rest.js/v18#repos-list-deployments
  return octokit.paginate(octokit.rest.repos.listDeployments, {
    owner: config.org,
    repo,
    per_page: 100,
  })
}

export async function deleteDeployment(repo: string, deployment: Deployment) {
  // https://octokit.github.io/rest.js/v18#repos-delete-deployment
  return await octokit.rest.repos.deleteDeployment({
    owner: config.org,
    repo,
    deployment_id: deployment.id,
  })
}
