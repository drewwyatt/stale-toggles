/* eslint-disable @typescript-eslint/no-explicit-any */
import { info } from '@actions/core'
import { pipe } from 'fp-ts/pipeable'
import { TaskEither, map, left, right } from 'fp-ts/TaskEither'
import { TypeOf } from 'io-ts/lib/Decoder'
import { Features as FeaturesModel, Features, Reason } from '../models'

export type Features = TypeOf<typeof FeaturesModel>

export type MainTaskEither = TaskEither<unknown, Features>
export type MainTask = (features: Features) => MainTaskEither

type TaskFn = (...args: any[]) => MainTaskEither
type Message<T extends any> = string | ((t: T) => string)

const log = <T extends any>(msg: Message<T>, t: T) =>
  info(typeof msg === 'string' ? msg : msg(t))
export const withLogging = <T extends TaskFn>(
  start: Message<Parameters<T>[0]>, // TODO?
  complete: ReturnType<T> extends TaskEither<infer _, infer R>
    ? Message<R>
    : never,
  task: T,
): MainTask => a => {
  log(start, a)
  return pipe(
    task(a),
    map(b => {
      log(complete, b)
      return b
    }),
  )
}

export const guardLength = (reason: Reason): MainTask => features =>
  features.length === 0 ? left(reason) : right(features)
