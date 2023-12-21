var xhr = new XMLHttpRequest();
var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst'; /*URL*/
var queryParams = '?' + encodeURIComponent('serviceKey') + '='+'h%2BP%2FXV%2FH65yFRs1Bb%2BWkv1sZw1%2BwnZWTB9k7NG1PzqnBPV%2B9OZonjBd8DhA7OJGXCFJ%2BdArTI1tgf8GBAUp8UA%3D%3D'; /*Service Key*/
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /**/
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /**/
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML'); /**/
queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent('20231221'); /**/
queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('1700'); /**/
queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('62'); /**/
queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('127'); /**/
xhr.open('GET', url + queryParams);
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        // console.log('Status: '+this.status+'nHeaders: '+JSON.stringify(this.getAllResponseHeaders())+'nBody: '+this.responseText);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.responseText, 'text/xml');
        console.log(xmlDoc);
        const skyItem = xmlDoc.querySelector('item category:contains("SKY")').closest('item');
        const fcstValue = skyItem.querySelector('fcstValue').textContent;
        console.log(fcstValue);
    }
};

xhr.send('');




