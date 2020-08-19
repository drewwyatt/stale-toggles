import { pipe } from 'fp-ts/pipeable'
import * as D from 'io-ts/lib/Decoder'

const DATESTRING_PARSE_ERROR = 'unable to parse date string'
const DateString: D.Decoder<unknown, Date> = {
  decode: u => {
    if (typeof u !== 'string') {
      return D.failure(u, DATESTRING_PARSE_ERROR)
    }

    const timestamp = Date.parse(u)
    if (Number.isNaN(timestamp)) {
      return D.failure(u, DATESTRING_PARSE_ERROR)
    }

    return D.success(new Date(timestamp))
  },
}

const RolloutRule = D.type({
  audience_conditions: D.string,
  enabled: D.boolean,
  percentage_included: D.number,
})

const Environment = D.type({
  id: D.number,
  is_primary: D.boolean,
  rollout_rules: D.array(RolloutRule),
})

const Feature = D.type({
  archived: D.boolean,
  created: DateString,
  description: D.string,
  environments: D.record(Environment),
  id: D.number,
  key: D.string,
  last_modified: DateString,
  name: D.string,
  project_id: D.number,
  // TODO: variables?
})

export const Features = D.array(Feature)

export enum Reason {
  NoFeatures = 'no features found',
  NoPrimaryEnvironment = 'could not find a primary environment',
  NoEnabledFeatures = 'no enabled features found',
  NoStaleFeatures = 'no stale features found',
}

type EarlyExit = Reason

export const EarlyExit = pipe(
  D.string,
  D.refine(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (str): str is EarlyExit => Object.values(Reason).includes(str as any),
    'EarlyExit',
  ),
)
