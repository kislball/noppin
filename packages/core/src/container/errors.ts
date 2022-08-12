import { createErrorScope } from '../errors'

/**
 * Creates error with Container scope.
 */
export const createContainerError = (name: string) => createErrorScope(name, 'Container')

/**
 * Indicates that provider was not found.
 */
export const ProviderNotFoundError = createContainerError('ProviderNotFoundError')

/**
 * Indicates that provider has unknown type.
 */
export const UnknownProviderTypeError = createContainerError('UnknownProviderTypeError')
