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

// Función para mostrar un mensaje de curiosidad sobre los Pokémon en un alert
function mostrarCuriosidadPokemon() {
    // Define un array de curiosidades sobre Pokémon
    // Define un array de curiosidades sobre Pokémon
const curiosidades = [
    "¿Sabías que Pikachu es el Pokémon más reconocible y la mascota oficial de Pokémon?",
    "Charizard, uno de los Pokémon iniciales de tipo fuego, es conocido por su imponente aspecto y poderoso ataque.",
    "Eevee es un Pokémon único debido a su capacidad para evolucionar en múltiples formas diferentes.",
    "Los Pokémon tipo Dragón son conocidos por su resistencia y fuerza, pero son vulnerables a los movimientos tipo Hada.",
    "Mewtwo es uno de los Pokémon más poderosos y fue creado artificialmente a partir del ADN de Mew.",
    "Pikachu evoluciona a Raichu cuando se le utiliza una Piedra Trueno.",
    "El Profesor Oak, también conocido como Profesor Pokémon, es uno de los personajes más icónicos de la serie.",
    "La región de Kanto es la primera región explorada en los juegos de Pokémon y contiene 8 gimnasios.",
    "Bulbasaur es el único Pokémon que aprende dos movimientos al subir de nivel antes de evolucionar.",
    "Las Evoluciones Eevee se introdujeron en la primera generación de Pokémon y permiten que Eevee se convierta en varias formas diferentes.",
    "La serie de dibujos animados de Pokémon ha estado en emisión durante más de 20 años.",
    "Los juegos Pokémon Rojo y Verde fueron los primeros juegos de Pokémon lanzados en Japón.",
    "Pikachu tiene una cola en forma de rayo que puede generar electricidad.",
    "Ash Ketchum es el protagonista de la serie de dibujos animados de Pokémon y sueña con convertirse en un Maestro Pokémon.",
    "El Equipo Rocket, formado por Jessie, James y Meowth, es uno de los villanos recurrentes en la serie de dibujos animados.",
    "Misty y Brock son dos de los amigos de Ash que lo acompañan en su viaje.",
    "El movimiento 'Explosión' es conocido por ser uno de los movimientos más poderosos y autoinfligir un KO al usuario.",
    "Jigglypuff es conocido por cantar una canción de cuna que hace que los que la escuchan caigan en un profundo sueño.",
    "El Pokémon Legendario Mew es conocido por su capacidad de aprender cualquier movimiento.",
    "El Profesor Sycamore es el profesor Pokémon de la región de Kalos y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo presentan una región principal y un Campeón al final del juego que es el oponente final.",
    "Cada generación de Pokémon introduce nuevos tipos de Pokémon y movimientos.",
    "El movimiento 'Hyper Beam' es uno de los movimientos más poderosos y conocidos en los juegos de Pokémon.",
    "Los juegos de Pokémon a menudo tienen una versión 'legendaria' de la portada, como Pokémon Sol y Luna.",
    "Pidgey es conocido por ser uno de los Pokémon más comunes y fáciles de encontrar en los juegos.",
    "Los gimnasios de Pokémon son lugares donde los entrenadores pueden desafiar a líderes de gimnasio y ganar medallas.",
    "Las Medallas de Gimnasio son trofeos que los entrenadores ganan al derrotar a líderes de gimnasio en batallas.",
    "Eevee puede evolucionar en Vaporeon, Jolteon, Flareon, Espeon, Umbreon, Leafeon y Glaceon, dependiendo de diversos factores.",
    "Meowth, el Pokémon Gato, es conocido por su habilidad para hablar en la serie de dibujos animados.",
    "Mewtwo es considerado uno de los Pokémon más fuertes y ha aparecido en varias películas de Pokémon.",
    "El Profesor Elm es el profesor Pokémon de la región de Johto y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon suelen contar con una Liga Pokémon que los entrenadores deben desafiar para convertirse en Campeones.",
    "Los Pokémon de tipo Agua son conocidos por su resistencia al agua y su capacidad para nadar.",
    "Los juegos de Pokémon a menudo presentan una organización criminal, como el Equipo Rocket, que los entrenadores deben detener.",
    "Charmander es uno de los Pokémon iniciales de tipo fuego y evoluciona en Charizard.",
    "Los Pokémon Legendarios, como Articuno, Zapdos y Moltres, son difíciles de encontrar y atrapar en los juegos.",
    "El Profesor Birch es el profesor Pokémon de la región de Hoenn y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo presentan una región ficticia basada en una ubicación del mundo real.",
    "Snorlax es conocido por bloquear el camino en los juegos y requiere una flauta especial para ser despertado.",
    "Los juegos de Pokémon suelen contar con una historia principal en la que el jugador debe detener los planes malvados de una organización criminal.",
    "El movimiento 'Surf' permite a los entrenadores viajar por el agua en los juegos de Pokémon.",
    "Brock es uno de los líderes de gimnasio en los juegos de Pokémon y es conocido por su especialización en Pokémon de tipo Roca.",
    "Los movimientos de tipo Hielo son efectivos contra los Pokémon de tipo Planta y Dragón.",
    "El Profesor Rowan es el profesor Pokémon de la región de Sinnoh y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo presentan un equipo de villanos que busca controlar a los Pokémon legendarios.",
    "La región de Unova es conocida por tener un alto número de Pokémon nuevos e introdujo la opción de cambiar la estación en los juegos.",
    "Gyarados es conocido por su drástica evolución de Magikarp y su aspecto feroz.",
    "Los juegos de Pokémon suelen incluir Pokémon exclusivos de cada versión que los jugadores deben intercambiar para completar su Pokédex.",
    "La Bicicleta es un objeto común en los juegos de Pokémon que permite a los entrenadores moverse más rápido.",
    "Los Pokémon de tipo Eléctrico son conocidos por su capacidad para paralizar a sus oponentes con movimientos eléctricos.",
    "El Profesor Juniper es el profesor Pokémon de la región de Teselia y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo incluyen una Torre de Batalla o una instalación similar donde los entrenadores pueden desafiar a oponentes fuertes.",
    "Los movimientos de tipo Planta son efectivos contra los Pokémon de tipo Agua y Tierra.",
    "Los juegos de Pokémon suelen presentar un rival o amigo del jugador que también se convierte en un entrenador fuerte.",
    "La región de Kalos es conocida por su belleza y su sistema de Mega Evolución.",
    "Los movimientos de tipo Psíquico son efectivos contra los Pokémon de tipo Lucha y Veneno.",
    "El Profesor Kukui es el profesor Pokémon de la región de Alola y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo cuentan con una Torre Batalla o un lugar similar donde los entrenadores pueden luchar contra oponentes poderosos.",
    "Los movimientos de tipo Fuego son efectivos contra los Pokémon de tipo Planta y Acero.",
    "Los juegos de Pokémon suelen presentar un Campeón o Maestro Pokémon al final del juego que es el oponente final del jugador.",
    "La región de Galar es conocida por su sistema de estadios y combates de alto nivel.",
    "Los movimientos de tipo Agua son efectivos contra los Pokémon de tipo Fuego y Tierra.",
    "El Profesor Magnolia es el profesor Pokémon de la región de Galar y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo incluyen una Liga Pokémon que los entrenadores deben desafiar para convertirse en Campeones.",
    "Los movimientos de tipo Tierra son efectivos contra los Pokémon de tipo Electrico, Veneno y Roca.",
    "Los juegos de Pokémon suelen contar con un personaje rival o amigo que también se convierte en un entrenador fuerte.",
    "La región de Sinnoh es conocida por su mitología y la inclusión de la Distorsión Dimensonal.",
    "Los movimientos de tipo Lucha son efectivos contra los Pokémon de tipo Normal, Acero, Hielo, Siniestro y Roca.",
    "El Profesor Elm es el profesor Pokémon de la región de Johto y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon suelen contar con una organización criminal, como el Equipo Rocket, que los entrenadores deben detener.",
    "Charmander es uno de los Pokémon iniciales de tipo fuego y evoluciona en Charizard.",
    "Los Pokémon Legendarios, como Articuno, Zapdos y Moltres, son difíciles de encontrar y atrapar en los juegos.",
    "El Profesor Birch es el profesor Pokémon de la región de Hoenn y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon suelen presentar una región ficticia basada en una ubicación del mundo real.",
    "Snorlax es conocido por bloquear el camino en los juegos y requiere una flauta especial para ser despertado.",
    "Los juegos de Pokémon suelen contar con una historia principal en la que el jugador debe detener los planes malvados de una organización criminal.",
    "El movimiento 'Surf' permite a los entrenadores viajar por el agua en los juegos de Pokémon.",
    "Brock es uno de los líderes de gimnasio en los juegos de Pokémon y es conocido por su especialización en Pokémon de tipo Roca.",
    "Los movimientos de tipo Hielo son efectivos contra los Pokémon de tipo Planta y Dragón.",
    "El Profesor Rowan es el profesor Pokémon de la región de Sinnoh y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo presentan un equipo de villanos que busca controlar a los Pokémon legendarios.",
    "La región de Unova es conocida por tener un alto número de Pokémon nuevos e introdujo la opción de cambiar la estación en los juegos.",
    "Gyarados es conocido por su drástica evolución de Magikarp y su aspecto feroz.",
    "Los juegos de Pokémon suelen incluir Pokémon exclusivos de cada versión que los jugadores deben intercambiar para completar su Pokédex.",
    "La Bicicleta es un objeto común en los juegos de Pokémon que permite a los entrenadores moverse más rápido.",
    "Los Pokémon de tipo Eléctrico son conocidos por su capacidad para paralizar a sus oponentes con movimientos eléctricos.",
    "El Profesor Juniper es el profesor Pokémon de la región de Teselia y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo incluyen una Torre de Batalla o una instalación similar donde los entrenadores pueden desafiar a oponentes fuertes.",
    "Los movimientos de tipo Planta son efectivos contra los Pokémon de tipo Agua y Tierra.",
    "Los juegos de Pokémon suelen presentar un rival o amigo del jugador que también se convierte en un entrenador fuerte.",
    "La región de Kalos es conocida por su belleza y su sistema de Mega Evolución.",
    "Los movimientos de tipo Psíquico son efectivos contra los Pokémon de tipo Lucha y Veneno.",
    "El Profesor Kukui es el profesor Pokémon de la región de Alola y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo cuentan con una Torre Batalla o un lugar similar donde los entrenadores pueden luchar contra oponentes poderosos.",
    "Los movimientos de tipo Fuego son efectivos contra los Pokémon de tipo Planta y Acero.",
    "Los juegos de Pokémon suelen presentar un Campeón o Maestro Pokémon al final del juego que es el oponente final del jugador.",
    "La región de Galar es conocida por su sistema de estadios y combates de alto nivel.",
    "Los movimientos de tipo Agua son efectivos contra los Pokémon de tipo Fuego y Tierra.",
    "El Profesor Magnolia es el profesor Pokémon de la región de Galar y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon suelen incluir Pokémon exclusivos de cada versión que los jugadores deben intercambiar para completar su Pokédex.",
    "La Bicicleta es un objeto común en los juegos de Pokémon que permite a los entrenadores moverse más rápido.",
    "Los Pokémon de tipo Eléctrico son conocidos por su capacidad para paralizar a sus oponentes con movimientos eléctricos.",
    "El Profesor Juniper es el profesor Pokémon de la región de Teselia y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo incluyen una Torre de Batalla o una instalación similar donde los entrenadores pueden desafiar a oponentes fuertes.",
    "Los movimientos de tipo Planta son efectivos contra los Pokémon de tipo Agua y Tierra.",
    "Los juegos de Pokémon suelen presentar un rival o amigo del jugador que también se convierte en un entrenador fuerte.",
    "La región de Kalos es conocida por su belleza y su sistema de Mega Evolución.",
    "Los movimientos de tipo Psíquico son efectivos contra los Pokémon de tipo Lucha y Veneno.",
    "El Profesor Kukui es el profesor Pokémon de la región de Alola y ayuda a los entrenadores a comenzar su viaje.",
    "Los juegos de Pokémon a menudo cuentan con una Torre Batalla o un lugar similar donde los entrenadores pueden luchar contra oponentes poderosos.",
    "Los movimientos de tipo Fuego son efectivos contra los Pokémon de tipo Planta y Acero.",
    "Los juegos de Pokémon suelen presentar un Campeón o Maestro Pokémon al final del juego que es el oponente final del jugador.",
    "La región de Galar es conocida por su sistema de estadios y combates de alto nivel.",
    "Los movimientos de tipo Agua son efectivos contra los Pokémon de tipo Fuego y Tierra.",
    "El Profesor Magnolia es el profesor Pokémon de la región de Galar y ayuda a los entrenadores a comenzar su viaje.",
];


    // Selecciona una curiosidad al azar
    const curiosidadAleatoria = curiosidades[Math.floor(Math.random() * curiosidades.length)];

    // Muestra la curiosidad en un alert
    swal("Curiosidad Pokémon", curiosidadAleatoria);
}

// Llama a la función para mostrar la curiosidad cada hora (3600000 milisegundos)
setInterval(mostrarCuriosidadPokemon, 3600000);

// Ejecuta la función después de 10 segundos (10000 milisegundos)
setTimeout(mostrarCuriosidadPokemon, 10000);

// Llama a cargarPokemonDesdeAPI al inicio para obtener los Pokémon desde la API
cargarPokemonDesdeAPI();
