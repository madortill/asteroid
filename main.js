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
            functions: ['pop_buttons(document.querySelector("#back-button-odot"), "1", "0")']
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
const coordinate_1 = "183";
const coordinate_2 = "542";

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
        input.style.borderColor = "rgb(32, 219, 159)";
        cooardinates++;
    }

    // if the user assigned all coordinates
    if (cooardinates === document.querySelectorAll('input').length) {
        // move part
        movePage("1", "0");
        document.querySelector(".odot-logo").style.display = "none";
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
}

win = () => {
    document.querySelector(`#asteroid`).style.animationPlayState = "paused";
    document.querySelector(`#asteroid`).style.backgroundImage = "url(assets/media/explosion.gif)";
    setTimeout(function() {
        document.querySelector(`#asteroid`).style.display = "none";
        setTimeout(function() {
            movePage("1", "0");
            document.querySelector('#instructions .instructions').innerHTML = "איזה מזל! הצלחתם לפוצץ את האסטרואיד!";
            document.querySelector(`.start-button`).style.display = "none";
        }, 1500);
    }, 700);
}





// let currLock;
// loadMission = () => {
//     document.querySelector('#opening').style.display = "none";
//     document.querySelector('#mission').style.display = "block";
//     // allow drag and drop
//     setDrag();
//     setDrop();

//     let lock;
//     let ArrLocks = [];
//     for (let i = 1; i <= 9; i++) {
//         // drag
//         lock = El("div", {classes: [`drag`, `background`], attributes: {"data-num": i, "draggable" : "false"}}, 
//         El("div", {classes: [`background`, `lock`], listeners: {click : question}}));
//         ArrLocks.push(lock); 
//         lock.style.backgroundImage = `url(assets/media/puzzle_${i}.svg)`;
//         // drop
//         drop = El("div", {classes: [`drop`, `flex`], attributes: {"data-num": i}});
//         document.querySelector(`#puzzle`).append(drop);
//     }
//     let random;
//     for (let i = 1; i <= 9; i++) {
//         random = Math.floor(Math.random() * ArrLocks.length);
//         document.querySelector(`#pieces`).append(ArrLocks[random]);
//         ArrLocks.splice(random, 1);
//     }
//     // document.querySelectorAll('.lock').forEach((lock) => {
//     //     lock.addEventListener('click', question);

//     // });
// }

// // popping question
// question = (event) => {
//     //event.target.style.display = "none";
//     // event.target.parentElement.setAttribute("draggable", "true");
//     // document.querySelector('.completeSentenceContainer').style.display = "block";
//     // addAnimation(document.querySelector('.completeSentenceContainer'), "fade-in", 1500, 500);
//     // addAnimation(document.querySelector('.completeSentenceContainer'), "fade-in", 1500, 200);
//     // if (document.querySelector('.completeSentenceContainer').classList.contains("fade-out")) {
//     //     document.querySelector('.completeSentenceContainer').classList.remove("fade-out")
//     // };
//     document.querySelector('.completeSentenceContainer').style.animation = "fadeIn 1s ease forwards";
//     addContentToSentence();
//     currLock = event.target;
// }

// const questionsEnd = () => {
//     console.log("סיימתי");
//     // if (document.querySelector('.completeSentenceContainer').classList.contains("fade-in")) {
//     //     document.querySelector('.completeSentenceContainer').classList.remove("fade-in")
//     // };
//     // addAnimation(document.querySelector('.completeSentenceContainer'), "fade-out", 1500, 200);
//     // display lock
//     currLock.style.display = "none";
//     currLock.parentElement.setAttribute("draggable", "true");
// }

// closeWindow = (event) => {
//     // document.querySelector('.completeSentenceContainer').classList.remove("fade-in");
//     document.querySelector('.completeSentenceContainer').style.animation = "fadeOut 1s ease forwards";
// //     document.querySelector('.completeSentenceContainer').classList.add("fade-out");
// //    addAnimation(document.querySelector('.completeSentenceContainer'), "fade-out", 1500, 200, function() {
// //         // document.querySelector('.completeSentenceContainer').classList.remove("fade-in");
// //    });
// }

// let countDrag = 0;
// // after an item has been dropped correctly
// onDrop = (drag, drop) => {
//     drag.setAttribute("draggable", "false");
//     countDrag++;
//     if (countDrag === document.querySelectorAll('.drag').length) {
//         document.querySelector('#mission .instructions').innerHTML = "כל הכבוד! חשפתם את המספר הבא!"
//     }
// }
