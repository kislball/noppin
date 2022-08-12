import { Token } from '../container/provider'

/**
 * Creates a token with given scope and name.
 */
export const token = (name: string, scope = 'Service'): Token => Symbol(`${scope}(${name})`)
