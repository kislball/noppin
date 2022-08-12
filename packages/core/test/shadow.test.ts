import { describe, expect, test } from 'vitest'
import { createShadow } from '../src/app/service'

describe('shadow', () => {
  test('modifications on shadow derivative does not another derivative', () => {
    const key = Symbol('')
    const [, initialShadow] = createShadow()
    const derivativeOne = initialShadow(builder => builder.set(key, 456))
    const derivativeTwo = initialShadow(builder => builder.set(key, 123))

    expect(derivativeOne.metadata.get(key)).not.toBe(derivativeTwo.metadata.get(key))
  })
})
