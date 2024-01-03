const API_KEY = 'h%2BP%2FXV%2FH65yFRs1Bb%2BWkv1sZw1%2BwnZWTB9k7NG1PzqnBPV%2B9OZonjBd8DhA7OJGXCFJ%2BdArTI1tgf8GBAUp8UA%3D%3D';
const date = new Date();
const year = date.getFullYear();
let month = date.getMonth();
let day = date.getDate();
let TODAY_KEY = `${year}${String(month + 1).padStart(2, 0)}${String(day).padStart(2, 0)}`;
console.log(TODAY_KEY);
let BASE_TIME_KEY;


if (date.getHours() >= 2 && date.getHours() < 5) {
    BASE_TIME_KEY = "0200"
} else if (date.getHours() >= 5 && date.getHours() < 8) {
    BASE_TIME_KEY = "0500"
} else if (date.getHours() >= 8 && date.getHours() < 11) {
    BASE_TIME_KEY = "0800"
} else if (date.getHours() >= 11 && date.getHours() < 14) {
    BASE_TIME_KEY = "1100"
} else if (date.getHours() >= 14 && date.getHours() < 17) {
    BASE_TIME_KEY = "1400"
} else if (date.getHours() >= 17 && date.getHours() < 20) {
    BASE_TIME_KEY = "1700"
} else if (date.getHours() >= 20 && date.getHours() < 23) {
    BASE_TIME_KEY = "2000"
} else if (date.getHours() >= 23) {
    BASE_TIME_KEY = "2300"
} else {
    TODAY_KEY = `${year}${String(month + 1).padStart(2, 0)}${String(day - 1).padStart(2, 0)}`;
    console.log(TODAY_KEY);
    BASE_TIME_KEY = "2300"
}
console.log(BASE_TIME_KEY);


function weather(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const rs = dfs_xy_conv("toXY", `${lat}`, `${lng}`);
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY}&numOfRows=12&pageNo=1&dataType=JSON&base_date=${TODAY_KEY}&base_time=${BASE_TIME_KEY}&nx=${rs.x}&ny=${rs.y}`

    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data));

    const displayWeather = (data) => {
        const weatherInfo = document.querySelector("#weather-info");
        const weatherDate = document.querySelector("#weather-date");
        const tmpInfo = document.querySelector("#tmp-container");

        const temperature = data.response.body.items.item.find(item => item.category === "TMP").fcstValue;
        const skyStatus = data.response.body.items.item.find(item => item.category === "SKY").fcstValue;
        const rainDrop = data.response.body.items.item.find(item => item.category === "POP").fcstValue;
        const REH = data.response.body.items.item.find(item => item.category === "REH").fcstValue;
        const PTY = data.response.body.items.item.find(item => item.category === "PTY").fcstValue;

        const viewDate = TODAY_KEY;
        const viewTime = BASE_TIME_KEY;

        weatherInfo.innerHTML = `
            <div id = sky-container><span>SKY</span> <span id = SKY> ${getSkyStatus(skyStatus)}</span></div>
            <div id = pop-container><span>POP</span> <span id = POP> ${rainDrop}%</span></div>
            <div id = hum-container><span>HUM</span> <span id = REH> ${REH}%</span></div>
            <div id = pty-container><span>PTY</span> <span id = PTY> ${getPTY(PTY)}</span></div>
        `
        tmpInfo.innerHTML = `
            <div id = tmp>
                <div id = "TMP"> ${temperature}°C</div>
                <img id="weather-icon">
            </div>
        `
        const weatherIcon = document.querySelector("#weather-icon");
        // weatherDate.innerHTML = `
        //     <span>관측날짜: ${viewDate} 관측시간: ${viewTime}</span>
        // `

        if (skyStatus === "1" && PTY === "0") {
            document.body.classList.add("sunny");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/2698/2698194.png";
        } else if (skyStatus === "2" && PTY === "0") {
            document.body.classList.add("little-cloud");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/9361/9361644.png";
        } else if (skyStatus === "3" && PTY === "0") {
            document.body.classList.add("more-cloud");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/9969/9969843.png";
        } else if (skyStatus === "4" && PTY === "0") {
            document.body.classList.add("cloudy");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/3313/3313983.png";
        } else if (PTY === "1") {
            document.body.classList.add("rain");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/1146/1146858.png";
        } else if (PTY === "2") {
            document.body.classList.add("rain-snow");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/1779/1779887.png";
        } else if (PTY === "3") {
            document.body.classList.add("snow");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/642/642000.png";
        } else if (PTY === "4") {
            document.body.classList.add("rain-drop");
            weatherIcon.src = "https://cdn-icons-png.flaticon.com/128/3236/3236860.png";
        } else {
            document.body.classList.add("weather-default");
        }
    }
}

const getSkyStatus = (code) => {
    switch (code) {
        case "1": return "맑음";
        case "2": return "구름조금";
        case "3": return "구름많음";
        case "4": return "흐림";
        default: return "알 수 없음";
    }
}
const getPTY = (code) => {
    switch (code) {
        case "0": return "없음";
        case "1": return "비";
        case "2": return "비/눈";
        case "3": return "눈";
        case "4": return "소나기";
        default: return "알 수 없음";
    }
}


function weatherError() {
    alert("현재 사용자의 위치 정보를 가져오지 못했습니다.");
}





navigator.geolocation.getCurrentPosition(weather, weatherError);





















// items가 없거나 비어있으면 에러 방지를 위해 처리
//     const items = data && data.response && data.response.body && data.response.body.items && data.response.body.items.item;
//     if (items) {
//         const temperature = items.find(item => item.category === "TMP").fcstValue;
//         const skyStatus = items.find(item => item.category === "SKY").fcstValue;
//         const weather = document.querySelector("#weather-info");
//         weather.innerHTML = `
//             <p>온도: ${temperature}°C</p>
//             <p>하늘상태: ${skyStatus}</p>
//         `;
//     } else {
//         console.error("No weather information available");
//     }
// })
// .catch(error => {
//     console.error("Error fetching weather data:", error);
// }));