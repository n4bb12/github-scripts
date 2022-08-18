import chalk from "chalk"
import { deleteWorkflowRun, getWorkflowRuns, getWorkflows } from "./lib/actions.js"
import { trimMessage } from "./lib/log.js"
import { getRepoNamesToProcess } from "./lib/repos.js"

for (const repoName of await getRepoNamesToProcess()) {
  console.log(`Repository: ${repoName}`)

  const workflows = await getWorkflows(repoName)
  const disabledWorkflows = workflows.filter((workflow) => workflow.state === "disabled_manually")

  for (const workflow of disabledWorkflows) {
    console.log(`  Workflow: ${workflow.name}`)

    const runs = await getWorkflowRuns(repoName, workflow)

    console.log(`    Deleting ${chalk.red(runs.length)} runs...`)

    for (const run of runs.sort((a, b) => a.created_at.localeCompare(b.created_at))) {
      console.log(
        [
          "Deleting",
          `workflow=${chalk.red(repoName, workflow.name)}`,
          `run=${chalk.red(run.name)}`,
          `created_at=${chalk.red(run.created_at)}`,
          `run=${chalk.red(trimMessage(run.head_commit.message))}`,
        ].join(" "),
      )

      await deleteWorkflowRun(repoName, run)
    }
  }
}
