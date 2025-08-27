// ELEMENTOS
const valuesearch = document.getElementById('valuesearch');
const city = document.getElementById('city');
const temp = document.getElementById('temp');
const description = document.querySelector('.description');
const form = document.querySelector('form'); 
const body = document.body;
const mainEl = document.querySelector('main');
const starsContainer = document.getElementById("stars-bg");

// CONSTANTES
const id = '12f4203c1d5dd95d168e48f1b6b710ed';
const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${id}`;
const numStars = 16;

// EVENTO DO FORM
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if(valuesearch.value.trim() !== ''){
        searchWeather();
    }
});

// FUNÇÃO PRINCIPAL DE BUSCA
function searchWeather() {
    fetch(`${url}&q=${valuesearch.value}`)
        .then(res => res.json())
        .then(data => {
            if(data.cod !== 200) return;

            showResultsElements();
            updateWeatherInfo(data);
            updateBackground(data);
            updateWeatherImage(data);
            updateLocalTime(data);

            valuesearch.value = '';
        });
}

// MOSTRA ELEMENTOS APÓS BUSCA
function showResultsElements() {
    document.getElementById('initialMessage').style.display = 'none';
    temp.style.display = 'block';
    city.style.display = 'block';
    document.getElementById('time').style.display = 'block';
    description.style.display = 'block';
}

// ATUALIZA CIDADE, TEMPERATURA E DESCRIÇÃO
function updateWeatherInfo(data) {
    city.querySelector('figcaption').innerText = data.name;
    temp.querySelector('figcaption span').innerText = Math.round(data.main.temp);
    description.innerText = data.weather[0].description;
}

// ATUALIZA FUNDO E CARD DEPENDENDO DO DIA/NOITE
function updateBackground(data) {
    const isNight = data.weather[0].icon.includes("n");

    body.style.backgroundColor = isNight ? "#5673A2" : "#E4DAFF";
    mainEl.style.backgroundColor = isNight ? "#E4DAFF" : "#C5EBF0";
}

// ATUALIZA IMAGEM DO CLIMA
function updateWeatherImage(data) {
    const weatherMain = data.weather[0].main.toLowerCase();
    const descriptionText = data.weather[0].description.toLowerCase();
    const img = temp.querySelector('img');
    const isNight = data.weather[0].icon.includes("n");

    if(weatherMain.includes("clear")){
        img.src = isNight ? "img/lua.png" : "img/sol.png";
        img.alt = isNight ? "Lua" : "Sol";
    } else if(weatherMain.includes("clouds")){
        img.src = isNight ? "img/nuvemnoite.png" : "img/nuvem.png";
        img.alt = isNight ? "Lua com nuvens" : "Nuvens";
    } else if(weatherMain.includes("rain")){
        if(descriptionText.includes("heavy") || descriptionText.includes("strong")){
            img.src = isNight ? "img/chuvalua.png" : "img/chuva.png";
            img.alt = "Chuva forte";
        } else {
            img.src = isNight ? "img/chuvalua.png" : "img/chuvisco.png";
            img.alt = "Chuva fraca";
        }
    } else if(weatherMain.includes("thunderstorm")){
        img.src = isNight ? "img/tempestadenoite.png" : "img/tempestade.png";
        img.alt = "Tempestade";
    } else if(weatherMain.includes("snow")){
        img.src = isNight ? "img/luaneve.png" : "img/neve.png";
        img.alt = "Neve";
    } else {
        img.src = "img/default.png";
        img.alt = "Clima desconhecido";
    }
}

// ATUALIZA HORA LOCAL
function updateLocalTime(data) {
    const timezoneOffset = data.timezone;

    function updateTime() {
        const now = new Date(Date.now() + timezoneOffset * 1000);
        const hours = now.getUTCHours().toString().padStart(2,'0');
        const minutes = now.getUTCMinutes().toString().padStart(2,'0');
        document.getElementById('time').innerText = `${hours}:${minutes}`;
    }

    updateTime();
    setInterval(updateTime, 60000);
}

// ESTRELAS ANIMADAS
function createStars() {
    const { innerWidth, innerHeight } = window;

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement("div");
        star.classList.add("star");

        const size = 30 + Math.random() * 50;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        const spinDuration = 3 + Math.random() * 6;
        star.style.animationDuration = `${spinDuration}s`;

        let x = Math.random() * innerWidth;
        let y = Math.random() * innerHeight;
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        starsContainer.appendChild(star);

        function moveStar() {
            const newX = Math.random() * innerWidth;
            const newY = Math.random() * innerHeight;

            star.animate(
                [
                    { left: `${x}px`, top: `${y}px` },
                    { left: `${newX}px`, top: `${newY}px` }
                ],
                {
                    duration: 8000 + Math.random() * 5000,
                    fill: "forwards",
                    easing: "ease-in-out"
                }
            );

            x = newX;
            y = newY;

            setTimeout(moveStar, 8000 + Math.random() * 5000);
        }

        moveStar();
    }
}

// INICIALIZA ESTRELAS
createStars();
