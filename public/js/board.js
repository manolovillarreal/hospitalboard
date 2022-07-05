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

setInterval(switchTheme,900000);
setInterval(setClock,15000);

function generateBoard(board) {
    const boardPanel = document.getElementById('boardPanel');
    boardPanel.innerHTML = "";

    document.getElementById('boardName').innerHTML = board.name;
    document.getElementById('boardDate').innerHTML = (new Date()).toDateString('DD/MM/YYYY');

    setClock();
    const boardHtml = printBoard(board);
    document.getElementById('boardPanel').innerHTML = "";
    document.getElementById('boardPanel').append(boardHtml);
}

function printBoard(board) {
    const { name, headers, lines } = board

    

    const table = document.createElement('table');
    table.className = "table table-striped";

    //Table head
    const thead = document.createElement('thead');
    thead.className = 'table-dark';
    let tr = document.createElement('tr');
    for (const header of headers) {
        let th = document.createElement('th');
        th.className = "header header_" + header;
        th.append(header);
        tr.append(th);
    }
    thead.append(tr);
    table.append(thead);
    //
    //
    const tbody = document.createElement('tbody');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        tr = document.createElement('tr');
        for (const header of headers) {
            let td = document.createElement('td');
            td.className = "field field_" + header;
            if (Object.hasOwnProperty.call(line, header)) {
                let span = document.createElement('div');
                span.append(line[header].toUpperCase());
                td.append(span);
            }
            tr.append(td);
        }
        tbody.append(tr);
    }
    table.append(tbody);

    return table;
}

function setClock(){
    let date = new Date()
    document.getElementById('clock').innerHTML = `${date.getHours()<10?'0':''}${date.getHours()}:${date.getMinutes()<10?'0':''}${date.getMinutes()}`;

}
function switchTheme(){
    if(!document.body.classList.contains("dark")){
        document.body.className+=" dark";
        document.getElementsByTagName("table")[0].className+=" table-dark";
    }
    else{
        document.body.classList.remove("dark");
        document.getElementsByTagName("table")[0].classList.remove("table-dark");
    }

}