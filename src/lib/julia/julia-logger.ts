// Utility functions to add [Julia] to the start of messages

const LOG_ID = "Julia"

const JuliaLogger = {
  log: (...args: any[]) => console.log(`[${LOG_ID}]`, ...args),
  error: (...args: any[]) => console.error(`[${LOG_ID}]`, ...args),
  warn: (...args: any[]) => console.warn(`[${LOG_ID}]`, ...args),
  info: (...args: any[]) => console.info(`[${LOG_ID}]`, ...args),
}

export default JuliaLogger;
