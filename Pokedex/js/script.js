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
                    llenarOpcionesAutocompletar();
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

// Función para llenar las opciones de autocompletar
function llenarOpcionesAutocompletar() {
    const pokemonListDataList = document.getElementById("pokemon-list");

    pokemonList.forEach(pokemon => {
        const option = document.createElement("option");
        option.value = pokemon.name;
        pokemonListDataList.appendChild(option);
    });
}

// Obtén una referencia al campo de búsqueda y al botón de búsqueda
const buscadorInput = document.getElementById("buscador");
const buscarPokemonBtn = document.getElementById("buscar-pokemon");

// Agrega un event listener al botón de búsqueda
buscarPokemonBtn.addEventListener("click", () => {
    const searchTerm = buscadorInput.value.toLowerCase().trim();

    if (searchTerm === "") {
        // Muestra un mensaje de error en el div de Pokémon si no se ingresa ningún término de búsqueda
        mostrarMensajeError('Por favor, ingresa un nombre de Pokémon.');
    } else {
        // Busca el Pokémon seleccionado en la lista de Pokémon
        const selectedPokemon = pokemonList.find(pokemon => pokemon.name === searchTerm);

        if (selectedPokemon) {
            // Muestra el Pokémon si se encuentra
            mostrarPokemonEnPagina(selectedPokemon);
        } else {
            // Muestra un mensaje de error en el div de Pokémon si el Pokémon no se encuentra
            mostrarMensajeError('Pokémon no encontrado.');
        }
    }
});

// Función para mostrar un mensaje de error en el div de Pokémon
function mostrarMensajeError(mensaje) {
    listaPokemon.innerHTML = ""; // Limpia la lista de Pokémon actual
    const mensajeError = document.createElement("p");
    mensajeError.classList.add("error-message");
    mensajeError.textContent = mensaje;

    // Elimina mensajes de error anteriores, si los hay
    const mensajesAnteriores = document.querySelectorAll(".error-message");
    mensajesAnteriores.forEach(mensaje => mensaje.remove());

    // Agrega el mensaje de error al div de Pokémon
    listaPokemon.appendChild(mensajeError);
}

// Llama a cargarPokemonDesdeAPI al inicio para obtener los Pokémon desde la API
cargarPokemonDesdeAPI();
