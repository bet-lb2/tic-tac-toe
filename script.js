function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
  
    
    const getBoard = () => board;
  
    const dropToken = (row, column, player) => {
        board[row][column].addToken(player);
    };
  
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
  
    return { getBoard, dropToken, printBoard };
  }
  
function Cell() {
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue
    };
}
  
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
    ) {
    const board = Gameboard();

    const players = [
        {
        name: playerOneName,
        token: 1
        },
        {
        name: playerTwoName,
        token: 2
        }
    ];

    const getPlayers = () => players;

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    
    let gameOver = false;
    const checkWinner = () => {
        const currentBoard = board.getBoard().map(row => row.map(cell => cell.getValue()));

        let leftToRightDiagonal = []
        for (let i = 0; i < currentBoard.length; i++) {
            // check row
            if (currentBoard[i].every(cell => cell === 1) || currentBoard[i].every(cell => cell === 2)) {
                gameOver = true;
            }

            leftToRightDiagonal.push(currentBoard[i][i]);

            //check column
            let column = [];
            for (let j = 0; j < currentBoard[i].length; j++) {
                column.push(currentBoard[i][j]);
            }
            if (column.every(cell => cell === 1) || column.every(cell => cell === 2)) {
                gameOver = true;
            }
        }
        // check leftToRightDiagonal
        if (leftToRightDiagonal.every(cell => cell === 1) || leftToRightDiagonal.every(cell => cell === 2)) {
            gameOver = true;
        }
        // check rightToLeftDiagonal
        let rightToLeftDiagonal = [];
        rightToLeftDiagonal.push(currentBoard[0][2], currentBoard[1][1], currentBoard[2][0]);

        if (rightToLeftDiagonal.every(cell => cell === 1) || rightToLeftDiagonal.every(cell => cell === 2)) {
            gameOver = true;
        }
        return gameOver;
    }

    const getGameOver = () => gameOver;
    const initGameOver = () => gameOver = false;
    let message;
    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() !== 0) {
            console.log("You can't select this cell. Please choose again.");
            return;
        }
        console.log(
        `Dropping ${getActivePlayer().name}'s token into row ${row}, and column ${column}...`
        );
        board.dropToken(row, column, getActivePlayer().token);

        if (checkWinner()) {
            console.log(`${getActivePlayer().name} win!`);
            // createPlayAgainModal(`${getActivePlayer().name} win!`);
            // return `${getActivePlayer().name} win!`;
            message = `${getActivePlayer().name} win!`;
            // console.log(message)
            return;
        }

        if (!checkWinner() && board.getBoard().every(row => row.every(cell => cell.getValue() !== 0))) {
            console.log("It's tie");
            // createPlayAgainModal("It's tie.");
            // return "It's tie";
            message = "It's tie";
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    const getMessage = () => message;
    const initMessage = () => message = undefined;;

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getGameOver,
        getMessage,
        getPlayers,
        initGameOver,
        initMessage,
        getBoard: board.getBoard
    };
}

function ScreenController(palyerOneName, playerTwoName) {
    const game = GameController(palyerOneName, playerTwoName);
    const playerTurnDiv = document.querySelector("#turn");
    const boardDiv = document.querySelector("#gameboard");

    const updateScreen = () => {
        boardDiv.innerHTML = "";
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellDiv = document.createElement("div");
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                cellButton.textContent = cell.getValue() === 0  ? "" : cell.getValue() === 1 ? "o" : "x";
                cellDiv.appendChild(cellButton);
                boardDiv.appendChild(cellDiv);
            })
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const  selectedColumn = e.target.dataset.column;

        if (!selectedRow || !selectedColumn) return;

        game.playRound(selectedRow, selectedColumn);
        if (game.getGameOver()) {
            createPlayAgainModal(game.getMessage());
        };
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();

    function createPlayAgainModal(message) {
        game.initGameOver();
        game.initMessage();
        const dialog = document.querySelector("dialog");
        const playerOneName = game.getPlayers()[0].name;
        const playerTwoName = game.getPlayers()[1].name;
        dialog.innerHTML = `
            <div class="message">
                ${message}
            </div>
            <div class="buttons">
                <button class="play-again">Play Again</button>
                <button class="reset-game">Reset Game</button>
            </div>`;
        const resetGameButton = document.querySelector(".reset-game");
        const playAgainButton = document.querySelector(".play-again");
        resetGameButton.addEventListener("click", createNameSelectModal);
        playAgainButton.addEventListener("click", () => {
            ScreenController(playerOneName, playerTwoName);
            dialog.close();
        })
        dialog.showModal();
    }
}

function createNameSelectModal() {
    const dialog = document.querySelector("dialog");
    dialog.innerHTML = `
        <form action="#" method="dialog"><div>
                <label for="player-one-name">Player One's name</label>
                <input type="text" id="player-one-name" placeholder="Player One">
            </div>
            <div>
                <label for="player-two-name">Player Two's name</label>
                <input type="text" id="player-two-name" placeholder="Player two">
            </div>
            <button>Game Start</button>
        </form>`
    dialog.showModal();
    let playerOneName;
    let playerTwoName;

    function getPlayerName() {
        playerOneName = document.getElementById("player-one-name").value || undefined;
        playerTwoName = document.getElementById("player-two-name").value || undefined;
    }
    document.querySelector("dialog form button").addEventListener("click", () => {
        getPlayerName();
        document.querySelector("#gameboard").style.visibility = "visible";
        ScreenController(playerOneName, playerTwoName);
    })
}

createNameSelectModal();