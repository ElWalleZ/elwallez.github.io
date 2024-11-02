var board = [];
var rows = 5; 
var columns = 5; 
var mineCount = 5;
var mineLocation = [];
var tilesClicked = 0;
var flagEnabled = false;
var gameOver = false;
var correctFlags = 0;

window.onload = function () {
    document.getElementById("restart-button").addEventListener("click", resetGame);
    const difficultySelect = document.getElementById("difficulty");
    difficultySelect.value = "easy";
    document.getElementById("mine-counter").innerText = mineCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    startGame();
    document.getElementById("difficulty").addEventListener("change", resetGame);
}

function setDifficulty(difficulty) {

    switch (difficulty) {
        case 'easy':
            rows = 5;
            columns = 5;
            mineCount = 5;
        break;

        case 'medium':
            rows = 8;
            columns = 8;
            mineCount = 10;
        break;

        case 'hard':
            rows = 10;
            columns = 10;
            mineCount = 15;
        break;

        case 'very-hard':
            rows = 12;
            columns = 12;
            mineCount = 20;
        break;

        case 'legend':
            rows = 15;
            columns = 15;
            mineCount = 30;
        break;

        default:
            rows = 5;
            columns = 5;
            mineCount = 5;
        break;
    }

}

function resetGame() {
    const selectedDifficulty = document.getElementById("difficulty").value;
    setDifficulty(selectedDifficulty);
    board = [];
    mineLocation = [];
    tilesClicked = 0;
    flagEnabled = false;
    gameOver = false;
    correctFlags = 0;

    document.getElementById("flag-button").style.background = "lightgray";
    document.getElementById("game-message").innerHTML = `Minas: <span id="mine-counter">${mineCount}</span>`;
    document.getElementById("mine-counter").innerText = mineCount;
    document.getElementById("board").innerHTML = ""; 
    startGame();
}

function setMines() {
    let minesLeft = mineCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();
        if (!mineLocation.includes(id)) {
            mineLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    setMines();
    const boardElement = document.getElementById("board");
    boardElement.style.gridTemplateColumns = `repeat(${columns}, 1fr)`; 

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.addEventListener("click", clickTile);
            boardElement.append(tile);
            row.push(tile);
        }
        board.push(row); 
    }
    console.log(board);
}

function setFlag() {
    flagEnabled = !flagEnabled;
    document.getElementById("flag-button").style.backgroundColor = flagEnabled ? "darkgray" : "lightgray";
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;

    if (flagEnabled) {
        if (tile.innerText === "") {
            tile.innerText = "🚩";
            if (mineLocation.includes(tile.id)) {
                correctFlags += 1;
            }
        } else if (tile.innerText === "🚩") {
            tile.innerText = "";
            if (mineLocation.includes(tile.id)) {
                correctFlags -= 1;
            }
        }
        document.getElementById("mine-counter").innerText = mineCount - correctFlags;
        checkWin();
        return;
    }

    if (tile.innerText === "🚩") {
        return;
    }

    if (mineLocation.includes(tile.id)) {
        gameOver = true;
        document.getElementById("game-message").innerText = "Perdiste!";
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
    checkWin(); 
}

function checkWin() {
    let safeTiles = rows * columns - mineCount;

    if (tilesClicked === safeTiles) {
        document.getElementById("game-message").innerText = "Limpiaste el Campo!";
        gameOver = true;
        return;
    }

    if (correctFlags === mineCount) {
        let allMinesFlagged = true;

        for (let id of mineLocation) {
            let tile = document.getElementById(id);
            if (tile.innerText !== "🚩") {
                allMinesFlagged = false;
                break;
            }
        }

        if (allMinesFlagged) {
            document.getElementById("game-message").innerText = "Encontraste todas las Minas!";
            gameOver = true;
        }
    }
}

function revealMines() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let tile = board[i][j];
            if (mineLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }

    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;
    minesFound += checkTile(r - 1, c - 1);
    minesFound += checkTile(r - 1, c);
    minesFound += checkTile(r - 1, c + 1);
    minesFound += checkTile(r, c - 1);
    minesFound += checkTile(r, c + 1);
    minesFound += checkTile(r + 1, c - 1);
    minesFound += checkTile(r + 1, c);
    minesFound += checkTile(r + 1, c + 1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        checkMine(r - 1, c - 1);
        checkMine(r, c - 1);
        checkMine(r - 1, c + 1);
        checkMine(r, c + 1);
        checkMine(r + 1, c - 1);
        checkMine(r + 1, c);
        checkMine(r + 1, c + 1);
    }

    if (tilesClicked === rows * columns - mineCount) {
        document.getElementById("mine-counter").innerText = "Encontradas!";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (mineLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}