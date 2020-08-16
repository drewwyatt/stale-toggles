import { debug, setOutput, setFailed } from '@actions/core'
import * as inputs from './inputs'
import { getFeatures } from './optimizely'

const listInputs = () => {
  for (const key of Object.keys(inputs)) {
    debug(`[input][${key}] ${inputs[key as keyof typeof inputs]}`)
  }
}

const run = async () => {
  try {
    listInputs()
    const features = await getFeatures(inputs.PROJECT, inputs.TOKEN)
    setOutput('features', features)
  } catch (error) {
    setFailed(error.message)
  }
}

run()
