import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

let wss: WebSocketServer;

export const createWebSocketServer = (server: Server) => {
    wss = new WebSocketServer({ server });

    wss.on('connection', (ws: WebSocket) => {
        console.log('Client connected to WebSocket');

        ws.on('message', (message: string) => {
            // For now, we just log messages. We could implement authentication here.
            console.log('received: %s', message);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });

    return wss;
};

export const broadcastMessage = (message: any) => {
    if (!wss) {
        return;
    }

    const messageString = JSON.stringify(message);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(messageString);
        }
    });
};
