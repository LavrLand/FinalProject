document.addEventListener('DOMContentLoaded',()=>{
    const div=document.querySelector('.widget>.wrap');
    const arr=div.childNodes;

function getData(){
    let xhttp=new XMLHttpRequest();
    xhttp.open('GET', 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',true);
    xhttp.send();
    xhttp.addEventListener('readystatechange',function(){
        if(xhttp.readyState === 4 && xhttp.status===200){
            let currObj=JSON.parse(xhttp.response);
//очищаю контейнер с информацией
            div.innerHTML='';
//добавляю инфу пришедшую с запроса
            div.innerHTML += '<p>Purchase</p>';
            div.innerHTML += '<p>Sale</p>';
            div.innerHTML += '<p>USD <span>UAH</span></p>';
            div.innerHTML += `<p>${currObj[0].buy}</p>`;
            div.innerHTML += `<p>${currObj[0].sale}</p>`;
            div.innerHTML += '<p>EUR <span>UAH</span></p>';
            div.innerHTML += `<p>${currObj[1].buy}</p>`;
            div.innerHTML += `<p>${currObj[1].sale}</p>`;
            div.innerHTML += '<p>RUB <span>UAH</span></p>';
            div.innerHTML += `<p>${currObj[2].buy}</p>`;
            div.innerHTML += `<p>${currObj[2].sale}</p>`;
        }
    })
}
function getWeather(cityName){
    cityName='Dnipro';
let strRequest='http://api.openweathermap.org/data/2.5/weather?q='+cityName+'&appid=c4ecaf46d9687ed18d60681ab359b68f';
    let xhttp=new XMLHttpRequest();
    xhttp.open('GET',strRequest,true);
    xhttp.send();
    xhttp.addEventListener('readystatechange',function(){
        if(xhttp.readyState === 4 && xhttp.status===200){
            let currObj=JSON.parse(xhttp.response);
console.log(currObj);
        }
    })
}
getWeather();
if(div){
    getData();
    function timeout() {
        setTimeout(function () {
            getData();
            timeout();
        }, 1000 * 60 * 60);
    }
    timeout();
}

})
