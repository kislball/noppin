import { Injectable, resolveToken, Scope, Token, TokenResolvable } from '../container/provider'
import { MaybePromise } from '../utils/types'
import { token as createToken, token } from '../utils/token'

/**
 * Provider function is a function which accepts any arguments and returns T.
 */
export type ProviderFunction<T> = (...args: any[]) => MaybePromise<T>

/**
 * Service is a minimal unit in a Noppin application.
 *
 * Service is identified by a unique token. It can inject other
 * services.
 */
export interface Service<T = unknown> extends Injectable {
  /**
   * Provider function which returns an instance of a service.
   */
  provider: ProviderFunction<T>
  /**
   * Dependencies of this service.
   */
  dependencies: Token[]
  /**
   * Metadata of service.
   */
  metadata: Map<Token, unknown>
}

/**
 * Utility for creating service manifests.
 */
export interface ServiceBuilder<T = unknown> {
  /**
   * Builds service.
   */
  build(): Service<T>
  /**
   * Adds dependencies to service.
   */
  inject(...resolvables: TokenResolvable[]): ServiceBuilder<T>
  /**
   * Applies mixin.
   */
  mixin(mixin: ServiceMixin<T>): ServiceBuilder<T>
  /**
   * Sets token for given service.
   */
  token(token: Token): ServiceBuilder<T>
  /**
   * Sets scope for service.
   */
  scope(scope: Scope): ServiceBuilder<T>
  /**
   * Sets metadata.
   */
  set<K>(key: Token, value: K): ServiceBuilder<T>
  /**
   * Sets a factory for service.
   */
  factory(provider: ProviderFunction<T>): ServiceBuilder<T>
}

/**
 * Mixin is a way to easily and type-safely reuse code for builders.
 */
export type ServiceMixin<T> = (builder: ServiceBuilder<T>) => void

/**
 * Creates a service builder
 */
export const createService = <T>(s?: Service<T>): ServiceBuilder<T> => {
  const serv: Service<T> = s ?? {
    provider: () => undefined as any,
    dependencies: [],
    metadata: new Map(),
    scope: Scope.Singleton,
    token: createToken('unknown')
  }

  const build = () => serv

  const inject = (...resolvables: TokenResolvable[]) => {
    serv.dependencies = [...serv.dependencies, ...resolvables.map(resolveToken)]
    return builder
  }

  const token = (token: Token) => {
    serv.token = token
    return builder
  }

  const factory = (provider: ProviderFunction<T>) => {
    serv.provider = provider
    return builder
  }

  const scope = (scope: Scope) => {
    serv.scope = scope
    return builder
  }

  const mixin = (mixin: ServiceMixin<T>) => {
    mixin(builder)
    return builder
  }

  const set = <K>(key: Token, data: K) => {
    serv.metadata.set(key, data)
    return builder
  }

  const builder: ServiceBuilder<T> = {
    build,
    inject,
    token,
    factory,
    scope,
    mixin,
    set
  }

  return builder
}

/**
 * Creates a shadow service(service with no default implementation).
 */
export const createShadow = <T>(name = 'ShadowService') => {
  const tok = token(name)
  const ser = (mixin: ServiceMixin<T>) => createService<T>()
    .token(tok)
    .mixin(mixin)
    .build()

  return [tok, ser] as const
}
