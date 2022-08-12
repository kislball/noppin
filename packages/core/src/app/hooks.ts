import { MaybePromise } from '../utils/types'

/**
 * Adds {@link OnStart} hook to service.
 */
export const onStart = (h: () => MaybePromise<void>): OnStart => ({
  [onStartKey]: h
})

export const onStartKey = Symbol('Hook(OnStart)')

/**
 * OnStart hook runs once all services have been initialized.
 */
export interface OnStart {
  [onStartKey]: () => MaybePromise<void>
}

/**
 * Adds {@link OnStop} hook to service.
 */
export const onStop = (h: () => MaybePromise<void>): OnStop => ({
  [onStopKey]: h
})

export const onStopKey = Symbol('Hook(OnStop)')

/**
 * OnStop hook runs during exit event of process object.
 */
export interface OnStop {
  [onStopKey]: () => MaybePromise<void>
}
