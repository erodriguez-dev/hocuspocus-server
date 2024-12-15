const { Server } = require('@hocuspocus/server');
const winston = require('winston');

// Configuración del logger (Winston)
// Se configurará para enviar los logs tanto a la consola como a un archivo
const logger = winston.createLogger({
  level: 'info', // Nivel mínimo de log (info, warn, error)
  format: winston.format.combine(
    winston.format.timestamp(), // Agrega un timestamp a cada log
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Enviar logs a la consola
    new winston.transports.File({ filename: 'server.log' }), // Guardar logs en un archivo
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

