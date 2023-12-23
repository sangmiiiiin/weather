const API_KEY = 'h%2BP%2FXV%2FH65yFRs1Bb%2BWkv1sZw1%2BwnZWTB9k7NG1PzqnBPV%2B9OZonjBd8DhA7OJGXCFJ%2BdArTI1tgf8GBAUp8UA%3D%3D'
const date = new Date();
const TODAY_KEY = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate() - 1}`;

function weather(position) {
    const lat = Math.floor(position.coords.latitude);
    const lng = Math.floor(position.coords.longitude);
    const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${API_KEY}&numOfRows=10&pageNo=1&dataType=JSON&base_date=${TODAY_KEY}&base_time=1700&nx=${lat}&ny=${lng}`

    fetch(url)
        .then(response => response.json()
            .then(data => {
                // items가 없거나 비어있으면 에러 방지를 위해 처리
                const items = data && data.response && data.response.body && data.response.body.items && data.response.body.items.item;
                if (items) {
                    const temperature = items.find(item => item.category === "TMP").fcstValue;
                    console.log("Temperature:", temperature);
                    const weather = document.querySelector("#weather-info");
                    weather.innerText = `온도: ${temperature}`;
                    if(temperature >= 0) {
                        weather.classList.add("plus-degree");
                        const tmpEmoji = document.createElement("span");
                        weather.appendChild(tmpEmoji);
                        tmpEmoji.innerText = "😌";
                    } else if (temperature < 0) {
                        weather.classList.add("minus-degree");
                        const tmpEmoji = document.createElement("span");
                        weather.appendChild(tmpEmoji);
                        tmpEmoji.innerText = "🥶";
                    }

                    // 여기에서 다른 날씨 정보를 처리할 수 있습니다.
                } else {
                    console.error("No weather information available");
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            }));
        }
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
