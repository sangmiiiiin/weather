const clock = document.querySelector("#clock");

const getTime = () => {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const seconds = date.getSeconds();
    clock.innerText = `${String(hour).padStart(2, '0')} : ${String(minute).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
}

getTime();
setInterval(getTime, 1000);



