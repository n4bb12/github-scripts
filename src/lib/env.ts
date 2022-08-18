import "dotenv/config"

export function getEnv(name: string) {
  return process.env[name]
}

export function getEnvOrFail(name: string) {
  const value = getEnv(name)
  if (!value) {
    throw new Error(`Missing environment variable ${name}`)
  }
  return value
}
