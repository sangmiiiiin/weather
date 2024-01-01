function getKakaoAddress(x, y) {
    const REST_API_KEY = '88af356eb4979f49cb0e4ad999e8be7b';
  
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}&input_coord=WGS84`;
  
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
  
  console.log(getKakaoAddress(61, 127));