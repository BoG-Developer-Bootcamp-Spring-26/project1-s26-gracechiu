let currentId = 132; // start at Ditto
let currentView = "info"; // "info" or "moves"

async function fetchPokemon(idOrName) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Pokemon not found");
  return await res.json();
}

function titleCase(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function setActiveTab() {
  const infoBtn = document.getElementById("info-button");
  const movesBtn = document.getElementById("moves-button");
  infoBtn.style.backgroundColor = currentView === "info" ? "#7CFF79" : "#E8E8E8";
  movesBtn.style.backgroundColor = currentView === "moves" ? "#7CFF79" : "#E8E8E8";
}

function renderPokemon(data) {
  // image
  const img = document.getElementById("ditto-image");
  const sprite = data.sprites?.front_default; // default sprite
  if (sprite) img.src = sprite;

  // name
  document.getElementById("pokemon-name").textContent = titleCase(data.name);

  // types
  const typeBox = document.getElementById("type-box");
  typeBox.innerHTML = data.types
    .map(t => `<p class="Type-Box-Text">${t.type.name}</p>`)
    .join("");

  // info/moves
  const infoBox = document.getElementById("info-box");
  if (currentView === "info") {
    const heightM = data.height / 10;
    const weightKg = data.weight / 10;
    infoBox.innerHTML = `
      <p class="Body-Text">Height: ${heightM} m</p>
      <p class="Body-Text">Weight: ${weightKg} kg</p>
      <p class="Body-Text">Base XP: ${data.base_experience ?? "?"}</p>
    `;
  } else {
    const moves = data.moves.slice(0, 10).map(m => m.move.name);
    infoBox.innerHTML = moves.map(m => `<p class="Body-Text">${m}</p>`).join("");
  }

  setActiveTab();
}

async function loadPokemon(idOrName) {
  try {
    const data = await fetchPokemon(idOrName);
    currentId = data.id;
    renderPokemon(data);
  } catch (e) {
    console.error(e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // arrows
  document.getElementById("left-arrow").addEventListener("click", () => {
    loadPokemon(Math.max(1, currentId - 1));
  });
  document.getElementById("right-arrow").addEventListener("click", () => {
    loadPokemon(currentId + 1);
  });

  // tabs
  document.getElementById("info-button").addEventListener("click", () => {
    currentView = "info";
    loadPokemon(currentId);
  });
  document.getElementById("moves-button").addEventListener("click", () => {
    currentView = "moves";
    loadPokemon(currentId);
  });

  loadPokemon(currentId);
});