import { createContainer } from '../src/container/container'
import { test, describe, expect } from 'vitest'
import { Scope } from '../src/container/provider'

describe('Container', () => {
  test('creates without errors', () => {
    createContainer()
  })

  test('creates without errors, registers singleton provider and resolves it correctly', async () => {
    const container = createContainer()
    const token = Symbol('')

    container.register({
      scope: Scope.Singleton,
      token,
      useFactory: () => Math.random()
    })

    const one = await container.resolve(token)
    const two = await container.resolve(token)

    expect(one).toBe(two)
  })

  test('creates without errors, registers transient provider and resolves it correctly', async () => {
    const container = createContainer()
    const token = Symbol('')

    container.register({
      scope: Scope.Transient,
      token,
      useFactory: () => Math.random()
    })

    const one = await container.resolve(token)
    const two = await container.resolve(token)

    expect(one).not.toBe(two)
  })
})
