import { setOutput, setFailed, info } from '@actions/core'
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

    info(`${features.length} features retrieved.`)
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

    info(`found ${enabledFeatures.length} enabled features...`)

    setOutput('features', enabledFeatures)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
