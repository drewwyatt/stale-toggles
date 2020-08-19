import { info } from '@actions/core'
import { pipe } from 'fp-ts/lib/pipeable'
import { TaskEither, left, right, chain, map } from 'fp-ts/TaskEither'
import { Reason } from '../models'
import { Features, MainTask, guardLength, withLogging } from './utils'

const getPrmaryEnv = (features: Features): TaskEither<Reason, string> => {
  info('getting primary environment...')
  const env = Object.keys(features[0].environments).reduce<string | null>(
    (acc, key) => {
      if (acc !== null) {
        return acc
      }

      return features[0].environments[key].is_primary ? key : null
    },
    null,
  )

  if (env === null) {
    // TODO: this should probably not be an "EarlyExit"
    return left(Reason.NoPrimaryEnvironment)
  }

  info(`primary environment found: "${env}"`)
  return right(env)
}

const toEnabledFeatures: MainTask = features =>
  pipe(
    getPrmaryEnv(features),
    map(env =>
      features.filter(
        f => f.environments[env].rollout_rules.findIndex(r => r.enabled) > -1,
      ),
    ),
  )

export default withLogging(
  'getting enabled features...',
  f => `found ${f.length} enabled features`,
  (f: Features) =>
    pipe(toEnabledFeatures(f), chain(guardLength(Reason.NoEnabledFeatures))),
)
