let jwt = localStorage.getItem("jwt");
const user = JSON.parse(localStorage.getItem('user'));

let Boards = {};
let ActiveBoardName ;
if (!jwt) {
    window.location.assign('/');
}
let socket = io(window.location.host, {

    query: {
        token: jwt
    }
});
socket.on('connect', function() {
    console.log('Estoy conectado al servidor ws');
})
socket.on('boards', (boards) => {
    generateBoardsMenu(boards);

    if (user?.rol != 2){
        ActiveBoardName = boards[0].name
        showActiveBoard();
    }
})

socket.on('updateBoard', (board) => {
   Boards[board.name]= board;
   if(board.name == ActiveBoardName){
       showActiveBoard();
   }
})
function generateBoardsMenu(boards) {
    const BoardsContainer = document.getElementById('boardsMenu');
    for (const board of boards) {
        Boards[board.name] = board;
        const divBoardOption = document.createElement('div');
        divBoardOption.innerHTML = board.name;
        divBoardOption.onclick = (() => {
            if (user.rol != 2){
                ActiveBoardName = board.name;
                showActiveBoard();
            }
            else {
                window.open('/board?name=' + board.name);
            }
        });
        BoardsContainer.append(divBoardOption);
    }

    const signOutOption = document.createElement('div');
    signOutOption.innerHTML = 'Cerrar Sesion';
    signOutOption.onclick = (() => {
        localStorage.setItem('jwt', undefined);
        window.location = "/";
    });

    if (user?.rol == 0) {
        const adminOption = document.createElement('div');
        adminOption.innerHTML = 'Administrador';
        adminOption.onclick = (() => {
            alert('En construccion');
        });
        BoardsContainer.append(document.createElement('hr'));
        BoardsContainer.append(adminOption);
    }
    BoardsContainer.append(document.createElement('hr'));
    BoardsContainer.append(signOutOption);



}
function showActiveBoard() {
    let board = Boards[ActiveBoardName];
    const boardHtml = printBoard(board);
    document.getElementById('boardPanel').innerHTML = "";
    document.getElementById('boardPanel').append(boardHtml)

    //Crear boton para guardar cambios
    const btnSave = document.createElement('button')
    btnSave.id = "btnSave";
    btnSave.innerHTML = "Guardar";
    btnSave.className = "btn btn-primary mb-2"
    btnSave.onclick = () => {
        socket.emit('updateBoard', Boards[board.name]);
    }

    //Crear Label del tablero 
    const label = document.createElement("h5");
    label.innerHTML = board.name;

    //Crear boton para ir el tablero
    const btnView = document.createElement('button')
    btnView.id = "btnView";
    btnView.innerHTML = "Ver";
    btnView.className = "btn btn-outline-success"
    btnView.onclick = () => {
            window.open('/board?name=' + board.name);
        }
        //Crear boton para ir el tablero
    const btnReload = document.createElement('button')
    btnReload.id = "btnReload";
    btnReload.innerHTML = "Refrescar";
    btnReload.className = "btn btn-outline-primary"
    btnReload.onclick = () => {
        socket.emit('reload')
    }

    //Crear boton para ir el tablero
    const btnIncrementFont = document.createElement('button')
    btnIncrementFont.id = "btnIncrementFont";
    btnIncrementFont.innerHTML = "+";
    btnIncrementFont.className = "btn btn-outline-success"
    btnIncrementFont.onclick = () => {
        socket.emit('changeFontSize', { boardName: board.name, increment: true });
    }

    //Crear boton para ir el tablero
    const btnDecrementFont = document.createElement('button')
    btnDecrementFont.id = "btnDecrementFont";
    btnDecrementFont.innerHTML = "-";
    btnDecrementFont.className = "btn btn-outline-success"
    btnDecrementFont.onclick = () => {
        socket.emit('changeFontSize', { boardName: board.name, increment: false });

    }

    document.getElementById('boardHeader').innerHTML = "";

    document.getElementById('boardHeader').append(label);
    document.getElementById('boardHeader').append(btnView);
    document.getElementById('boardHeader').append(btnReload);
    document.getElementById('boardHeader').append(btnDecrementFont);
    document.getElementById('boardHeader').append(btnIncrementFont);
    document.getElementById('boardHeader').append(btnSave);

}
function printBoard(board) {
    const { name, headers, lines } = board

    const table = document.createElement('table');
    table.className = "table table-striped";

    let tr = document.createElement('tr');
    for (const header of headers) {
        let th = document.createElement('th');
        th.append(header);
        th.className = header;
        tr.append(th);
    }
    table.append(tr);
    const tBody = document.createElement('tbody');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        tr = document.createElement('tr');
        tr.id = `line_${name}_${i}`;
        let firstColunm = true;
        for (const header of headers) {
            let td = document.createElement('td');

            if (!firstColunm) {
                let inputField = document.createElement('input');
                inputField.id = `${name}_${i}_${header}_input`;
                inputField.className = "boardField form-control";
                inputField.onchange = (e) => {
                    let [boardName, lineIndex, fieldName] = e.target.id.split('_');
                    Boards[boardName].lines[lineIndex][fieldName] = e.target.value;
                }
                inputField.onkeydown = (e) => {
                    if (e.key === 'Enter') {
                        e.target.blur();
                        socket.emit('updateBoard', Boards[board.name]);
                    }
                }
                if (line[header]) {
                    inputField.value = line[header];
                }
                td.append(inputField);
            } else if (line[header]) {
                td.append(line[header]);
                firstColunm = false;
            }
            tr.append(td);
        }
        tBody.append(tr);
    }
    table.append(tBody);
    return table;
}