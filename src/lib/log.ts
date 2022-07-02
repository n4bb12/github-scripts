export function trimMessage(message: string) {
  const lines = message.split("\n")
  const line1 = lines[0]

  return lines.length > 1 || line1.length > 80 ? `${line1.substring(0, 80).trim()}…` : line1
}
