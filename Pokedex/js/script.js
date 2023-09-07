const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const pokemonPorPagina = 20;
let paginaActual = 1;

let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

function mostrarPokemon(poke) {

    const inicio = (paginaActual - 1) * pokemonPorPagina;
    const fin = paginaActual * pokemonPorPagina;

    if (poke.id >= inicio + 1 && poke.id <= fin) {

        let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
        tipos = tipos.join('');

        let pokeId = poke.id.toString();
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
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
        listaPokemon.append(div);
    }



}

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {

                if (botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }

            })
    }
}))

// ...

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
    const totalPages = Math.ceil(151 / pokemonPorPagina);
    if (paginaActual < totalPages) {
        paginaActual++;
        actualizarPagina();
    }
});

function actualizarPagina() {
    listaPokemon.innerHTML = "";
    const inicio = (paginaActual - 1) * pokemonPorPagina;
    const fin = paginaActual * pokemonPorPagina;

    for (let i = inicio + 1; i <= fin; i++) {
        if (i <= 151) {
            fetch(URL + i)
                .then((response) => response.json())
                .then(data => mostrarPokemon(data))
        }
    }
    pageNum.textContent = `Página ${paginaActual}`;
}

// Llama a actualizarPagina al inicio para mostrar la primera página
actualizarPagina();
