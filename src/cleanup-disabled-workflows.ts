import "dotenv/config"

import got from "got"

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error("Please set " + name)
  }
  return value
}

const apiBaseUrl = "https://api.github.com"
const org = getEnv("GITHUB_ORG")
const repo = getEnv("GITHUB_REPO")
const token = getEnv("GITHUB_TOKEN")

const http = got.extend({
  responseType: "json",
  prefixUrl: `${apiBaseUrl}/repos/${org}/${repo}/actions/`,
  searchParams: {
    per_page: 100,
  },
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

async function getWorkflows(): Promise<any[]> {
  const url = `workflows`
  const response = await http.get<any>(url)
  return response.body.workflows
}

async function getWorkflowRuns(workflow: any): Promise<any[]> {
  const url = `workflows/${workflow.id}/runs`
  const response = await http.get<any>(url)
  return response.body.workflow_runs
}

async function deleteWorkflowRun(workflow: any, run: any) {
  console.log(`Deleting workflow=${workflow.name} run=${run.id}`)
  const url = `runs/${run.id}`
  await http.delete(url)
}

async function main() {
  const workflows = await getWorkflows()

  const disabledWorkflows = workflows.filter(
    (w) => w.state === "disabled_manually",
  )

  for (const workflow of disabledWorkflows) {
    while (true) {
      const runs = await getWorkflowRuns(workflow)

      if (!runs.length) {
        break
      }

      for (const run of runs) {
        await deleteWorkflowRun(workflow, run)
      }
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
