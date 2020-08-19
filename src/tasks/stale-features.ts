import add from 'date-fns/add'
import isAfter from 'date-fns/isAfter'
import { pipe } from 'fp-ts/lib/pipeable'
import { chain, right } from 'fp-ts/TaskEither'
import { DAYS_UNTIL_STALE as days } from '../inputs'
import { Reason } from '../models'
import { MainTask, guardLength, withLogging, Features } from './utils'

const toStaleFeatures: MainTask = features =>
  right(
    features.filter(f =>
      isAfter(new Date(), add(new Date(f.last_modified), { days })),
    ),
  )

export default withLogging(
  `checking for features enabled for ${days} days or more...`,
  f => `found ${f.length} stale features`,
  (f: Features) =>
    pipe(toStaleFeatures(f), chain(guardLength(Reason.NoStaleFeatures))),
)
