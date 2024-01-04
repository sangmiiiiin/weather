const REST_API_KEY = '1f33e3158412b3d4490fb8a689883964';

function transcoord(x, y) {
    const url = `https://dapi.kakao.com/v2/local/geo/transcoord.json?appkey=${REST_API_KEY}&x=${x}&y=${y}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `KakaoAK ${REST_API_KEY}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        if(data.documents && data.documents.length > 0) {
            let x = data.documents[0].x;
            let y = data.documents[0].y;
            toAddress(x, y);
        }
    })
}


function toAddress(x, y) {

const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`;

    return fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `KakaoAK ${REST_API_KEY}`,
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.documents && data.documents.length > 0) {
          const address = data.documents[0].address;
          return `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`;
        } else {
          return '주소를 찾을 수 없습니다.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        return '주소 변환 중 오류가 발생했습니다.';
      });
    }

// 카카오 API 좌표로 행정구역 알아내기 실패