let jwt = localStorage.getItem("jwt")

if (!jwt) {
    window.location.assign('/');
}
let socket = io('http://localhost:3000', {
    transports: ["websocket", "polling"],
    query: {
        token: jwt
    }
});

socket.on('connect', function() {
    console.log('Estoy conectado al servidor ws');
})

socket.on('boards', (boards) => {
    console.log(boards);

    for (const board of boards) {
        generateBoard(board);
    }
})

function generateBoard(board) {
    const BoardsContainer = document.getElementById('boardsMenu');
    BoardsContainer.innerHTML = "";
    const divBoard = document.createElement('div');
    divBoard.innerHTML = board.name;
    divBoard.onclick = (() => { showBoard(board) });
    BoardsContainer.append(divBoard);
}

function printBoard(board) {
    const { headers, lines } = board

    const table = document.createElement('table');
    let tr = document.createElement('tr');
    for (const header of headers) {
        let th = document.createElement('th');
        th.append(header);
        th.className = header;
        tr.append(th);
    }
    table.append(tr);

    for (const line of lines) {
        tr = document.createElement('tr');
        let firstColunm = true;
        for (const header of headers) {
            let td = document.createElement('td');
            if (!firstColunm) {
                let inputField = document.createElement('input');
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
        table.append(tr);
    }

    return table;
}

function showBoard(board) {
    console.log('click');
    const boardHtml = printBoard(board);
    document.getElementById('boardPanel').append(boardHtml)

}