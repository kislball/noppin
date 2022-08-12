import { Token } from '../container/provider'
import { token } from '../utils/token'
import { Service } from './service'

/**
 * Module is a wrapper for other services and modules.
 */
export interface Module {
  /**
   * Modules that are imported by this module.
   */
  imports: Module[]
  /**
   * Services that are added by this module.
   */
  services: Service[]
  /**
   * Unique token identifying this service.
   */
  token: Token
  /**
   * Metadata for this module.
   */
  metadata: Map<Token, unknown>
}

/**
 * Utility for creating modules.
 */
export interface ModuleBuilder {
  /**
   * Imports given module.
   */
  import(module: Module): ModuleBuilder
  /**
   * Add given service.
   */
  service(service: Service): ModuleBuilder
  /**
   * Sets name for this module.
   */
  name(name: string): ModuleBuilder
  /**
   * Sets metadata for this module.
   */
  set<K>(key: Token, value: K): ModuleBuilder
  /**
   * Applies mixin to this module;
   */
  mixin(mixin: ModuleMixin): ModuleBuilder
  /**
   * Builds this module.
   */
  build(): Module
}

/**
 * Creates a module builder.
 */
export const createModule = (): ModuleBuilder => {
  const mod: Module = {
    imports: [],
    services: [],
    metadata: new Map(),
    token: token('unknown', 'Module')
  }

  const build = () => mod

  const impor = (m: Module) => {
    mod.imports = [...mod.imports, m]
    return builder
  }

  const service = (s: Service) => {
    mod.services = [...mod.services, s]
    return builder
  }

  const name = (name: string) => {
    mod.token = token(name, 'Module')
    return builder
  }

  const mixin = (mix: ModuleMixin) => {
    mix(builder)
    return builder
  }

  const set = <K>(key: Token, value: K) => {
    mod.metadata.set(key, value)
    return builder
  }

  const builder: ModuleBuilder = {
    build,
    import: impor,
    service,
    name,
    mixin,
    set
  }

  return builder
}

/**
 * Mixin Mixin is a way to easily and type-safely reuse code for builders.
 */
export type ModuleMixin = (builder: ModuleBuilder) => void
