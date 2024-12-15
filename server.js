import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Server } from '@hocuspocus/server';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Obtener el directorio actual usando `import.meta.url`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construir la ruta de la carpeta 'logs' fuera de src
const logsDirectory = path.resolve(__dirname, '../logs');

// Asegúrate de que la carpeta 'logs' exista
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory); // Crear la carpeta si no existe
}

// Configuración del logger (Winston) con rotación diaria
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      dirname: logsDirectory,
      filename: 'server-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d', // Guardar logs por 14 días
    }),
  ],
});

// Mapa para rastrear clientes conectados
const connectedClients = new Map();

// Configuración del servidor Hocuspocus
const server = Server.configure({
  port: 1234, // Puerto en el que el servidor escuchará las conexiones

  // Evento que se dispara cuando un cliente se conecta
  async onConnect(connection) {
    const socketId = connection.socketId; // Identificador único de la sesión
    const userName = connection.requestParameters?.get('name') || 'Unknown'; // Nombre del usuario
    const userColor = connection.requestParameters?.get('color') || '#FFFFFF'; // Color del usuario

    // Registrar al cliente conectado en el mapa
    connectedClients.set(socketId, { name: userName, color: userColor });

    // Log en inglés sobre la conexión
    logger.info(`Client connected: ${userName} (${userColor}) with socketId: ${socketId}`);
  },

  // Evento que se dispara cuando un cliente se desconecta
  async onDisconnect(connection) {
    const socketId = connection.socketId; // Identificador único de la sesión

    // Buscar al cliente desconectado en el mapa
    const client = connectedClients.get(socketId);

    if (client) {
      // Log en inglés sobre la desconexión
      logger.info(`Client disconnected: ${client.name} (${client.color}) with socketId: ${socketId}`);

      // Eliminar al cliente del mapa
      connectedClients.delete(socketId);
    } else {
      // Log si no se encuentra al cliente
      logger.warn(`Disconnected client not found in map. SocketId: ${socketId}`);
    }
  },
});

// Inicia el servidor
server.listen(() => {
  // Log en inglés cuando el servidor inicia
  logger.info('Hocuspocus server is listening on port 1234');
});
