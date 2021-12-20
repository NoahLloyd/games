const columns = document.querySelectorAll(".column");
const text = document.getElementById("text");
const playAgain = document.getElementById("playAgain");
let player = "X";

const newGame = () => {
  playAgain.classList.add("hidden");
  player = "X";
  columns.forEach((column) => {
    column.innerHTML = "-";
    column.addEventListener("click", () => {
      win = clickOnColumn(column);
      if (win) {
        // Gets rid of the event listeners 
        // and with that disables clicking on other boxes
        columns.forEach((col) => {
          const colCopy = col.cloneNode(true);
          col.parentNode.replaceChild(colCopy, col);
        });
      }
    });
  });
};
newGame();

const clickOnColumn = (column) => {
  const nextPlayer = player === "X" ? "O" : "X";
  if (column.innerText === "-") {
    column.innerHTML = player;
    player = nextPlayer;
    text.innerHTML = `Your turn, player ${player}`;
    win = checkForWin();
  } else {
    text.innerText = "You cannot click there!";
  }
  return win;
};
const checkForWin = () => {
  // Makes a 2d array of how the board looks
  let board = [];
  [0, 1, 2].forEach((row) => {
    const startIndex = +row * 3;
    board = [
      ...board,
      [
        columns[startIndex].innerText,
        columns[startIndex + 1].innerText,
        columns[startIndex + 2].innerText,
      ],
    ];
  });
  if (checkBoard(board, "X")) {
    handleWin("X");
    return "X";
  }
  if (checkBoard(board, "O")) {
    handleWin("O");
    return "O";
  }
  return false;
};

const checkBoard = (board, player) => {
  const player3 = player + player + player;
  // Checks if anyone won
  let winner = "";
  if (player3 === board[0][0] + board[1][0] + board[2][0]) winner = player;
  if (player3 === board[0][1] + board[1][1] + board[2][1]) winner = player;
  if (player3 === board[0][2] + board[1][2] + board[2][2]) winner = player;

  if (player3 === board[0][0] + board[0][1] + board[0][2]) winner = player;
  if (player3 === board[1][0] + board[1][1] + board[1][2]) winner = player;
  if (player3 === board[2][0] + board[2][1] + board[2][2]) winner = player;

  if (player3 === board[0][0] + board[1][1] + board[2][2]) winner = player;
  if (player3 === board[0][2] + board[1][1] + board[2][0]) winner = player;
  if (winner === player) {
  }
  return winner === player ? true : false;
};
const handleWin = (winner) => {
  text.innerText = `Congrats ${winner}!`;
  playAgain.classList.remove("hidden");
};
