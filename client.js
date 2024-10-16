const net = require('net');
const readline = require('readline-sync');

// Configuración del servidor
const servidor = {
    port: 3000,
    host: 'localhost',
};

// Crear conexión con el servidor TCP
const client = net.createConnection(servidor, () => {
    console.log('Conexión exitosa al servidor TCP');
    sendLine(); // Iniciar la función de envío
});

// Manejar errores de conexión
client.on('error', (err) => {
    console.log("Error de conexión: " + err.message);
});

// Mostrar los mensajes del servidor
client.on('data', (data) => {
    console.log('El servidor dice: ', data.toString());
    sendLine(); // Permitir al usuario enviar otro mensaje
});

// Función para enviar mensajes al servidor
function sendLine() {
    const line = readline.question('\nIntroduce el mensaje: \n');
    if (line === '0') {
        client.end(); // Terminar la conexión si se introduce '0'
    } else {
        client.write(line); // Enviar el mensaje
    }
}
