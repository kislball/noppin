import { Container, createContainer } from '../container/container'
import { Module, createModule } from '../app/module'
import { Token } from '../container/provider'
import { Service } from '../app/service'
import { OnStart, onStartKey, OnStop, onStopKey } from '../app/hooks'
import { containerShadow, rootShadow } from './shadows'

/**
 * Factory is a utility which starts entire application.
 */
export interface Factory {
  /**
   * Start starts application and runs OnStart hooks.
   */
  start(): Promise<void>
  /**
   * Currently nop.
   */
  withLogger(): void
  /**
   * Gets container.
   */
  container(): Container
  /**
   * Stops application
   */
  stop(): Promise<void>
  /**
   * Only initializes dependencies without running OnStart.
   */
  init(): Promise<void>
}

export const createFactory = (root: Module): Factory => {
  const container = createContainer()
  const initialized: Token[] = []
  const onStart: OnStart[] = []
  const onStop: OnStop[] = []

  const containerService = containerShadow(builder => builder.factory(() => container))
  const rootService = rootShadow(builder => builder.factory(() => root))
  const factoryModule = createModule()
    .service(containerService)
    .service(rootService)
    .import(root)
    .build()

  const initService = (s: Service<unknown>) => {
    container.register({
      scope: s.scope,
      token: s.token,
      useFactory: async container => {
        const deps = []
        for (const dep of s.dependencies) {
          deps.push(await container.resolve(dep))
        }

        return s.provider(...deps)
      }
    })
  }

  const init = () => initModule(factoryModule)

  const initModule = async (module: Module) => {
    if (initialized.includes(module.token)) return
    initialized.push(module.token)

    for (const service of module.services) {
      initService(service)
    }

    for (const impor of module.imports) {
      await initModule(impor)
    }

    const tokens = module.services.map(e => e.token)
    for (const tok of tokens) {
      const resolved = await container.resolve<any>(tok)
      if (resolved === undefined) continue
      if (resolved[onStartKey] !== undefined) {
        onStart.push(resolved)
      }

      if (resolved[onStopKey] !== undefined) {
        onStop.push(resolved)
      }
    }
  }

  const start = async () => {
    await init()
    for (const startHook of onStart) {
      await startHook[onStartKey]()
    }
  }

  const stop = async () => {
    for (const stopHook of onStop) {
      await stopHook[onStopKey]()
    }
  }

  const factory: Factory = {
    container: () => container,
    withLogger: () => {},
    start,
    stop,
    init
  }

  return factory
}
