

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

const puzzle = document.getElementById("puzzle");
const moveCounter = document.getElementById("moves");
const message = document.getElementById("message");


let originalTiles = [...Array(TILE_COUNT - 1).keys()].map(i => i + 1).concat(null);
let tiles = [...originalTiles];
let moves = 0;

function renderPuzzle() {
  puzzle.innerHTML = "";
  tiles.forEach((value, i) => {
    const tile = document.createElement("div");
    tile.className = "tile" + (value === null ? " empty" : "");
    tile.textContent = value || "";
    tile.addEventListener("click", () => moveTile(i));
    puzzle.appendChild(tile);
  });
}

function moveTile(index) {
  const emptyIndex = tiles.indexOf(null);
  const validMoves = [
    index - 1,
    index + 1,
    index - GRID_SIZE,
    index + GRID_SIZE
  ];

  if (
    validMoves.includes(emptyIndex) &&
    isAdjacent(index, emptyIndex)
  ) {
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    moves++;
    updateMoves();
    renderPuzzle();
    checkWin();
  }
}

function isAdjacent(i1, i2) {
  const x1 = i1 % GRID_SIZE, y1 = Math.floor(i1 / GRID_SIZE);
  const x2 = i2 % GRID_SIZE, y2 = Math.floor(i2 / GRID_SIZE);
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function shufflePuzzle() {
  for (let i = 0; i < 1000; i++) {
    const empty = tiles.indexOf(null);
    const neighbors = [empty - 1, empty + 1, empty - GRID_SIZE, empty + GRID_SIZE]
      .filter(i => i >= 0 && i < TILE_COUNT && isAdjacent(i, empty));
    const move = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[empty], tiles[move]] = [tiles[move], tiles[empty]];
  }
  moves = 0;
  updateMoves();
  message.textContent = "";
  renderPuzzle();
}

function resetPuzzle() {
  tiles = [...originalTiles];
  moves = 0;
  updateMoves();
  message.textContent = "";
  renderPuzzle();
}

function updateMoves() {
  moveCounter.textContent = `Moves: ${moves}`;
}

function checkWin() {
  if (tiles.every((val, i) => val === originalTiles[i])) {
    message.textContent = "You solved the puzzle!";
  }
  save();
  document.getElementById("playerName").value = "";
}

function save() {
  const playerInput = document.getElementById("playerName");
  const playerName = playerInput.value.trim() || "Anonymous";

  const movesText = moveCounter.textContent || "";
  const moves = parseInt(movesText.replace(/\D/g, ""), 10) || 0;

  const data = {
    Player: playerName,
    Moves: moves
  };

  localStorage.setItem(`puzzleSave_${playerName}`, JSON.stringify(data));


}

function load() {
    alert("Load function triggered!");
  const playerInput = document.getElementById("playerName");
  const playerName = playerInput.value.trim() || "Anonymous";

  const saved = localStorage.getItem(`puzzleSave_${playerName}`);
  if (saved) {
    const data = JSON.parse(saved);
    alert(`Loaded ${data.Player}'s game with ${data.Moves} moves.`);
    // Optionally set moves counter or puzzle state here
  } else {
    alert(`No saved game found for ${playerName}.`);
  }
}

function clearSave() {
    localStorage.clear();
}

shufflePuzzle();
