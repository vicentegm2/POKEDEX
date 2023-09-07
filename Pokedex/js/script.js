const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const pokemonPorPagina = 10;
let paginaActual = 1;
const maxPokemon = 151; /* Número de Pokemones -- Máximo 1008 */
let URL = "https://pokeapi.co/api/v2/pokemon/";

let pokemonList = [];

function cargarPokemonDesdeAPI() {
    for (let i = 1; i <= maxPokemon; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                pokemonList.push(data);
                if (pokemonList.length === maxPokemon) {
                    ordenarYMostrarPokemon();
                }
            });
    }
}

function mostrarPokemonEnPagina(pokemon) {
    const tipos = pokemon.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`).join('');

    let pokeId = pokemon.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">
                <a class="link_Wikedex" target="_blank" href="https://www.wikidex.net/wiki/${pokemon.name}">${pokemon.name}</a></h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${pokemon.height}m</p>
                <p class="stat">${pokemon.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);
}

function ordenarYMostrarPokemon() {
    pokemonList.sort((a, b) => a.id - b.id);
    actualizarPagina();
}



botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";

    if (botonId === "ver-todos") {
        ordenarYMostrarPokemon();
    } else {
        for (let i = 1; i <= maxPokemon; i++) {
            fetch(URL + i)
                .then((response) => response.json())
                .then(data => {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemonEnPagina(data);
                    }
                })
        }
    }
}))

const prevPageBtn = document.getElementById("prev-page");
const nextPageBtn = document.getElementById("next-page");
const pageNum = document.getElementById("page-num");

prevPageBtn.addEventListener("click", () => {
    if (paginaActual > 1) {
        paginaActual--;
        actualizarPagina();
    }
});

nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(maxPokemon / pokemonPorPagina);
    if (paginaActual < totalPages) {
        paginaActual++;
        actualizarPagina();
    }
});

function actualizarPagina() {
    listaPokemon.innerHTML = "";
    const inicio = (paginaActual - 1) * pokemonPorPagina;
    const fin = paginaActual * pokemonPorPagina;

    for (let i = inicio; i < fin; i++) {
        if (i < pokemonList.length) {
            mostrarPokemonEnPagina(pokemonList[i]);
        }
    }
    pageNum.textContent = `Página ${paginaActual}`;
}

// ...

// Obtén una referencia al elemento de entrada de búsqueda y al botón de búsqueda
const buscadorInput = document.getElementById("buscador");
const buscarPokemonBtn = document.getElementById("buscar-pokemon");

// Agrega un event listener al botón de búsqueda
buscarPokemonBtn.addEventListener("click", () => {
    const searchTerm = buscadorInput.value.toLowerCase().trim();

    // Filtra los Pokémon en base al término de búsqueda
    const resultados = pokemonList.filter(pokemon => pokemon.name.includes(searchTerm));

    // Limpia la lista actual de Pokémon en la página
    listaPokemon.innerHTML = "";

    // Muestra los resultados en la página
    resultados.forEach(pokemon => {
        mostrarPokemonEnPagina(pokemon);
    });
});

// ...




// Llama a cargarPokemonDesdeAPI al inicio para obtener los Pokémon desde la API
cargarPokemonDesdeAPI();


