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

        let diagonal = []
        for (let i = 0; i < currentBoard.length; i++) {
            // check row
            if (currentBoard[i].every(cell => cell === 1) || currentBoard[i].every(cell => cell === 2)) {
                gameOver = true;
            }

            diagonal.push(currentBoard[i][i]);

            //check column
            let column = [];
            for (let j = 0; j < currentBoard[i].length; j++) {
                column.push(currentBoard[i][j]);
            }
            if (column.every(cell => cell === 1) || column.every(cell => cell === 2)) {
                gameOver = true;
            }
        }
        // check diagonal
        if (diagonal.every(cell => cell === 1) || diagonal.every(cell => cell === 2)) {
            gameOver = true;
        }
        diagonal = [];
        diagonal.push(currentBoard[0][2]);
        diagonal.push(currentBoard[1][1]);
        diagonal.push(currentBoard[2][0]);
        if (diagonal.every(cell => cell === 1) || diagonal.every(cell => cell === 2)) {
            gameOver = true;
        }
    }

    const playRound = (row, column) => {
        if (board.getBoard()[row][column].getValue() !== 0) {
            console.log("You can't select this cell. Please choose again.");
            return;
        }
        console.log(
        `Dropping ${getActivePlayer().name}'s token into row ${row}, and column ${column}...`
        );
        board.dropToken(row, column, getActivePlayer().token);

        checkWinner();
        if (gameOver) {
            console.log(`${getActivePlayer().name} win!`);
            return;
        }

        if (!gameOver && board.getBoard().every(row => row.every(cell => cell.getValue() !== 0))) {
            console.log("It's tie");
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

function ScreenController(palyer1Name, player2Name) {
    const game = GameController(palyer1Name, player2Name);
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

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
}

function nameSelect() {
    const dialog = document.querySelector("dialog");
    dialog.showModal();
    let playerOneName;
    let playerTwoName;

    function getPlayerName() {
        playerOneName = document.getElementById("player-one-name").value || "Player One";
        playerTwoName = document.getElementById("player-two-name").value || "Player Two";
    }
    document.querySelector("dialog form button").addEventListener("click", () => {
        getPlayerName();
        document.querySelector("#gameboard").style.visibility = "visible";
        ScreenController(playerOneName, playerTwoName);
    })
}

nameSelect();