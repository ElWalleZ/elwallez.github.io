const celdas = document.querySelectorAll('.celda');
const btnReiniciar = document.querySelector('#btnReiniciar');
const tituloHeader = document.querySelector('#headerTitulo');

let jugador = 'X';
let gameIniciado = false;
let gameEsperando = false;
let tiempoInicio;

const tablero = ['', '', '',
                 '', '', '',
                 '', '', ''];

const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

celdas.forEach((celda, index) => {
    celda.addEventListener('click', () => clickCelda(celda, index));
});

function clickCelda(celda, index) {
    if (celda.textContent === '' && !gameEsperando) {
        if (!gameIniciado) {
            tiempoInicio = new Date();
            gameIniciado = true;
        }

        cambiarCelda(celda, index);

        if (checkWinner()) return;

        turnoIA();
    }
}

function cambiarCelda(celda, index) {
    celda.textContent = jugador;
    tablero[index] = jugador;
}

function turnoIA() {
    gameEsperando = true;

    let randomPosicion;
    do {
        randomPosicion = Math.floor(Math.random() * tablero.length);
    } while (tablero[randomPosicion] !== '');

    cambiarCelda(celdas[randomPosicion], randomPosicion);
    celdas[randomPosicion].style.background = '#604caa';

    if (checkWinner()) return;

    setTimeout(() => { celdas[randomPosicion].style.background = ''; }, 350); 

    jugador = 'X';
    gameEsperando = false;
}

function checkWinner() {
    for (const [a, b, c] of wins) {
        if (tablero[a] === jugador &&
            tablero[b] === jugador &&
            tablero[c] === jugador ) {
            const tiempoFin = new Date();
            ganador([a, b, c], tiempoFin);
            return true;
        }
    }

    if (tablero.every(celda => celda !== '')) {
        empate();
        return true;
    }

    jugador = (jugador === 'X') ? 'O' : 'X';

    return false;
}

function ganador(tableroGanador, tiempoFin) {
    tituloHeader.textContent = `${jugador} Ganó!`;
     
    tableroGanador.forEach((index) => {
        celdas[index].style.background = '#604caa';
    });

    btnReiniciar.style.visibility = 'visible';
    gameEsperando = true;

    if (jugador === 'X'){
        const nombreJugador = pedirNombre();
        guardarDatosJugador(nombreJugador, tiempoFin);
    }
}

function pedirNombre() {
    let nombre;

    do {
        nombre = prompt("Introduce tu nombre (máximo 10 caracteres):");
    } while (nombre.length > 10 || nombre.trim() === '');

    return nombre;
}


function empate() {
    tituloHeader.textContent = 'Empate!';
    btnReiniciar.style.visibility = 'visible';
    gameEsperando = true;
}

btnReiniciar.addEventListener('click', () => {
    tablero.fill('');
    celdas.forEach((celda) => {
        celda.textContent = '';
        celda.style.background = '';
    });
    tituloHeader.textContent = 'Escoge';
    gameIniciado = false;
    gameEsperando = false;
    jugador = 'X';
    btnReiniciar.style.visibility = 'hidden';
});
 
btnLeaderBoard.addEventListener('mouseenter', () => {
    leaderboardList.style.display = 'block';
    mostrarLeaderboard();
});

btnLeaderBoard.addEventListener('mouseleave', () => {
    leaderboardList.style.display = 'none'; 
});

let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function guardarDatosJugador(nombre, tiempoFin) {
    const tiempo = (tiempoFin - tiempoInicio) / 1000;
    const minutos = Math.floor(tiempo / 60);
    const segundos = Math.floor(tiempo % 60);
    const tiempoFormateado = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    
    const fecha = new Date();
    const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    
    const datosJugador = {
        nombre: nombre,
        tiempo: tiempoFormateado,
        fecha: fechaFormateada,
    };

    leaderboard.push(datosJugador);

    leaderboard.sort((a, b) => {
        const tiempoA = a.tiempo.split(':').map(Number);
        const tiempoB = b.tiempo.split(':').map(Number);
        return tiempoA[0] * 60 + tiempoA[1] - (tiempoB[0] * 60 + tiempoB[1]);
    });

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function mostrarLeaderboard() {
    const ul = document.querySelector('#leaderboard');
    ul.innerHTML = ''; 
    const mejoresJugadores = leaderboard.slice(0, 10);

    mejoresJugadores.forEach(({ nombre, tiempo, fecha }) => {
        const li = document.createElement('li');
        li.textContent = `${nombre} - ${tiempo} - ${fecha}`;
        ul.appendChild(li);
    });
}

