const gameContainer = document.getElementById("gameContainer");
let cells = document.querySelectorAll(".cell");
let statustext = document.querySelector("#statustext");
let restartBtn = document.querySelector("#restart");
const winconditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentplayer = Math.random() < 0.5 ? "X" : "O";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGameWithAnimation);
    statustext.textContent = `${currentplayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellindex = this.getAttribute("cellindex");

    if(options[cellindex] != "" || !running){
        return;
    }

    updateCell(this, cellindex);
    checkWinner();
}

function updateCell(cell, index){
    options[index] = currentplayer;
    cell.textContent = currentplayer;
}

function changePlayer(){
    currentplayer = (currentplayer == "X") ? "O" : "X";
    statustext.textContent = `${currentplayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winconditions.length; i++){
        const condition = winconditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA === "" || cellB === "" || cellC === ""){
            continue;
        }
        if(cellA === cellB && cellB === cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statustext.textContent = `${currentplayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        statustext.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    currentplayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statustext.textContent = `${currentplayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

function restartGameWithAnimation(e){
    e.preventDefault();

    const currentNote = gameContainer.querySelector(".note");

    const newNote = document.createElement("div");
    newNote.classList.add("note");
    newNote.innerHTML = document.querySelector(".note-content").outerHTML;
    gameContainer.insertBefore(newNote, currentNote);

    currentNote.querySelector(".note-content").style.visibility = "hidden";

    currentNote.classList.add("removing");

    const newCells = newNote.querySelectorAll(".cell");
    const newStatus = newNote.querySelector("#statustext");
    const newRestart = newNote.querySelector("#restart");

    options = ["", "", "", "", "", "", "", "", ""];
    currentplayer = "X";
    running = true;

    newCells.forEach(cell => cell.textContent = "");
    newStatus.textContent = `${currentplayer}'s turn`;

    newCells.forEach(cell => cell.addEventListener("click", cellClicked));
    newRestart.addEventListener("click", restartGameWithAnimation);

    cells = newCells;
    statustext = newStatus;
    restartBtn = newRestart;

    currentNote.addEventListener("transitionend", () => {
        currentNote.remove();
    }, { once: true });
}
