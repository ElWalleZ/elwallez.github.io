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
    setTimeout(() => { celdas[randomPosicion].style.background = ''; }, 350);


    if (checkWinner()) return;

    jugador = 'X';
    gameEsperando = false;
}

function checkWinner() {
    for (const [a, b, c] of wins) {
        if (tablero[a] === jugador &&
            tablero[b] === jugador &&
            tablero[c] === jugador) {
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
    console.log((tiempoFin - tiempoInicio) / 1000);

    tableroGanador.forEach((index) => {
        celdas[index].style.background = '#604caa';
    });

    btnReiniciar.style.visibility = 'visible';
    gameEsperando = true;
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
