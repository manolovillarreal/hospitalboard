const { comprobarJWT } = require('../helpers/generar-jwt');

const Usuario = require('../models/usuario');
const { usuarioConectado } = require('../controllers/sockets');

let Boards = [{
    name: 'Hospitalizacion',
    headers: ['Cama', 'Nombre', 'Edad', 'EPS', 'Especialdad'],
    lines: [
        { Cama: '1' },
        { Cama: '2' },
        { Cama: '3' },
        { Cama: '4A' },
        { Cama: '4B' },
        { Cama: '5A' },
        { Cama: '5B' },
        { Cama: '6A' },
        { Cama: '6B' },
        { Cama: '7A' },
        { Cama: '7B' },
        { Cama: '8A' },
        { Cama: '8B' },
        { Cama: '9A' },
        { Cama: '9B' },
        { Cama: '11A' },
        { Cama: '11B' },
    ]
}]


class Sockets {
    constructor(io) {
        this.io = io;
        this.onlineClients = [];
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
            console.log("Conexion");

            socket.emit('boards', Boards);

            if (screen) {

            }
            //Evento Find Match
            socket.on('updateBoard', (board) => {
               Boards = Boards.map((b)=>{
                   if(b.name == board.name){
                       b.lines = board.lines;
                   }
                   return b;
               })
               this.io.emit('updateBoard',board);
                
            });

            //Evento cuando se desconecta un cliente
            socket.on('disconnect', () => {
                /*
                AQUI DEBERIA VERIFICAR SI EL USUARIO DESCONECTADO
                ESTA BUSCANDO PARTIDA 
                */
                console.log('user disconnected');
            });
        });

    }

}

module.exports = Sockets;