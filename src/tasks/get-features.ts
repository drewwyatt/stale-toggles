import { Reason } from '../models'
import { getFeatures as fetch } from '../optimizely'
import { MainTaskEither, guardLength, withLogging } from './utils'
import { pipe } from 'fp-ts/lib/function'
import { chain } from 'fp-ts/lib/TaskEither'

const getFeatures = (...params: Parameters<typeof fetch>): MainTaskEither =>
  pipe(fetch(...params), chain(guardLength(Reason.NoFeatures)))

export default (...params: Parameters<typeof fetch>) =>
  withLogging(
    `getting Features for project "${params[0]}"...`,
    f => `found ${f.length} features`,
    () => getFeatures(...params),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )(undefined as any)
