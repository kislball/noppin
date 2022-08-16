export interface Logger {
  log(...msg: any[]): void
  error(...msg: any[]): void
  warn(...msg: any[]): void
  fatal(...msg: any[]): void
  verbose(...msg: any[]): void
}

export type LoggerFactory = (scope: string) => Logger

export enum LogLevel {
  None = 0,
  Fatal = 10,
  Error = 20,
  Warn = 30,
  Log = 40,
  Verbose = 50
}

export const formatLogLevel = (l: LogLevel) =>
  Object.keys(LogLevel)[Object.values(LogLevel).indexOf(l)]
