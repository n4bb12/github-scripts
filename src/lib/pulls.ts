import { octokit, owner, repo } from "./config.js"

export async function getOpenPullRequests() {
  // https://octokit.github.io/rest.js/v18#pulls-list
  return octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo,
    per_page: 100,
    state: "open",
  })
}
