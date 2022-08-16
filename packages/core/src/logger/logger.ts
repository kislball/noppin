import { formatLogLevel, LoggerFactory, LogLevel } from './logger.interface'
import chalk from 'chalk'

export interface DefaultLoggerOptions {
  /**
   * Formats incoming message.
   */
  format(level: LogLevel, ...msg: any[]): string
  /**
   * Log level.
   */
  logLevel: LogLevel
  /**
   * If to exit on fatal.
   */
  exitOnFatal: boolean
}

export const createDefaultLogger = (opts: Partial<DefaultLoggerOptions> = {}): LoggerFactory => (scope: string) => {
  const levelSetting = opts.logLevel ?? LogLevel.Verbose
  const exitOnFatal = opts.exitOnFatal ?? true

  const format = opts.format ?? ((level: LogLevel, ...msg: any[]) => {
    const prefix = `${formatLogLevel(level).toUpperCase().padEnd(7, ' ')} ${scope}`.padEnd(30, ' ')
    const outStr = `${prefix} | ${msg.join(' ')}`
    if (level === LogLevel.Error) {
      return chalk.red(outStr)
    } else if (level === LogLevel.Fatal) {
      return chalk.bold.red(outStr)
    } else if (level === LogLevel.Log) {
      return chalk.blue(outStr)
    } else if (level === LogLevel.Warn) {
      return chalk.yellow(outStr)
    } else if (level === LogLevel.Verbose) {
      return chalk.gray(outStr)
    }
  })

  const show = (level: LogLevel, type: 'error' | 'warn' | 'log', ...msg: any[]) => {
    if (level <= levelSetting) {
      if (type === 'error') {
        console.error(format(level, ...msg))
      } else if (type === 'warn') {
        console.warn(format(level, ...msg))
      } else if (type === 'log') {
        console.log(format(level, ...msg))
      }
    }
  }

  const error = (...msg: any[]) => {
    show(LogLevel.Error, 'error', ...msg)
  }

  const fatal = (...msg: any[]) => {
    show(LogLevel.Fatal, 'error', ...msg)
    if (exitOnFatal) {
      process.exit()
    }
  }

  const log = (...msg: any[]) => {
    show(LogLevel.Log, 'log', ...msg)
  }

  const verbose = (...msg: any[]) => {
    show(LogLevel.Verbose, 'log', ...msg)
  }

  const warn = (...msg: any[]) => {
    show(LogLevel.Warn, 'warn', ...msg)
  }

  return {
    error,
    fatal,
    log,
    verbose,
    warn
  }
}
