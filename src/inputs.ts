import { getInput } from '@actions/core'

const getDaysUntilStale = () => {
  const rawInput = getInput('days-until-stale')
  const input = rawInput === '' ? 30 : Number(rawInput)
  if (!Number.isInteger(input)) {
    throw new Error(
      `input: "days-until-stale" must be an integer. Found: "${rawInput}"`,
    )
  }

  return input
}

export const DAYS_UNTIL_STALE = getDaysUntilStale()
export const PROJECT = getInput('project', { required: true })
export const TOKEN = getInput('token', { required: true })
