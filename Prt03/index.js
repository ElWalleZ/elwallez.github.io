var board = [];
var rows = 8;
var columns = 8;
var mineCount = 5;
var mineLocation = [];
var tilesClicked = 0;
var flagEnabled = false;
var gameOver = false;
var correctFlags = 0; // Track correctly flagged mines

window.onload = function () {
    document.getElementById("mine-counter").innerText = mineCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
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
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
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

    // Handle flagging
    if (flagEnabled) {
        if (tile.innerText === "") {
            tile.innerText = "🚩";
            if (mineLocation.includes(tile.id)) {
                correctFlags += 1; // Correctly flagged mine
            }
        } else if (tile.innerText === "🚩") {
            tile.innerText = "";
            if (mineLocation.includes(tile.id)) {
                correctFlags -= 1; // Unflagging a correct mine
            }
        }
        // Update mine counter display (not the actual mine count)
        document.getElementById("mine-counter").innerText = mineCount - correctFlags;
        checkWin(); // Check for win condition after flagging
        return;
    }

    // Prevent clicking a flagged tile when not in flag mode
    if (tile.innerText === "🚩") {
        return;
    }

    // Handle tile clicking
    if (mineLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
    checkWin(); // Check if the game has been won after revealing
}

function checkWin() {
    let safeTiles = rows * columns - mineCount; // Total number of safe tiles

    // Check if all safe tiles are clicked
    if (tilesClicked === safeTiles) {
        document.getElementById("mine-counter").innerText = "Cleared!";
        gameOver = true;
        return;
    }

    // Check if all bombs are flagged correctly
    if (correctFlags === mineCount) {
        let allMinesFlagged = true;

        // Check if all flagged tiles are indeed mines
        for (let id of mineLocation) {
            let tile = document.getElementById(id);
            if (tile.innerText !== "🚩") {
                allMinesFlagged = false;
                break;
            }
        }

        if (allMinesFlagged) {
            document.getElementById("mine-counter").innerText = "Cleared!";
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
        document.getElementById("mine-counter").innerText = "Cleared!";
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