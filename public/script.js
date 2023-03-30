const question = document.querySelector('#question');

const gameBoard = document.querySelector('#game-board');
const h2 = document.querySelector('h2');

function fillQuestionElements(data) {
    if (data.winner === true) {
        gameBoard.style.display = 'none';
        h2.innerText = "Wygrałeś!";
        return;
    }
    if (data.loser === true) {
        gameBoard.style.display = 'none';
        h2.innerText = "Koniec gry - przegrałeś.";
        return;
    }
    question.innerText = data.question;
    for (const i in data.answers) {

        const answerEl = document.querySelector(`#answer${Number(i) + 1}`);
        answerEl.innerText = data.answers[i];
    }
}

function showNextQuestion() {
    fetch('/question', {
            method: 'GET',
        }).then(response => response.json())
        .then(data => {
            fillQuestionElements(data);
        })
}

showNextQuestion();

const goodAnswersSpan = document.querySelector('#good-answers');

function handleAnswerFeedback(data) {
    goodAnswersSpan.innerText = data.goodAnswers;
    showNextQuestion();
}


function sendAnswer(answerIndex) {
    fetch(`/answer/${answerIndex}`, {
            method: 'POST',
        })
        .then(r => r.json())
        .then(data => {
            handleAnswerFeedback(data);
        });
}
const buttons = document.querySelectorAll('.answer-btn');
for (const button of buttons) {
    button.addEventListener('click', (event) => {
        const answerIndex = event.target.dataset.answer;
        sendAnswer(answerIndex);
    })
}

const tipDiv = document.querySelector('#tip');

function handleFriendAnswer(data) {
    tipDiv.innerText = data.text;
}

function callToAFriend() {
    fetch('/help/friend', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            handleFriendAnswer(data);
        });
}

document.querySelector('#callToAFriend').addEventListener('click', callToAFriend)

// ----------------

function handleHalfOnHalf(data) {

    if (typeof data.text === 'string') {
        tipDiv.innerText = data.text;
    } else {
        for (const button of buttons) {
            if (data.answersToRemove.indexOf(button.innerText) > -1) {
                button.innerText = '';
            }
        }

    }
}

function halfOnHalf() {
    fetch('/help/half', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            handleHalfOnHalf(data);
        });
}

document.querySelector('#halfOnHalf').addEventListener('click', halfOnHalf)

// ----------------

function handleQuestionToTheCrowd(data) {

    if (typeof data.text === 'string') {
        tipDiv.innerText = data.text;
    } else {
        data.chart.forEach((perc, index) => {
            buttons[index].innerText = `${buttons[index].innerText} : ${perc}%`;
        });

    }
}

function questionToTheCrowd() {
    fetch('/help/crowd', {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            handleQuestionToTheCrowd(data);
        });
}

document.querySelector('#questionToTheCrowd').addEventListener('click', questionToTheCrowd)