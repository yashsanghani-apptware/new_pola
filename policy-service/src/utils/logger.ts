import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';

/**
 * Logger class for handling application-wide logging using Winston.
 * 
 * This class wraps around the Winston logging library and provides methods for logging
 * messages with timestamp, level, message, and metadata.
 */
class CustomLogger {
  private logger: WinstonLogger; // Winston logger instance
  private progName: string = 'PolaApp';

  constructor() {
    const { splat, combine, timestamp, printf } = format;

    // Custom format for log messages
    const myFormat = printf(({ timestamp, level, message, ...meta }) => {
      const formattedLevel = level.toUpperCase(); // Convert log level to uppercase
      return `[${formattedLevel}]: ${this.progName}: ${timestamp}: ${message} ${meta ? JSON.stringify(meta) : ''}`;
    });

    // Create the Winston logger instance with the custom format
    this.logger = createLogger({
      format: combine(
        timestamp(), // Add timestamp to log messages
        splat(),     // Enable support for string interpolation with metadata
        myFormat     // Apply custom log message format
      ),
      transports: [
        new transports.Console(), // Output logs to console
        new transports.File({
          filename: 'logs/pola-error.log',
          level: 'error', // Log only 'error' level messages to this file
          format: this.getFileFormat() // Apply the JSON format for file output
        }),
        new transports.File({
          filename: 'logs/pola-combined.log',
          format: this.getFileFormat() // Apply the JSON format for file output
        })
      ]
    });
  }
  /**
     * Returns the custom format for the file logger.
     * 
     * @returns {Format} The custom format for file output as JSON.
     */
  private getFileFormat() {
    return format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Define the timestamp format
      format.json() // JSON format for structured logging in files
    );
  }
  /**
   * Logs an informational message.
   * 
   * @param message - The message to log.
   * @param meta - Optional metadata to include with the log message.
   */
  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  /**
   * Logs a warning message.
   * 
   * @param message - The warning message to log.
   * @param meta - Optional metadata to include with the log message.
   */
  warn(message: string, meta?: any) {
    this.logger.warn(message, meta);
  }

  /**
   * Logs an error message.
   * 
   * @param message - The error message to log.
   * @param meta - Optional metadata to include with the log message.
   */
  error(message: string, meta?: any) {
    this.logger.error(message, meta);
  }

  /**
   * Logs a debug message.
   * 
   * @param message - The debug message to log.
   * @param meta - Optional metadata to include with the log message.
   */
  debug(message: string, meta?: any) {
    this.logger.debug(message, meta);
  }
  /**
     * Sets the program name to be used in the log messages.
     * 
     * @param {string} name - The new program name to set.
     */
  setProgramName(name: string) {
    this.progName = name;
  }

}

// Export an instance of the CustomLogger class
export const Logger = new CustomLogger();

