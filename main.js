var nPage = 0;
var nPart = 0;

var matrix = [
    // part 0
    [{
            // opening game question- page 1
            divName: ["opening"],
            functions: [`pop_buttons(document.querySelector(".odot-logo"), "0", "1")`, ]
        },
        {
            // about- page 1
            divName: ["about"],
            functions: ['pop_buttons(document.querySelector("#back-button-odot"), "0", "0")']
        }
    ],
    // part 1
    [{
            // instructions- page 0
            divName: ["instructions"], // the last div contains the speech bubble
            functions: [`pop_buttons(document.querySelector(".start-button"), "+0", "+1")`] // array of functions that are needed to the page. If the functions contain the word "pop", it will happen only once and will be popped out of the array afterwards
        },
        {
            // american questions- page 1
            divName: ["questions"], // the last div contains the speech bubble
            functions: [`arrMultipleQuestions = shuffle(DATA.questions);`, `addContentToQuestion()`] // array of functions that are needed to the page. If the functions contain the word "pop", it will happen only once and will be popped out of the array afterwards
        },
        {
            // game- page 2
            divName: ["mission"], // the last div contains the speech bubble
            functions: [`pop_eventListener(document.querySelector("#mission button"), 'click', activeShot)`, `pop_eventListener(document.querySelector("#mission .container"), 'mousemove', rotateShot)`, 'document.querySelector("#counter").innerHTML = `יריות: ${nMultipleCorrectAnswers}`;'] // array of functions that are needed to the page. If the functions contain the word "pop", it will happen only once and will be popped out of the array afterwards
        }
    ]
];

// code to open the mission
const coordinate_1 = "000";
const coordinate_2 = "000";

var dragX = 0,
    dragY = 0;
var w = window.innerWidth,
    h = window.innerHeight;
var angle = 0;

window.addEventListener('load', () => {
    document.querySelector(".loader").classList.add("fade");
    showPage();
    document.querySelectorAll('input').forEach(cooardinate => cooardinate.addEventListener('input', checkCode));
});

let cooardinates = 0;
// check if the user can start the mission
checkCode = (event) => {
    let input = event.target;

    // if the code is correct
    if (input.value === eval(`coordinate_${input.getAttribute("data-num")}`)) {
        input.removeEventListener('input', checkCode);
        input.readOnly = true;
        input.style.borderColor = "rgb(32, 219, 159)";
        cooardinates++;
    }

    // if the user assigned all coordinates
    if (cooardinates === document.querySelectorAll('input').length) {
        // move part
        setTimeout(() => {
            movePage("1", "0");
            document.querySelector(".odot-logo").style.display = "none";
        }, 500);
    }
}

movePage = (part, num) => {
    hidePage();

    if (part.length === 1) {
        nPart = Number(part);
    } else {
        nPart = nPart + Number(part);
    }

    if (num.length === 1) {
        nPage = Number(num);
    } else {
        nPage = nPage + Number(num);
    }

    showPage();
}

function hidePage() {
    // hides last divs
    for (let i = 0; i < matrix[nPart][nPage].divName.length; i++) {
        document.querySelector("#" + matrix[nPart][nPage].divName[i]).style.display = "none";
    }
}

function showPage() {
    // shows current divs
    for (let i = 0; i < matrix[nPart][nPage].divName.length; i++) {
        document.querySelector("#" + matrix[nPart][nPage].divName[i]).style.display = "block";
    }
    callPageFunctions();
}

callPageFunctions = (event) => {
    // functions
    // calls the functions of the page
    if (matrix[nPart][nPage].functions.length > 0) {
        let nFunction = 0;
        while (nFunction < matrix[nPart][nPage].functions.length) {
            eval(matrix[nPart][nPage].functions[nFunction]);
            // functions that contains the word "pop" will accur only once
            if (matrix[nPart][nPage].functions[nFunction].includes("pop")) {
                matrix[nPart][nPage].functions.splice(nFunction, 1);
                // since the function happens only once there is no need in adding nFunction +1
            } else {
                nFunction++;
            }
        }
    }
}

// function that adds events listeners to buttons that affects the page's display- called only one time for each button
pop_buttons = (button, part, num) => {
    button.addEventListener('click', function () {
        movePage(part, num)
    });
}

// function that adds events listeners only one time
pop_eventListener = (elem, act, func) => {
    elem.addEventListener(act, func);
}

let shotFunc;
// let shotH = 0;
// let shotW = 0;

