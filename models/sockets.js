const { comprobarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');
const { usuarioConectado } = require('../controllers/sockets');

class Sockets {
    constructor(io) {
        this.io = io;
        this.onlineUsers = [];
        this.socketsEvents();
        this.socketMiddlewares();
    }
    socketMiddlewares() {
        //Validar token
        this.io.use((socket, next) => {
            let { token } = socket.handshake.query;
            let uid = comprobarJWT(token);
            if (uid) {
                socket.uid = uid;
                return next();
            }
            //Emitir desconexion por falta de autorizacion
            console.log("reject token");
            return next(new Error("authentication error"));
        });
    }
    socketsEvents() {
        this.io.on('connection', async(socket) => {
            let { screen } = socket.handshake.query;

            if (screen) {

            }
            //Evento Find Match
            socket.on('newRegistry', () => {
                console.log('New Registry');
            });

            //Evento cuando se desconecta un cliente
            socket.on('disconnect', () => {
                /*
                AQUI DEBERIA VERIFICAR SI EL USUARIO DESCONECTADO
                ESTA BUSCANDO PARTIDA 
                */
                console.log('user disconnected');
                usuarioConectado(user.uid, false);
            });
        });

    }

}

module.exports = Sockets;