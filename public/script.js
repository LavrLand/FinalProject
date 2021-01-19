document.addEventListener('DOMContentLoaded',()=>{

const textArea=document.querySelector('.search-block>.text');
const submitBtn=document.querySelector('.search-block>.btn');
const answerContainer=document.querySelector('.container');

const currentLocation=document.querySelector('.widgetLocation');

const currencyContainer=document.querySelector('.widget>.wrap');


//загрузка просмотренных городов из LocalStorage
if(localStorage.length>0){
    loadCity();
}
function loadCity(){
    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        getWeather(localStorage.getItem(key));
      }
}


//поиск погоды, плюс добавление данных в LocalStorage
let id=0;
submitBtn.addEventListener('click',function(){
   let cityForSearch=textArea.value;
   textArea.value='';
   getWeather(cityForSearch,id++);
     localStorage.setItem(id++, cityForSearch)
})


    function getWeather(cityName,id){

        let strRequest='http://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid=c4ecaf46d9687ed18d60681ab359b68f&units=metric';
        let xhttp=new XMLHttpRequest();
        xhttp.open('GET',strRequest,true);
        xhttp.send();
        xhttp.addEventListener('readystatechange',function(){
            if(xhttp.readyState === 4 && xhttp.status===200){
                let currObj=JSON.parse(xhttp.response);


    //добавляю инфу пришедшую с запроса
    answerContainer.innerHTML += '<div class="item" data-attr='+id+'>'+ `<p class='name'>${currObj.name}</p>`+`<div class="icon" style:""></div>`+
    `<p class='temp'>${Math.round(currObj.main.temp)}°C</p>`+
    `<p class='feels'>Feels like ${Math.round(currObj.main.feels_like)}°C</p>`+
    `<p>Min: ${Math.round(currObj.main.temp_min)}°C</p>`+
    `<p> Max: ${Math.round(currObj.main.temp_max)}°C</p>`+'</div>';

           let itemIcon= answerContainer.childNodes[answerContainer.childNodes.length-1].querySelector('.icon');
           let iconCode=currObj.weather[0].icon;
           itemIcon.style.backgroundImage='url(http://openweathermap.org/img/wn/'+iconCode+'@2x.png)';
           
           let items = document.querySelectorAll('.item');
           removeCity(items);
            }
        })
    }

//удаление города по клику
 function removeCity(items){
     let strBtn='<button class="remove"></button>';
    for(let item of items) {
        if(!item.firstChild.classList.contains('remove')){
        item.insertAdjacentHTML("afterbegin",  strBtn);
        }
         // кнопка становится первым потомком
         item.firstChild.onclick = () => item.remove();
       }
 }  


//виджет с геолокацией
let success = (position) => {
    const lat  = position.coords.latitude;
    const lon = position.coords.longitude;
    let strRequest='https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid=e50ec27dac6fac01c3d6889743f8b9d5&units=metric';
    let promise = fetch(strRequest);
    promise
        .then((currObj => {
            if (currObj.ok && currObj.status === 200) {
                return currObj.json();
            } else {
                return Promise.reject(currObj.status);
            }}))
        .then(currObj => currentLocation.innerHTML+=`<p class='name'>${currObj.name}</p>`+`<div class="icon" style="background-image:url(http://openweathermap.org/img/wn/${currObj.weather[0].icon}@2x.png)"></div>`+
        `<p class='temp'>${Math.round(currObj.main.temp)}°C</p>`+
        `<p class='feels'>Feels like ${Math.round(currObj.main.feels_like)}°C</p>`+
        `<p>Min: ${Math.round(currObj.main.temp_min)}°C</p>`+
        `<p> Max: ${Math.round(currObj.main.temp_max)}°C</p>`+'</div>'
               );
}

let error = () => {
    currentLocation.parentNode.removeChild(currentLocation);
}
navigator.geolocation.getCurrentPosition(success, error);


//запрос о получении данных с курсом валют
function getCurrency(){
    let xhttp=new XMLHttpRequest();
    xhttp.open('GET', 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',true);
    xhttp.send();
    xhttp.addEventListener('readystatechange',function(){
        if(xhttp.readyState === 4 && xhttp.status===200){
            let currObj=JSON.parse(xhttp.response);
//очищаю контейнер с информацией
            currencyContainer.innerHTML='';
//добавляю инфу пришедшую с запроса
            currencyContainer.innerHTML += '<p>Purchase</p>';
            currencyContainer.innerHTML += '<p>Sale</p>';
            currencyContainer.innerHTML += '<p>USD <span>UAH</span></p>';
            currencyContainer.innerHTML += `<p>${currObj[0].buy}</p>`;
            currencyContainer.innerHTML += `<p>${currObj[0].sale}</p>`;
            currencyContainer.innerHTML += '<p>EUR <span>UAH</span></p>';
            currencyContainer.innerHTML += `<p>${currObj[1].buy}</p>`;
            currencyContainer.innerHTML += `<p>${currObj[1].sale}</p>`;
            currencyContainer.innerHTML += '<p>RUB <span>UAH</span></p>';
            currencyContainer.innerHTML += `<p>${currObj[2].buy}</p>`;
            currencyContainer.innerHTML += `<p>${currObj[2].sale}</p>`;
        }
    })
}
//обновляю инфу по курсу валют каждый час
if(currencyContainer){
    getCurrency();
    function timeout() {
        setTimeout(function () {
            getCurrency();
            timeout();
        }, 1000 * 60 * 60);
    }
    timeout();
}

})
