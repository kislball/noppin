/**
 * Creates an error with given name and scope.
 */
export const createErrorScope = (name: string, scope: string) => class extends Error {
  constructor (m: string) {
    super(m)
    this.name = `${scope}(${name})`
  }
}
