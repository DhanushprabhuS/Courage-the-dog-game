console.log("I am Dhanush Prabhu S - feel free to contact me via mail dhanushprabhusenthil@gmail.com");
console.log("Help Courage to defend his owners from a evil checken from outer space");

const blocks = document.querySelectorAll(".hole img");
blocks.forEach((block) => {
    block.addEventListener("click", function(e) {
        e.srcElement.setAttribute("hidden", "");
        setTimeout(() => { e.srcElement.removeAttribute("hidden") }, 300)
    });
})

const holeDiv = document.querySelector(".container-holes");
const cursor = document.querySelector(".hammer-wood");
const timmer = document.getElementById("timmer");
let currentTime;

function followCursor(e) {
    cursor.style.top = e.clientY + window.scrollY + "px";
    cursor.style.left = e.clientX + "px";
}

const whackSound = new Audio("./sounds/whack.mp3");
var isSound = true;
document.getElementById("soundText").innerHTML = "MUTE";
const soundButton = document.getElementById("sound");
soundButton.addEventListener("click", (e) => {
    document.getElementById("soundText").innerHTML = isSound ? "UNMUTE" : "MUTE";
    isSound = !isSound;
})

function hit() {
    cursor.classList.add("hit");
    if (isSound) whackSound.play();
    setTimeout(() => {
        cursor.classList.remove("hit");
        //whackSound.currentTime = 0;
    }, 100);
}
holeDiv.addEventListener("mousemove", followCursor);
holeDiv.addEventListener("click", hit)

const holes = document.querySelectorAll(".hole");

let hitPosition = [];

function randomSquare() {
    holes.forEach((hole) => {
        hole.classList.remove("duck");
    });
    hitPosition = [];
    let randomSquare = holes[Math.floor(Math.random() * 9)];
    randomSquare.classList.add("duck");
    hitPosition.push(randomSquare.id);
}
let timerId = null;

function moveDuck() {
    timerId = setInterval(randomSquare, isEasy ? 800 : 400);
}


let result = 0;
let score = document.getElementById("score")
holes.forEach((square) => {
    square.addEventListener("mousedown", (e) => {
        const quack = new Audio('./sounds/Quack.mp3')
        if (hitPosition.includes(square.id)) {
            if (isSound) quack.play();
            result++;
            score.textContent = result;
            hitPosition = [];
        }
    });
});

const ending = new Audio("./sounds/ending.mp3");

function countDown() {
    currentTime--;
    timmer.textContent = currentTime;
    if (isSound) startAudio.play();
    if (!isSound) startAudio.pause();
    startAudio.loop = true;

    if (currentTime <= 0) {
        startAudio.pause();

        if (isSound) ending.play();
        ending.loop = true
        clearInterval(countDownTimerId);
        clearInterval(timerId);
        holes.forEach((hole) => {
            hole.classList.remove("duck");
        });
        document.getElementById("final-score").innerHTML = result;
        let setEvent = setInterval(() => {
            play.addEventListener("click", startGame);
        }, 10);
        document.querySelector(".game-over").style.display = "block";
        fetch(getUserURL)
            .then(data => {
                return data.json();
            })
            .then(data => {
                playersData = data;
                playersData.sort((a, b) => b.score - a.score);
                setupRank(playersData);
            });
    }
}

let countDownTimerId;
const startAudio = new Audio("./sounds/crisis-courage.mp3");
const mode = document.getElementById("mode");
var isEasy = true;
mode.addEventListener("click", () => {
    isEasy = !isEasy;
    mode.innerHTML = isEasy ? "EASY" : "HARD";
})



function startGame() {
    document.getElementById("final-score").innerHTML = 0;
    ending.pause();
    result = 0;
    score.textContent = result;
    hitPosition = [];
    currentTime = isEasy ? 60 : 90;
    timmer.textContent = currentTime;
    countDownTimerId = setInterval(countDown, 1000);
    moveDuck();
    play.removeEventListener("click", startGame);
}
const play = document.getElementById("play");
play.addEventListener("click", startGame);

document.getElementById('close').addEventListener("click", (e) => {
    document.querySelector(".game-over").style.display = "none";
    submit.addEventListener('click', submitAction);
    submit.classList.remove('disabled');
});

const submit = document.querySelector("button");
var playersData = [];
const addUserURL = 'https://script.google.com/macros/s/AKfycbyTV7koyydw9GMp9uDJzSTnFPGqk4jRaekKlcQPnjwkpRq3XK9iIbWsJfxCwp_c-U8L/exec?action=addUser';
const getUserURL = 'https://script.google.com/macros/s/AKfycbyTV7koyydw9GMp9uDJzSTnFPGqk4jRaekKlcQPnjwkpRq3XK9iIbWsJfxCwp_c-U8L/exec?action=getUser';


function setupRank(data) {
    let list1 = document.getElementById('top-5');
    let data1 = data.slice(1, 6);
    let content1 = ``;
    data1.forEach(data => content1 += `<li> <span class="scoreSpan">${data.score}</span> <span style="padding:10px">${data.name}</span></li>`);
    list1.innerHTML = content1;

    let list2 = document.getElementById('top-6-10');
    let data2 = data.slice(6, 11);
    let content2 = ``;
    data2.forEach(data => content2 += `<li> <span class="scoreSpan">${data.score}</span> <span style="padding:10px">${data.name}</span></li>`);
    list2.innerHTML = content2;
}


function submitAction(e) {
    e.preventDefault();
    if (document.querySelector("input").value.length && document.querySelector("input").value.length <= 10) {
        document.getElementById('warning').innerHTML = '';
        fetch(addUserURL, {
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify({ name: document.querySelector("input").value, score: result }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then((data) => {
                console.log("Success:", data);
                fetch(getUserURL)
                    .then(data => {
                        return data.json();
                    })
                    .then(data => {
                        playersData = data;
                        playersData.sort((a, b) => b.score - a.score);
                        setupRank(playersData);
                    });
                submit.removeEventListener('click', submitAction);
                submit.classList.add('disabled');
            })
            .catch((error) => {
                console.error("Error:", error);
            });


    } else {
        document.getElementById('warning').innerHTML = 'Please enter a valid name with only 10 chars';
    }
}


submit.addEventListener("click", submitAction);

fetch(getUserURL)
    .then(data => {
        return data.json();
    })
    .then(data => {
        playersData = data;
        playersData.sort((a, b) => b.score - a.score);
        setupRank(playersData);
    });