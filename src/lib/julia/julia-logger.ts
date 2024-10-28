// Utility functions to add [Julia] to the start of messages

export function log(message: string) {
  console.log(`[Julia] ${message}`);
}

export function error(message: string) {
  console.error(`[Julia] ${message}`);
}
