import "dotenv/config"
import { Octokit } from "octokit"
import { getEnv, getEnvOrFail } from "./env.js"

export const config = {
  org: getEnvOrFail("GITHUB_ORG"),
  repos: getEnv("GITHUB_REPOS"),
  token: getEnvOrFail("GITHUB_TOKEN"),
}

export const octokit = new Octokit({ auth: config.token })
