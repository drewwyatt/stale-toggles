import { setOutput, setFailed } from '@actions/core'
import * as inputs from './inputs'
import { getFeatures } from './optimizely'

const run = async () => {
  try {
    const features = await getFeatures(inputs.PROJECT, inputs.TOKEN)
    setOutput('features', features)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
