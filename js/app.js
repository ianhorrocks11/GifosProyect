/* -----  ----- */
/* ----- Search Section Elements ----- */

let input = document.getElementById("search-in");
let search_btn = document.getElementById("btn-search");
let suggest_list = document.getElementById("suggest-list");
let lupa_busqueda = document.getElementById("img-lupa");
let lupas_icon = document.getElementsByClassName("input-img");
let search_param;
let offset = 4;
// faltan las lupas

/* ----- Results Section Elements ----- */
let title = document.getElementById('title-results');
let results = document.getElementById('results');

let trending_list = document.getElementById('trending-list');
let btn_vermas = document.getElementById('btn-mas');



let resultsEl = document.getElementById("load-search")

/* ----- load suggestions ----- */
input.addEventListener('keyup', loadSuggestions());

async function loadSuggestions() {
    search_param = input.value;
    if (!!search_param) {
        let suggestionFinalPoint = `https://api.giphy.com/v1/tags/related/${search_param}?api_key=${apiKey}&limit=4&rating=g`;
        let suggestionSearch = await logFetch(suggestionFinalPoint);
        debugger
        console.log(suggestionSearch.data);
        if (suggestionSearch.data.length > 0) {
            let item_list = '';
            for (let i = 0; i < suggestionSearch.data.length; i++){
                item_list += `<li><img src="images/icon-search-gris.svg" alt="icon-search"/><p>${suggestionSearch.data[i].name}</p></li>`;
            }
            suggest_list.innerHTML = item_list;
            suggest_list.classList.remove('hidden');
            suggest_list.classList.add('suggest-list');
            lupa_busqueda.classList.add('img-lupa');
            lupa_busqueda.classList.remove('hidden');
            input.style.width = '80%';
            lupas_icon[0].style.display = 'none';
            lupas_icon[1].style.display = 'block'
        } else {
            restablecerBusqueda();
        }
    } else {
        restablecerBusqueda();
    }
}

/*----------------Trending Suggestions---------------*/
trending_list.addEventListener('click', (e) => {
    search_param = e.target.textContent;
    restablecerResultados();
    cargarBusqueda(search_param, offset);
    restablecerBusqueda();
})

async function cargarTrendingSugerencias() {
    let trendingFinalPointSugg = `https://api.giphy.com/v1/trending/searches?api_key=${apiKey}&limit=5&rating=g`;
    let trendingSuggestions = await logFetch(trendingFinalPointSugg);
    if (trendingSuggestions.data.length > 0) {
        let item_list = "";
        for (let i=0; i < 5; i++) {
            let items = `<li>${trendingSuggestions.data[i]}</li>`;
            item_list = item_list + items;
        }
        trending_list.innerHTML = item_list;
    }
}


/*----------------Gifs Search------------------------*/ 
//Click en la lupa del campo 
lupa_busqueda.addEventListener('click', () => {
    ejecutarBusqueda(input.value);
});

//Presionar tecla enter
input.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        ejecutarBusqueda(input.value);
    }
});

btn_vermas.addEventListener('click', () => {
    offset++;
    offset = offset + 12;
    cargarBusqueda(search_param, offset);
});

function ejecutarBusqueda(value) {
    restablecerResultados();
    search_param = value;
    cargarBusqueda(search_param, offset);
    restablecerBusqueda();
}

function restablecerResultados() {
    offset = 0;
    results.innerHTML = "";
}

function restablecerBusqueda() {
    input.value = "";
    suggest_list.innerHTML = "";
    suggest_list.classList.add('hidden');
    suggest_list.classList.remove('suggest-list');
    lupa_busqueda.classList.remove('img-lupa', 'hidden');
    lupa_busqueda.classList.add('hidden');
    input.style.width = '90%';
    lupas_icon[0].style.display = 'block';
}

/* ----- Request ----- */
let apiKey = "VR8AeqhAszSq7OQSaY7ql7g9zWZSOGAh";

async function logFetch(url) {
    return fetch(url)
        .then((data) => {
            return data.json();
        })
        .catch((err) => console.log(err.message));
};

async function cargarBusqueda(search_param, offset) {
    let searchEndPoint = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&limit=12&q=${search_param}&offset=${offset}`;
    let resultadosBusqueda = await logFetch(searchEndPoint);
    console.log(resultadosBusqueda.data.length);
    if (resultadosBusqueda.data.length > 0 ){
        for(let i = 0; i < resultadosBusqueda.data.length; i++) {
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.innerHTML = `<div class="card-opciones">
                                    <div class="opciones-gif">
                                        <button id="btn-favorito" class="opcion-button">
                                            <img src="images/icon-fav-hover.svg" alt="icono-busqueda">
                                        </button>
                                        <button id="btn-descargar" class="opcion-button">
                                            <img src="images/icon-download.svg" alt="icono-busqueda">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max.svg" alt="icono-busqueda">
                                        </button>
                                    </div>
                                    <div class="opciones-descripcion">
                                        <p class="descripcion user">${resultadosBusqueda.data[i].username}</p>
                                        <p class="descripcion titulo">${resultadosBusqueda.data[i].title}</p>
                                    </div>
                                </div>`;
            div.querySelector('#btn-favorito').addEventListener('click', () => {
                agregarFavoritos(resultadosBusqueda.data[i].id);
            });
            div.querySelector('#btn-max').addEventListener('click', () => {
                maximizarGif(resultadosBusqueda.data[i].id);
            });
            div.querySelector('#btn-descargar').addEventListener('click', () => {
                descargarGif(resultadosBusqueda.data[i].images.original.url);
            });
            div.addEventListener('touchstart', () => {
                maximizarGif(resultadosBusqueda.data[i].id);
            })
            img.srcset = `${resultadosBusqueda.data[i].images.downsized_large.url}`;
            img.alt = `${resultadosBusqueda.data[i].id}`;
            div.appendChild(img);
            results.appendChild(div);
            results.classList.remove('hidden');
        }
        title.innerHTML = `${search_param}`;
        title.classList.remove('hidden');
        btn_vermas.classList.remove('hidden');

    } else {
        results.classList.remove('results-gifs','hidden')
        //clase sin resultados
        title.innerHTML = 'Lorem Ipsum';
        let imagen = document.createElement('img');
        imagen.srcset = './images/icon-busqueda-sin-resultado.svg';
        //clase img sin resultados
        results.appendChild(imagen);
        let texto = document.createElement('h3');
        texto.innerHTML = "Intenta con otra búsqueda";
        //clase texto sin resultados
    }

} 



/* fetch(apiUrl).then(function(res) {
    return res.json()
}).then(function(json) {
    let resultsHTML = '';

    json.data.forEach((obj) => {

        const url = obj.images.fixed_width.url;
        const width = obj.images.fixed_width.width
        const height = obj.images.fixed_width.height
        const title = obj.title

        resultsHTML += `<img src="${url}" width="${width}" height="${height}" alt="${title}"> `
    })
    resultsEl.innerHTML = resultsHTML

}).catch(function(err) {
    console.log(err.message)
}) */
