import { setOutput, setFailed, info } from '@actions/core'
import add from 'date-fns/add'
import isAfter from 'date-fns/isAfter'
import * as inputs from './inputs'
import { getFeatures } from './optimizely'

const run = async () => {
  try {
    info(`getting Features for project "${inputs.PROJECT}"...`)
    const features = await getFeatures(inputs.PROJECT, inputs.TOKEN)
    if (features.length === 0) {
      info('no features found. exiting...')
      setOutput('features', [])
      return
    }

    info(`found ${features.length} features`)
    info('getting primary environment...')
    const primaryEnvironment = Object.keys(features[0].environments).reduce<
      string | null
    >((acc, key) => {
      if (acc !== null) {
        return acc
      }

      return features[0].environments[key].is_primary ? key : null
    }, null)

    if (primaryEnvironment === null) {
      throw new Error(`could not find a primary environment`)
    }

    info(`primary environment found: "${primaryEnvironment}"`)
    info('getting enabled features...')
    const enabledFeatures = features.filter(
      f =>
        f.environments[primaryEnvironment].rollout_rules.findIndex(
          r => r.enabled,
        ) > -1,
    )
    if (enabledFeatures.length === 0) {
      info('no enabled features. exiting...')
      setOutput('features', [])
      return
    }

    info(`found ${enabledFeatures.length} enabled features`)
    info(
      `checking for features enabled for ${inputs.DAYS_UNTIL_STALE} days or more...`,
    )

    const stale = enabledFeatures.filter(f =>
      isAfter(
        new Date(),
        add(new Date(f.last_modified), { days: inputs.DAYS_UNTIL_STALE }),
      ),
    )

    info(`found ${stale.length} stale features`)
    setOutput('features', stale)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
