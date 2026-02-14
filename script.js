let currentId = 132; // start at Ditto
let currentView = "info"; // "info" or "moves"

async function fetchPokemon(idOrName) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
  if (!res.ok) throw new Error("Pokemon not found");
  return await res.json();
}

// function titleCase(s) {
//   return s.charAt(0).toUpperCase() + s.slice(1);
// }

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
  document.getElementById("pokemon-name").textContent = data.name;

  // types
  // types (one box per type, colored)
    const typeBoxes = document.getElementById("type-box");

    const TYPE_COLORS = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
    };

    typeBoxes.innerHTML = data.types
    .map(t => {
        const typeName = t.type.name;
        const bg = TYPE_COLORS[typeName] ?? "#E8E8E8";
        return `
        <div class="Type-Box" style="background-color: ${bg}">
            <p class="Type-Box-Text">${typeName}</p>
        </div>
        `;
    })
    .join("");

  // info/moves
  const infoBox = document.getElementById("info-box");
  if (currentView === "info") {
    const heightM = data.height / 10;
    const weightKg = data.weight / 10;
    const stats = Object.fromEntries(
        data.stats.map(s => [s.stat.name, s.base_stat])
      );
    infoBox.innerHTML = `
      <p class="Body-Text">Height: ${heightM} m</p>
      <p class="Body-Text">Weight: ${weightKg} kg</p>
      <p class="Body-Text">HP: ${stats["hp"]}</p>
        <p class="Body-Text">Attack: ${stats["attack"]}</p>
        <p class="Body-Text">Defense: ${stats["defense"]}</p>
        <p class="Body-Text">Special Attack: ${stats["special-attack"]}</p>
        <p class="Body-Text">Special Defense: ${stats["special-defense"]}</p>
        <p class="Body-Text">Speed: ${stats["speed"]}</p>
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