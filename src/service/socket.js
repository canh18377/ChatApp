import io from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = io('https://backend-chat-app-4.onrender.com', {
            transports: ['websocket'],
            reconnect: true,
        });

        socket.on('connect', () => {
            console.log('✅ Connected to WebSocket server');
        });
    }
    return socket;
};

export const getSocket = () => socket;
