import chalk from "chalk"
import { deleteWorkflowRun, getWorkflowRuns, getWorkflows } from "./lib/actions.js"
import { trimMessage } from "./lib/log.js"

const workflows = await getWorkflows()
const disabledWorkflows = workflows.filter((item) => item.state === "disabled_manually")

for (const workflow of disabledWorkflows) {
  const runs = await getWorkflowRuns(workflow)

  console.log("--------------------------------------------------")
  console.log(`Deleting ${chalk.red(runs.length)} runs for workflow ${chalk.red(workflow.name)}`)
  console.log("--------------------------------------------------")

  for (const run of runs.sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    console.log(
      [
        "Deleting",
        `workflow=${chalk.red(workflow.name)}`,
        `run=${chalk.red(run.name)}`,
        `created_at=${chalk.red(run.created_at)}`,
        `run=${chalk.red(trimMessage(run.head_commit.message))}`,
      ].join(" "),
    )

    await deleteWorkflowRun(workflow, run)
  }
}
