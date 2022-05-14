let jwt = localStorage.getItem("jwt")
let Boards = {};
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

    for (const board of boards) {
        Boards[board.name]= board;
        console.log(Boards);
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
    const { name,headers, lines } = board

    const table = document.createElement('table');
    table.className="table table-striped";
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
                inputField.id=`${name}_${i}_${header}_input`;
                inputField.className = "boardField form-control field"+header;
                inputField.onchange = (e)=>{
                    console.log(e.target.value);
                    let [boardName,lineIndex,fieldName] = e.target.id.split('_');
                    Boards[boardName].lines[lineIndex][fieldName] = e.target.value;
                    console.log(Boards);
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

function showBoard(board) {
    console.log('click');
    const boardHtml = printBoard(board);
    document.getElementById('boardPanel').append(boardHtml)

    const btnSend = document.createElement('button')
    btnSend.innerHTML = "Guardar";
    btnSend.className="btn btn-primary mb-2"
    btnSend.onclick =()=>{
        socket.emit('updateBoard',Boards[board.name]);
    }
    document.getElementById('boardPanel').prepend(btnSend);

}