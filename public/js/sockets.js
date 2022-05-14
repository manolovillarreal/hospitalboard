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