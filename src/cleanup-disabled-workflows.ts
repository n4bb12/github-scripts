import chalk from "chalk"
import { deleteWorkflowRun, getWorkflowRuns, getWorkflows } from "./lib/actions.js"

async function main() {
  const workflows = await getWorkflows()
  const disabledWorkflows = workflows.filter((item) => item.state === "disabled_manually")

  for (const workflow of disabledWorkflows) {
    const runs = await getWorkflowRuns(workflow)

    console.log("--------------------------------------------------")
    console.log(`Deleting ${chalk.red(runs.length)} runs for workflow ${chalk.red(workflow.name)}`)
    console.log("--------------------------------------------------")

    for (const run of runs) {
      console.log(`Deleting workflow=${chalk.red(workflow.name)} run=${chalk.red(run.id)}`)
      await deleteWorkflowRun(workflow, run)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
