import { Container } from './container'

/**
 * A unique token for identifying a service.
 */
export type Token = symbol

/**
 * Represents a scope during which a service is valid.
 */
export enum Scope {
  /**
   * Service is only created once and always reused.
   */
  Singleton = 'Singleton',
  /**
   * Service is created each time it is used.
   */
  Transient = 'Transient'
}

/** Represents a type which contains a {@link Token}. */
export interface Injectable {
  /**
   * Unique token.
   */
  token: Token
  /**
   * Scope during which a service instance is valid.
   */
  scope: Scope
}

/**
 * Represents a token or an injectable.
 */
export type TokenResolvable = Injectable | Token

/**
 * Checks if a value is an injectable.
 */
export const isInjectable = (a: any): a is Injectable => a.token !== undefined

/**
 * Resolves a TokenResolvable into Token.
 */
export const resolveToken = (a: TokenResolvable) => isInjectable(a) ? a.token : a

/**
 * Represents a provider, which uses a factory to create service.
 */
export interface FactoryProvider<T> extends Injectable {
  /**
   * Factory itself.
   */
  useFactory(container: Container): T | Promise<T>
}
/**
 * A provider describes how container should create a service.
 */
export type Provider<T = unknown> = FactoryProvider<T>

/**
 * Checks if a value is a factory provider.
 */
export const isFactoryProvider = (a: any): a is FactoryProvider<unknown> => a.useFactory !== undefined && typeof a.useFactory === 'function'
