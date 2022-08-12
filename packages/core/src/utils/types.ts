/**
 * Represents a value that may or not be a promise.
 */
export type MaybePromise<T> = Promise<T> | T

/**
 * Resolves MaybePromise<T> into Promise<T>.
 */
export const resolveMaybePromise = async <T>(p: MaybePromise<T>) => p

/**
 * Represents a value that is either T[] or T into T[].
 */
export type MaybeArray<T> = T | T[]

/**
 * Resolves MaybeArray<T> into T[].
 */
export const resolveMaybeArray = <T>(p: MaybeArray<T>) => Array.isArray(p) ? p : [p]
