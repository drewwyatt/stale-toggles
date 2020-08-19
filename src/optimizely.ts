import axios from 'axios'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/pipeable'
import * as TE from 'fp-ts/TaskEither'
import { Features } from './models'

const makeRequest = (project: string, token: string) =>
  TE.tryCatch(
    async () =>
      axios.get(
        `https://api.optimizely.com/v2/features?project_id=${project}&per_page=99`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          responseType: 'json',
        },
      ),
    err => new Error(String(err)), // TODO: decode error message
  )

export const getFeatures = (...params: Parameters<typeof makeRequest>) =>
  pipe(
    makeRequest(...params),
    TE.map(r => r.data),
    TE.chain(r =>
      pipe(
        Features.decode(r),
        E.mapLeft(e => new Error(String(e))),
        TE.fromEither,
      ),
    ),
  )

// const
