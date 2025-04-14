// websocketConfig.js

import io from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
    // Kết nối tới WebSocket server (thay đổi URL nếu cần)
    socket = io('http://localhost:3000', {
        transports: ['websocket'],
        reconnect: true,
    });

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
    });

    socket.on('message', (message) => {
        console.log('Received message:', message);
    });
};

export const sendMessage = (message) => {
    if (socket) {
        socket.emit('message', message);
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log('Socket disconnected');
    }
};

export const getSocket = () => socket;
