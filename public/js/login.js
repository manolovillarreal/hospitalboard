const formLoginId = 'formLogin';
let jwt = localStorage.getItem("jwt")


let formLogin = document.getElementById(formLoginId);
formLogin.addEventListener("submit", onSubmitFormLogin);

if (jwt) {
    validartoken();
}



async function validarToken(params) {

    let tokenValido = await comprobarJWT();
    if (tokenValido) {

        window.location.assign('/dashboard');

    } else {
        localStorage.removeItem('jwt');
    }
}

async function comprobarJWT() {
    const url = window.location.origin + "/api/auth/check";

    let valido = false;
    //post
    disableForm(formLoginId, true);
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'x-token': jwt
        },
    });
    if (resp.ok) {
        valido = true;
    } else {
        console.log("HTTP-Error: " + resp.status);
        let error = await resp.json();
        valido = false;
        console.log(error);
    }
    disableForm(formLoginId, false);
    return valido;
}

async function autenticar(loginJSON) {

    const url = window.location.origin + "/api/auth/login";

    //post
    disableForm(formLoginId, true);
    let response;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: loginJSON

    });
    if (resp.ok) {
        console.log("respuesta ok");
        let { usuario, token } = await resp.json();
        usuarioAtenticado(usuario, token);
    } else {
        console.log("HTTP-Error: " + resp.status);
        let error = await resp.json();
        erroEnLaConsulta(error)
    }
    disableForm(formLoginId, false);
}



function usuarioAtenticado(usuario, token) {

    localStorage.setItem("jwt", token);
    window.location.assign('/dashboard');
}

function erroEnLaConsulta(resp) {

    if (resp.errors) { //Verifica si la respuesta contiene los errores
        let errors = printErrors(resp.errors);
        console.log(resp.errors);
        alert('Error en el proceso de autenticacion\n' + errors);
    } else if (resp.msg) { //Error inestperado
        console.log(resp.msg);
        alert(resp.msg)
    } else {
        console.log(resp);
        alert('Error inesperado, contacte al administrador del sistema')
    }
}

function onSubmitFormLogin(e) {
    e.preventDefault();

    let checkMsg = checkFormLogin();

    if (checkMsg != '') {
        alert(checkMsg);
        return;
    }

    const data = new FormData(e.target);
    const formEntries = Object.fromEntries(data.entries());

    autenticar(JSON.stringify(formEntries));

}

function checkFormLogin() {
    let msg = ''
    return msg
}

function disableForm(formId, option) {
    // document.querySelector(`#${formId} input`).prop("disabled", option);
    // document.querySelector(`#${formId} select`).prop("disabled", option);
    // document.querySelector(`#${formId} button`).prop("disabled", option);
}

function printErrors(errors) {
    let msg = "";
    errors.forEach((e) => {
        msg += `\n ${e.msg} | ${e.param} : ${e.value} '\n`;
    })
    return msg;
}