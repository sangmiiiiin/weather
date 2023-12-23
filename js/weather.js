const API_KEY = 'h%2BP%2FXV%2FH65yFRs1Bb%2BWkv1sZw1%2BwnZWTB9k7NG1PzqnBPV%2B9OZonjBd8DhA7OJGXCFJ%2BdArTI1tgf8GBAUp8UA%3D%3D'
const date = new Date();
const TODAY_KEY = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`;
console.log(TODAY_KEY);

function weather(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    console.log(lat, lng);
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${TODAY_KEY}&base_time=1700&nx=37&ny=127`

    console.log(url);
    fetch(url)
        .then(response => response.json()
        .then(data => {
            console.log(data);
        }));
}
function weatherError () {
    alert("현재 사용자의 위치 정보를 가져오지 못했습니다.");
}

navigator.geolocation.getCurrentPosition(weather, weatherError);
