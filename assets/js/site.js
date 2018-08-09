/*
    Site wide javascript for the Thorelore.github.io website
*/

//local vars
let currentTime = new Date();
let currentTimeDiv = document.getElementById("current_time");


currentTimeDiv.innerText = currentTime.toLocaleTimeString();