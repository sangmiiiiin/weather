const API_KEY = 'h%2BP%2FXV%2FH65yFRs1Bb%2BWkv1sZw1%2BwnZWTB9k7NG1PzqnBPV%2B9OZonjBd8DhA7OJGXCFJ%2BdArTI1tgf8GBAUp8UA%3D%3D';
const date = new Date();
const year = date.getFullYear();
let month = date.getMonth();
let day = date.getDate();
let TODAY_KEY = `${year}${String(month + 1).padStart(2, 0)}${String(day).padStart(2, 0)}`;
let BASE_TIME_KEY;
var RE = 6371.00877; // 지구 반경(km)
var GRID = 5.0; // 격자 간격(km)
var SLAT1 = 30.0; // 투영 위도1(degree)
var SLAT2 = 60.0; // 투영 위도2(degree)
var OLON = 126.0; // 기준점 경도(degree)
var OLAT = 38.0; // 기준점 위도(degree)
var XO = 43; // 기준점 X좌표(GRID)
var YO = 136; // 기1준점 Y좌표(GRID)
//
// LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
//

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
    TODAY_KEY = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate() - 1}`;
    BASE_TIME_KEY = "2300"
}

function dfs_xy_conv(code, v1, v2) {    // 위도 경도를 좌표로 변환하는 함수
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;

    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;

    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['x'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['y'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['x'] = v1;
        rs['y'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}
//-->

function weather(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const rs = dfs_xy_conv("toXY", `${lat}`, `${lng}`);
    console.log(rs.x, rs.y);
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