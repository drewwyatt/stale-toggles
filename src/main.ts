import * as core from '@actions/core'
import { getFeatures } from './optimizely'

const run = async () => {
  try {
    const project = core.getInput('project', { required: true })
    const token = core.getInput('token', { required: true })
    core.debug(`Project: ${project}`)
    core.debug(`Token: ${token}`)
    const features = await getFeatures(project, token)
    core.debug(`features: ${features}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
