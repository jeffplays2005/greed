/**
 * Converts timestamps in miliseconds to discord's timestamp format.
 *
 * @param timestamp in miliseconds
 * @param flags optional flags to pass to the timestamp
 * @returns the timestamp in discord's timestamp format
 */
export function milisecondsToDiscordFormat(timestamp: string, flags = "") {
  return `<t:${`${timestamp}`.slice(0, -3)}${flags}>`
}
