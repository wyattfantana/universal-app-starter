import pino from 'pino';

/**
 * Structured JSON logger using Pino
 *
 * Usage examples:
 * - logger.info({ userId, action: 'create_client' }, 'Client created');
 * - logger.error({ err, userId }, 'Failed to create client');
 * - logger.warn({ endpoint: '/api/clients' }, 'Rate limit approaching');
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    },
  } : undefined,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Child logger for HTTP requests
export const httpLogger = logger.child({ context: 'http' });

// Child logger for database operations
export const dbLogger = logger.child({ context: 'database' });

// Child logger for authentication
export const authLogger = logger.child({ context: 'auth' });
