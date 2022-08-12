import { Module } from '../app/module'
import { createService, Service } from '../app/service'
import { Token } from '../container/provider'
import { rootKey } from '../factory/shadows'
import { Predicate } from '../utils/types'

/**
 * ReflectService can be used for easily traversing
 * throught module tree.
 */
export interface ReflectService {
  /**
   * Gets all modules which match predicate.
   */
  getModules(predicate?: Predicate<Module>): Module[]
  /**
   * Gets all services which match predicate.
   */
  getServices(predicate?: Predicate<Service>): Service[]
}

export const reflectService = createService<ReflectService>()
  .inject(rootKey)
  .factory((root: Module) => {
    const getModules = (predicate: Predicate<Module> = () => true) => {
      const goneThrough: Token[] = []
      const go = (mod: Module) => {
        if (goneThrough.includes(mod.token)) {
          goneThrough.push(mod.token)
          return []
        }

        const result: Module[] = []
        if (predicate(mod)) {
          result.push(mod)
        }

        for (const sub of mod.imports) {
          result.push(...go(sub))
        }

        return result
      }

      return go(root)
    }

    const getServices = (p: Predicate<Service> = () => true) => {
      const modules = getModules()
      const result: Service[] = []

      for (const mod of modules) {
        for (const service of mod.services) {
          if (p(service)) {
            result.push(service)
          }
        }
      }

      return result
    }

    return {
      getModules,
      getServices
    }
  })
  .build()
