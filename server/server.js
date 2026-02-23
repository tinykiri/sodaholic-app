import { createWsServer } from 'tinybase/synchronizers/synchronizer-ws-server';
import { WebSocketServer } from 'ws';

const server = new WebSocketServer({ port: 8043 });
createWsServer(server);

console.log('TinyBase sync server running on ws://0.0.0.0:8043');