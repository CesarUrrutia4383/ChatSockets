const express = require('express');
const bodyParser = require('body-parser');
const net = require('net'); // Importar net para manejar conexiones TCP
const app = express();
const port = 3001;

// Array para almacenar los mensajes y usuarios
let messages = [];
let users = [];

// Configuración de Express
app.use(express.static('public')); // Sirve archivos estáticos desde la carpeta "public"
app.use(bodyParser.json()); // Para analizar cuerpos JSON

// Crear un servidor TCP para manejar la conexión del cliente
const tcpServer = net.createServer((clientSocket) => {
    console.log('Nuevo cliente conectado');

    clientSocket.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
            messages.push(message); // Agregar el nuevo mensaje al array
            console.log(`Nuevo mensaje: ${message}`);
            // Enviar el mensaje a todos los usuarios conectados (si fuera necesario)
            // Aquí podrías implementar un mecanismo para enviar mensajes a todos los sockets
        }
    });

    clientSocket.on('end', () => {
        console.log('Cliente desconectado');
    });

    clientSocket.on('error', (err) => {
        console.error('Error en el socket:', err.message);
    });
});

// Iniciar el servidor TCP en el puerto 3000
tcpServer.listen(3000, () => {
    console.log('Servidor TCP escuchando en el puerto 3000');
});

// Endpoint para recibir nuevos mensajes
app.post('/send', (req, res) => {
    const message = req.body.message;
    if (message) {
        messages.push(message); // Agregar el nuevo mensaje al array
    }
    res.sendStatus(200); // Responder con éxito
});

// Endpoint para obtener todos los mensajes
app.get('/messages', (req, res) => {
    res.json(messages); // Enviar la lista de mensajes como JSON
});

// Endpoint para obtener la lista de usuarios activos
app.get('/users', (req, res) => {
    res.json(users); // Enviar la lista de usuarios como JSON
});

// Endpoint raíz para servir index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // Cambia esto a index.html
});

// Endpoint para manejar el inicio de sesión (almacenar usuarios)
app.post('/users', (req, res) => {
    const username = req.body.username;
    if (username && !users.includes(username)) {
        users.push(username); // Agregar el nuevo usuario a la lista
    }
    res.sendStatus(200); // Responder con éxito
});

// Endpoint para eliminar un usuario
app.post('/removeUser', (req, res) => {
    const username = req.body.username;
    users = users.filter(user => user !== username); // Eliminar el usuario de la lista
    res.sendStatus(200); // Responder con éxito
});

// Iniciar el servidor HTTP
app.listen(port, () => {
    console.log(`Servidor HTTP escuchando en http://localhost:${port}`);
});
