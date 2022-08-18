import { octokit, config} from "./config.js"

export async function getOpenPullRequests(repo: string) {
  // https://octokit.github.io/rest.js/v18#pulls-list
  return octokit.paginate(octokit.rest.pulls.list, {
    owner: config.org,
    repo,
    per_page: 100,
    state: "open",
  })
}
