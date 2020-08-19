import { setOutput, setFailed, info } from '@actions/core'
import { fold } from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'
import * as TE from 'fp-ts/TaskEither'
import * as inputs from './inputs'
import { EarlyExit } from './models'
import { getFeatures, toEnabledFeatures, toStaleFeatures } from './tasks'

const run = async () => {
  try {
    pipe(
      getFeatures(inputs.PROJECT, inputs.TOKEN),
      TE.chain(toEnabledFeatures),
      TE.chain(toStaleFeatures),
      TE.map(features => {
        setOutput('features', features)
        return features
      }),
      TE.mapLeft(e => {
        pipe(
          EarlyExit.decode(e),
          fold(
            // TODO: do other error handling
            msg => setFailed(String(msg)),
            reason => {
              // everything is cool
              // EarlyExit just means no work to do
              info(reason)
              setOutput('feature', [])
            },
          ),
        )
      }),
    )()
  } catch (error) {
    setFailed(error.message)
  }
}

run()
