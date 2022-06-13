const DATA = { 
    // multiple and binary questions
    "questions": [
        {
            type: `multiple`,
            question: `היי אמ`,
            ans1: `מיי ניים איז`,
            ans2: `יור ניימ איז`,
            ans3: `אאור ניימ  איז`,
            ans4: `מרב`,
            correctAns: `ans4`
        },
        {
            type: `binary`,
            question: `היי מיי ניים איז מרב`,
            correctAns: true
        },
        {
            type: `multiple`,
            question: `אמא של מרב היא:`,
            ans1: `נירה`,
            ans2: `דני דה נירו`,
            ans3: `ניירון קיסר`,
            ans4: `ניירובי`,
            correctAns: `ans1`
        }
    ]
    // // complete the sentence
    // "completeSentence": [
    //     {
    //         sentence: [`חלק ראשון של המשפט`, `חלק שני של המשפט`], // put each part of the sentence as an string in the array
    //         dropDownAns: [
    //             `אופציה 1`,
    //             `אופציה 2`,
    //             `אופציה 3`,
    //             `אופציה 4`,
    //         ], // all the options that will apear in the dropDown.
    //         correctAns: "ans0" // location of answer in array
    //     },    
    //     {
    //         sentence: [`חלק אחד של המשפט`, `חלק שני של המשפט`], // put each part of the sentence as an string in the array
    //         dropDownAns: [
    //             `אופציה 1`,
    //             `אופציה 2`,
    //             `אופציה 3`,
    //             `אופציה 4`,
    //         ], // all the options that will apear in the dropDown.
    //         correctAns: "ans0" // location of answer in array
    //     },    
    // ],
    // // sort to groups
    // "sortToGroups": [
    //     {
    //         drag: "קבוצה 1",
    //         group: 1
    //     },
    //     {
    //         drag: "קבוצה 2",
    //         group: 2
    //     },
    //     {
    //         drag: "קבוצה 3",
    //         group: 3
    //     },
    // ]
};

/* loading function
--------------------------------------------------------------
Description: */
//window.addEventListener("load", () => { 
    /* for multiple and binary questions--------------------------*/
    // arrMultipleQuestions = shuffle(DATA.questions);
    // addContentToQuestion();
    /* for complete the sentence----------------------------------*/
    // addContentToSentence();
    /* for sort to groups-----------------------------------------*/
    // setDrag();
    // setDrop();
    // createItems();
    // shuffle(DATA.sortToGroups);
//});

/* questionsEnd
--------------------------------------------------------------
Description: for multiple and binary questions or for complete the sentence */
const questionsEnd = () => {
    // user didnt succeed
    if (nMultipleCorrectAnswers === 0) {
        // user failed - retry
        movePage("+0","-1");
        document.querySelector('#instructions .instructions').innerHTML = "לא הצלחתם לצבור מספיק כדורים... נסו שוב!";
        nMultipleCurrentQuestion = 0;
    } else {
        movePage("+0","+1"); 
    }
}

// for all of the options - dont delete
/*
shuffle
------------------------------------------------
Description: take orgnaiz array and shffel it
Parameters: array.
------------------------------------------------
Programer: Gal
------------------------------------------------
*/
function shuffle(arr) {
    let tmp = arr.slice();
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * tmp.length);
        arr[i] = tmp[index];
        tmp = tmp.slice(0, index).concat(tmp.slice(index + 1));
    }
    return arr;
}

/* El
--------------------------------------------------------------
Description: for all of the options - dont delete */
function El(tagName, options = {}, ...children) {
    let el = Object.assign(document.createElement(tagName), options.fields || {});
    if (options.classes && options.classes.length) el.classList.add(...options.classes);
    else if (options.cls) el.classList.add(options.cls);
    if (options.id) el.id = options.id;
    el.append(...children.filter(el => el));
    for (let listenerName of Object.keys(options.listeners || {}))
        if (options.listeners[listenerName]) el.addEventListener(listenerName, options.listeners[listenerName], false);
    for (let attributeName of Object.keys(options.attributes || {})) {
        if (options.attributes[attributeName] !== undefined) el.setAttribute(attributeName, options.attributes[attributeName]);
    }
    return el;
}

addAnimation = (element, animation, time, delay, callback) => {
    element.classList.add(animation);
    element.style.cssText = `animation-duration: ${time}ms; animation-delay: ${delay}ms;`;
    setTimeout(callback, time + delay - 100);
}

