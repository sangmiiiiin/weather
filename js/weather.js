const API_KEY = 'h%2BP%2FXV%2FH65yFRs1Bb%2BWkv1sZw1%2BwnZWTB9k7NG1PzqnBPV%2B9OZonjBd8DhA7OJGXCFJ%2BdArTI1tgf8GBAUp8UA%3D%3D';
const date = new Date();
const TODAY_KEY = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
console.log(date.getHours());
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
    BASE_TIME_KEY = "2300"
}
console.log(BASE_TIME_KEY);

function weather(position) {
    const lat = Math.floor(position.coords.latitude);
    const lng = Math.floor(position.coords.longitude);
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY}&numOfRows=12&pageNo=1&dataType=JSON&base_date=${TODAY_KEY}&base_time=${BASE_TIME_KEY}&nx=${lat}&ny=${lng}`

    fetch(url)
        .then(response => response.json())
        .then(data => displayWeather(data));

    const displayWeather = (data) => {
        const weatherInfo = document.querySelector("#weather-info");

        const temperature = data.response.body.items.item.find(item => item.category === "TMP").fcstValue;
        const skyStatus = data.response.body.items.item.find(item => item.category === "SKY").fcstValue;
        const rainDrop = data.response.body.items.item.find(item => item.category === "POP").fcstValue;
        const REH = data.response.body.items.item.find(item => item.category === "REH").fcstValue;
        const PTY = data.response.body.items.item.find(item => item.category === "PTY").fcstValue;


        weatherInfo.innerHTML = `
            <p>온도: ${temperature}°C</p>
            <p>하늘상태: ${getSkyStatus(skyStatus)}</p>
            <p>강수확률: ${rainDrop}%</p>
            <p>습도: ${REH}%</p>
            <p>강수형태: ${getPTY(PTY)}</p>
        `
    }

    const getSkyStatus = (code) => {
        switch(code) {
            case "1": return "맑음";
            case "2": return "구름조금";
            case "3": return "구름많음";
            case "4": return "흐림";
            default: return "알 수 없음";
        }
    }
    const getPTY = (code) => {
        switch(code) {
            case "0": return "없음";
            case "1": return "비";
            case "2": return "비/눈";
            case "3": return "눈";
            case "4": return "소나기";
            default: return "알 수 없음";
        }
    }
}
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














// function displayWeather(data) {
//     const weatherInfo = document.querySelector("#weather-info");

//     // 데이터에서 필요한 부분을 추출
//     const temperature = data.items.item.find(item => item.category === "TMP").fcstValue;
//     const windSpeed = data.items.item.find(item => item.category === "WSD").fcstValue;
//     const skyStatus = data.items.item.find(item => item.category === "SKY").fcstValue;
//     const precipitationType = data.items.item.find(item => item.category === "PTY").fcstValue;
//     const precipitationProbability = data.items.item.find(item => item.category === "POP").fcstValue;
//     const humidity = data.items.item.find(item => item.category === "REH").fcstValue;

//     // 화면에 표시
//     weatherInfo.innerHTML = `
//       <p>온도: ${temperature}°C</p>
//       <p>풍속: ${windSpeed} m/s</p>
//       <p>하늘 상태: ${getSkyStatus(skyStatus)}</p>
//       <p>강수 형태: ${getPrecipitationType(precipitationType)}</p>
//       <p>강수 확률: ${precipitationProbability}%</p>
//       <p>습도: ${humidity}%</p>
//     `;
//   }

//   // 하늘 상태 코드를 해석하는 함수
//   function getSkyStatus(code) {
//     switch (code) {
//       case "1": return "맑음";
//       case "2": return "구름 조금";
//       case "3": return "구름 많음";
//       case "4": return "흐림";
//       default: return "알 수 없음";
//     }
//   }

//   // 강수 형태 코드를 해석하는 함수
//   function getPrecipitationType(code) {
//     switch (code) {
//       case "0": return "없음";
//       case "1": return "비";
//       case "2": return "비/눈";
//       case "3": return "눈";
//       case "4": return "소나기";
//       default: return "알 수 없음";
//     }
//   }

//   // ...

//   fetch(url)
//     .then(response => response.json())
//     .then(data => displayWeather(data));


function weatherError() {
    alert("현재 사용자의 위치 정보를 가져오지 못했습니다.");
}



navigator.geolocation.getCurrentPosition(weather, weatherError);
