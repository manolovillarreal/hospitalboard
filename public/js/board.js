let Board = {};

let jwt = localStorage.getItem("jwt")

if (!jwt) {
    window.location.assign('/');
}

const params = new URLSearchParams(window.location.search);

if (!params.has("name")) {
    window.location = "/";
    throw new Error("Se requiere el nombre del tablero");
}

let boardName = params.get("name");

let socket = io(window.location.host, {
    transports: ["websocket", "polling"],
    query: {
        token: jwt,
        boardName
    }
});

socket.on('connect', function() {
    console.log('Estoy conectado al servidor ws');
})

socket.on('changeFontSize', function(data) {
    if (data.boardName.toLowerCase() == boardName.toLowerCase()) {
        const boardPanel = document.querySelector("#boardPanel")
        let fontSize = boardPanel.style.fontSize.split("px")[0];
        console.log(fontSize);
        if (data.increment)
            fontSize++;
        else
            fontSize--;

        boardPanel.style.fontSize = fontSize + "px";
    }
})

socket.on('boards', (boards) => {

    Board = boards.find(b => b.name.toLowerCase() == boardName.toLowerCase());
    generateBoard(Board);
})
socket.on('reload', (boards) => {
    window.location.reload();
})

socket.on('updateBoard', (board) => {
    if (board.name.toLowerCase() == boardName.toLowerCase()) {
        Board = board;
        generateBoard(board);
    }
})



function generateBoard(board) {
    const boardPanel = document.getElementById('boardPanel');
    boardPanel.innerHTML = "";

    document.getElementById('boardName').innerHTML = board.name;
    document.getElementById('boardDate').innerHTML = (new Date()).toDateString('DD/MM/YYYY');

    const boardHtml = printBoard(board);
    document.getElementById('boardPanel').innerHTML = "";
    document.getElementById('boardPanel').append(boardHtml);
}

function printBoard(board) {
    const { name, headers, lines } = board

    const table = document.createElement('table');
    table.className = "table table-striped";
    const thead = document.createElement('thead');
    thead.className = 'table-dark';
    let tr = document.createElement('tr');
    for (const header of headers) {
        let th = document.createElement('th');
        th.className = "header" + header;
        th.append(header);
        tr.append(th);
    }
    thead.append(tr);
    table.append(thead);

    const tbody = document.createElement('tbody');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        tr = document.createElement('tr');
        for (const header of headers) {
            let td = document.createElement('td');
            td.className = "field field_" + header;
            if (Object.hasOwnProperty.call(line, header)) {
                td.append(line[header].toUpperCase());
            }
            tr.append(td);
        }
        tbody.append(tr);
    }
    table.append(tbody);

    return table;
}