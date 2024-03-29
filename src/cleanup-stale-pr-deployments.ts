import chalk from "chalk"
import { getOpenPullRequests } from "./lib/pulls.js"
import { deleteDeployment, getDeployments, getRepoNamesToProcess } from "./lib/repos.js"

for (const repoName of await getRepoNamesToProcess()) {
  console.log(`Repository: ${repoName}`)

  const openPulls = await getOpenPullRequests(repoName)
  const openPullNumbers = openPulls.map((pull) => pull.number)

  const deployments = await getDeployments(repoName)
  const staleDeployments = deployments
    .filter((deployment) => /\bpr-\d+\b/.test(deployment.environment))
    .filter((deployment) => !openPullNumbers.some((pullNumber) => deployment.environment.includes("pr-" + pullNumber)))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  console.log(`  Deleting ${chalk.red(staleDeployments.length)} stale deployments`)

  for (const deployment of staleDeployments) {
    console.log(
      [
        "Deleting",
        `environment=${chalk.red(deployment.environment)}`,
        `deployment=${chalk.red(deployment.id)}`,
        `created_at=${chalk.red(deployment.created_at)}`,
      ].join(" "),
    )

    await deleteDeployment(repoName, deployment)
  }
}
