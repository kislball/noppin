/**
 * Creates an error with given name.
 */
export const createError = (name: string) => class extends Error {
  constructor (message: any) {
    super(message)
    this.name = name
  }
}

// Althougth these errors are modeled after HTTP error model,
// they are not limited to HTTP. They provide a common error layer
// for all platforms.

/**
 * Indicates that something was not found.
 * @class
 */
export const NotFound = createError('NotFound')

/**
 * Indicates that user is not authorized.
 * @class
 */
export const Unauthorized = createError('Unauthorized')

/**
 * Indicates that user does not have permissions to perform some operation.
 * @class
 */
export const Forbidden = createError('Forbidden')

/**
 * Indicates that requested provided is invalid.
 * @class
 */
export const BadRequest = createError('BadRequest')
