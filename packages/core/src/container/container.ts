import { ProviderNotFoundError, UnknownProviderTypeError } from './errors'
import { FactoryProvider, isFactoryProvider, Provider, resolveToken, Scope, Token, TokenResolvable } from './provider'

/**
 * Dependency injection container.
 *
 * Responsible for resolving dependencies by their tokens and
 * creating such.
 *
 * Container is lazy, it only initiates services when requested.
 */
export interface Container {
  /**
   * Adds a provider to container.
   */
  register(provider: Provider): void
  /**
   * Resolves service.
   */
  resolve<T>(token: TokenResolvable): Promise<T>
}

/**
 * Delegate, which returns a container.
*/
export type ContainerFactory = () => Container

/**
 * Creates a {@link Container}.
 */
export const createContainer: ContainerFactory = () => {
  const providers = new Map<Token, Provider>()
  const singletons = new Map<Token, unknown>()

  const getFactorySingleton = async <T>(provider: FactoryProvider<T>): Promise<T> => {
    const has = singletons.get(provider.token)
    if (has !== undefined) return has as T

    const created = await provider.useFactory(container)
    singletons.set(provider.token, created)

    return created
  }

  const register = (provider: Provider) => {
    providers.set(provider.token, provider)
  }

  const resolve = async <T>(token: TokenResolvable): Promise<T> => {
    const resolvedToken = resolveToken(token)
    const provider = providers.get(resolvedToken)
    if (provider === undefined) {
      throw new ProviderNotFoundError(`Provider with token ${String(resolvedToken)} was not found. Make sure you have registered it.`)
    }

    if (isFactoryProvider(provider)) {
      if (provider.scope === Scope.Singleton) {
        return getFactorySingleton<T>(provider as FactoryProvider<T>)
      } else {
        return provider.useFactory(container) as Promise<T>
      }
    } else {
      throw new UnknownProviderTypeError(`Provider with token ${String(resolvedToken)} has unknown type. Please check, if your custom builders work properly.`)
    }
  }

  const container = {
    resolve,
    register
  }

  return container
}
