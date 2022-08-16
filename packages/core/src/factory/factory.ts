import { Container, createContainer } from '../container/container'
import { Module, createModule } from '../app/module'
import { Token } from '../container/provider'
import { Service } from '../app/service'
import { OnStart, onStartKey, OnStop, onStopKey } from '../app/hooks'
import { containerShadow, rootShadow } from './shadows'
import { LoggerFactory } from '../logger/logger.interface'
import { createDefaultLogger } from '../logger/logger'
import { loggerShadow } from '../logger/logger.shadow'

export interface FactoryOptions {
  /** Logger to use */
  logger: LoggerFactory
}

/**
 * Factory is a utility which starts entire application.
 */
export interface Factory {
  /**
   * Start starts application and runs OnStart hooks.
   */
  start(): Promise<void>
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

export const createFactory = (root: Module, options: Partial<FactoryOptions> = {}): Factory => {
  const container = createContainer()
  const initialized: Token[] = []
  const onStart: OnStart[] = []
  const onStop: OnStop[] = []

  const loggerFactory = options.logger ?? createDefaultLogger({})
  const logger = loggerFactory('noppin-factory')

  const containerService = containerShadow(builder => builder.factory(() => container))
  const rootService = rootShadow(builder => builder.factory(() => root))
  const loggerService = loggerShadow(builder => builder.factory(() => loggerFactory))
  const factoryModule = createModule()
    .service(containerService)
    .service(rootService)
    .service(loggerService)
    .name('FactoryModule')
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

  const init = async () => {
    logger.log('Initializing application')
    await initModule(factoryModule)
    logger.log('Application initialized')
  }

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
      logger.log(`Initialized service ${tok.description}`)
    }

    logger.log(`Initialized module ${module.token.description}`)
  }

  const start = async () => {
    await init()
    for (const startHook of onStart) {
      await startHook[onStartKey]()
    }
    logger.log('Application started')
  }

  const stop = async () => {
    logger.log('Stopping app...')
    for (const stopHook of onStop) {
      await stopHook[onStopKey]()
    }
    logger.log('App stopped')
  }

  const factory: Factory = {
    container: () => container,
    start,
    stop,
    init
  }

  return factory
}
