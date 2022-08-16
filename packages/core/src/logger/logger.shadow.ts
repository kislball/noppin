import { createShadow } from '../app/service'
import { LoggerFactory } from './logger.interface'

export const [loggerKey, loggerShadow] = createShadow<LoggerFactory>('Logger')
