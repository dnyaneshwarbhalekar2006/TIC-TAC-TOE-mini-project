let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let vsComputerBtn = document.querySelector("#vs-computer-btn");
let vsPlayerBtn = document.querySelector("#vs-player-btn");
let modeContainer = document.querySelector(".mode-container");
let container = document.querySelector(".container");

let turnO = true;
let gameMode = "";

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  turnO = true;
  enableBoxes();
  boxes.forEach((box) => box.classList.remove("winner"));
  msgContainer.classList.add("hide");
  resetBtn.classList.remove("hide");
  newGameBtn.classList.add("hide");
  msg.innerText = "Player O's turn";
};

const fullReset = () => {
  resetGame();
  gameMode = "";
  modeContainer.style.display = "flex";
  container.classList.add("hide");
  resetBtn.classList.add("hide");
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}!`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  newGameBtn.classList.remove("hide");
  resetBtn.classList.add("hide");

  // Highlight winning boxes
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    if (
      boxes[a].innerText !== "" &&
      boxes[a].innerText === boxes[b].innerText &&
      boxes[b].innerText === boxes[c].innerText
    ) {
      boxes[a].classList.add("winner");
      boxes[b].classList.add("winner");
      boxes[c].classList.add("winner");
      break;
    }
  }
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let val1 = boxes[pattern[0]].innerText;
    let val2 = boxes[pattern[1]].innerText;
    let val3 = boxes[pattern[2]].innerText;

    if (val1 !== "" && val1 === val2 && val2 === val3) {
      showWinner(val1);
      return true;
    }
  }

  const isDraw = [...boxes].every((box) => box.innerText !== "");
  if (isDraw) {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
    disableBoxes();
    newGameBtn.classList.remove("hide");
    resetBtn.classList.add("hide");
    return true;
  }

  return false;
};

const aiMove = () => {
  const available = [...boxes].filter((box) => box.innerText === "");
  if (available.length === 0) return;

  const randomBox = available[Math.floor(Math.random() * available.length)];
  randomBox.innerText = "X";
  randomBox.disabled = true;
  turnO = true;
  checkWinner();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.innerText !== "") return;

    if (turnO) {
      box.innerText = "O";
    } else {
      if (gameMode === "player") {
        box.innerText = "X";
      }
    }

    box.disabled = true;

    const gameOver = checkWinner();

    if (!gameOver) {
      if (gameMode === "player") {
        turnO = !turnO;
        msg.innerText = turnO ? "Player O's turn" : "Player X's turn";
      } else if (gameMode === "computer") {
        turnO = false;
        msg.innerText = "Computer's turn";
        setTimeout(() => {
          aiMove();
          if (!checkWinner()) {
            msg.innerText = "Player O's turn";
          }
        }, 500);
      }
    }
  });
});

vsComputerBtn.addEventListener("click", () => {
  gameMode = "computer";
  startGame();
});

vsPlayerBtn.addEventListener("click", () => {
  gameMode = "player";
  startGame();
});

const startGame = () => {
  modeContainer.style.display = "none";
  container.classList.remove("hide");
  resetBtn.classList.remove("hide");
  resetGame();
};

newGameBtn.addEventListener("click", fullReset);
resetBtn.addEventListener("click", resetGame);
