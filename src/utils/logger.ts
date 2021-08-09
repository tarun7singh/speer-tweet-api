import winston from 'winston';

const stream = {
    write: (message: string) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')));
    },
};

const { combine, timestamp, printf } = winston.format;
const logFormat = printf(({ level, message }) => `${level}: ${message}`);

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
    ),
    levels: winston.config.syslog.levels,
});

// Create log files or send it to third party services like "papertrail" 

// log to console
logger.add(
    new winston.transports.Console({
        format: winston.format.combine(winston.format.splat(), winston.format.colorize(), winston.format.simple()),
    }),
);
export { logger, stream };
