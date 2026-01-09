/**
 * Types out a detailed error message to the console with a typewriter effect.
 * @param error - The error object or string message
 * @param cause - Optional cause of the error
 */
export async function typeError(error: unknown, cause?: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const message = typeof error === 'string' ? error : error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error && error.stack ? error.stack : '';

  let fullMessage = `[${timestamp}] ERROR: ${message}`;
  if (cause) {
    fullMessage += `\nCause: ${cause}`;
  }
  if (stack) {
    fullMessage += `\nStack Trace:\n${stack}`;
  }

  // Check if running in Node.js environment with stdout available
  if (typeof process !== 'undefined' && process.stdout && process.stdout.write) {
    // Typewriter effect: log each character with a small delay
    for (const char of fullMessage) {
      process.stdout.write(char);
      await new Promise(resolve => setTimeout(resolve, 10)); // 10ms delay per character
    }
    process.stdout.write('\n'); // Add newline at the end
  } else {
    // In browser or other environments, log the full message at once
    console.error(fullMessage);
  }
}
