import "dotenv/config"
import { Octokit } from "octokit"

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error("Please set " + name)
  }
  return value
}

export const apiBaseUrl = "https://api.github.com"
export const owner = getEnv("GITHUB_OWNER")
export const repo = getEnv("GITHUB_REPO")
export const token = getEnv("GITHUB_TOKEN")

export const octokit = new Octokit({ auth: token })