activeShot = () => {
    shotW = Math.sign(angle);
    if (-1 < angle && angle < 1) {
        shotH = 3;
    } else {
        shotH = Math.abs(((h - dragY) / (dragX - 0.5 * w))) * Math.abs(shotW);
    }
    document.querySelector("#lazer").style.bottom = `60px`;
    shotFunc = setInterval(shotAnimation, 10 * (1 / Math.abs(angle)));

    document.querySelector("#mission .container").removeEventListener("mousemove", rotateShot);
    document.querySelector("#mission button").disabled = true;
}

rotateShot = (e) => {
    e = e || window.event;
    dragX = e.pageX;
    dragY = e.pageY;
    angle = Math.atan((dragX - 0.5 * w) / (h - dragY)) * 180 / Math.PI;
    console.log(angle);
    document.querySelector("#lazer").style.transform = `rotate(${angle}deg)`;
    document.querySelector(".launcher").style.transform = `rotate(${angle}deg)`;
}

var shotRect;
var asteroidRect;
let shotsCounter = 0;
shotAnimation = () => {
    // shotW++;
    // shotH = Math.abs(((h - dragY)/(dragX - 0.5 * w))) * shotW;
    document.querySelector("#lazer").style.bottom = `${parseFloat(window.getComputedStyle(document.querySelector("#lazer"), null).getPropertyValue("bottom")) + shotH}px`;
    document.querySelector("#lazer").style.left = `${parseFloat(window.getComputedStyle(document.querySelector("#lazer"), null).getPropertyValue("left")) + shotW}px`;

    shotRect = document.querySelector("#lazer").getBoundingClientRect();
    asteroidRect = document.querySelector("#asteroid").getBoundingClientRect();
    if ((asteroidRect.y <= shotRect.y && shotRect.y <= asteroidRect.bottom && asteroidRect.x <= shotRect.x && shotRect.x <= asteroidRect.right)) {
        clearInterval(shotFunc);
        // send to winning function of explosion!
        win();
        // user surpassed height or width
    } else if ((parseFloat(window.getComputedStyle(document.querySelector("#lazer"), null).getPropertyValue("bottom")) > h) || (parseFloat(window.getComputedStyle(document.querySelector("#lazer"), null).getPropertyValue("left")) > w) || (parseFloat(window.getComputedStyle(document.querySelector("#lazer"), null).getPropertyValue("left")) < 0)) {
        if ((parseFloat(window.getComputedStyle(document.querySelector("#lazer"), null).getPropertyValue("bottom")) > h)) {
            shotW = 0; 
            angle = 0;
            clearInterval(shotFunc);
            document.querySelector("#lazer").style.cssText = `transform: rotate(0deg); left: 50.5vw; bottom: 60px;`;
            document.querySelector(".launcher").style.cssText = `transform: rotate(0deg);`;
            document.querySelector("#mission button").disabled = false;
            pop_eventListener(document.querySelector("#mission .container"), 'mousemove', rotateShot);
            nMultipleCorrectAnswers--;
            document.querySelector("#counter").innerHTML = `יריות: ${nMultipleCorrectAnswers}`;
            // end of shots
            if (nMultipleCorrectAnswers <= 0) {
                // retry
                retry();
            }
            // user reached wall - change direction
        } else {
            angle = angle * -1;
            document.querySelector("#lazer").style.transform = `rotate(${angle}deg)`;
            shotW = shotW * -1;
        }
    }
}

retry = () => {
    movePage("1", "0");
    document.querySelector('#instructions .instructions').innerHTML = "לא הצלחתם לפוצץ את האסטרואיד ונגמרה לכם התחמושת... נסו שוב!";
    nMultipleCurrentQuestion = 0;
    nMultipleCorrectAnswers = 0;
    document.querySelector(`#shots-counter`).innerHTML = "מספר היריות:";
}

win = () => {
    document.querySelector(`#asteroid`).style.animationPlayState = "paused";
    document.querySelector(`#asteroid`).style.backgroundImage = "url(assets/media/explosion.gif)";
    setTimeout(function() {
        document.querySelector(`#asteroid`).style.display = "none";
        setTimeout(function() {
            movePage("1", "0");
            document.querySelector('#instructions .instructions').innerHTML = "איזה מזל! בעזרת שליטתכם בחומר הצלחתם לפוצץ את האסטרואיד! הצלתם את העולם מפני השמדה!";
            document.querySelector(`.start-button`).style.display = "none";
        }, 1500);
    }, 700);
}

