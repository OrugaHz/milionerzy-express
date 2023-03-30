function gameRoutes(app) {

    let goodAnswers = 0;

    let isGameOver = false;


    let callToAFriendUsed = false;
    let questionToTheCrowdUsed = false;
    let halfOnHalfUsed = false;

    const questions = [{
            question: "Petrol to barwa powstała z połączenia dwóch kolorów:",
            answers: ['jasno- i ciemnobrązowego', 'złotego i srebrnego', 'niebieskiego i zielonego', 'białego i czarnego'],
            correctAnswer: 2,
        },
        {
            question: "Tkanina na mundury to:",
            answers: ['adamaszek', 'satyna', 'mora', 'gabardyna'],
            correctAnswer: 3,
        },
        {
            question: "W 1971 r. psycholog Philip Zimbardo przeprowadził eksperyment symulujący:",
            answers: ['życie w więzieniu', 'życie rozbitków na wyspie', 'przebywanie w kosmosie', 'odbijanie zakładnikówi'],
            correctAnswer: 0,
        },
    ];

    app.get('/question', (req, res) => {
        if (goodAnswers === questions.length) {
            res.json({
                winner: true,
            })
        } else if (isGameOver) {
            res.json({
                loser: true,
            })
        } else {
            const nextQuestion = questions[goodAnswers];

            const {
                question,
                answers
            } = nextQuestion;
            res.json({
                question,
                answers,
            })
        }
    });

    app.post('/answer/:index', (req, res) => {

        if (isGameOver) {
            res.json({
                loser: true,
            });
        }
        const {
            index
        } = req.params;
        const question = questions[goodAnswers];

        const isGoodAnswer = question.correctAnswer === Number(index);

        if (isGoodAnswer) {
            goodAnswers++;
        } else {
            isGameOver = true;
        }
        res.json({
            correct: isGoodAnswer,
            goodAnswers,
        });
    });

    app.get('/help/friend', (req, res) => {
        if (callToAFriendUsed) {
            return res.json({
                text: "To koło ratunkowo zostało już wykorzystane!",
            });
        }

        callToAFriendUsed = true;

        const doesFriendKnowAnswer = Math.random() < 0.5;
        const question = questions[goodAnswers];
        res.json({
            text: doesFriendKnowAnswer ? `Wydaje mi się, że prawidłowa odpowiedź to ${question.answers[question.correctAnswer]}.` : 'Nie wiem, jaka może być odpowiedź :(...'
        })
    });

    app.get('/help/half', (req, res) => {
        if (halfOnHalfUsed) {
            return res.json({
                text: "To koło ratunkowo zostało już wykorzystane!",
            });
        }

        halfOnHalfUsed = true;


        const question = questions[goodAnswers];
        const answersCopy = question.answers.filter((s, index) => (
            index !== question.correctAnswer
        ));

        answersCopy.splice(~~(Math.random() * answersCopy.length), 1);

        res.json({
            answersToRemove: answersCopy,
        });
    });

    app.get('/help/crowd', (req, res) => {

        if (questionToTheCrowdUsed) {
            return res.json({
                text: "To koło ratunkowo zostało już wykorzystane!",
            });
        }

        questionToTheCrowdUsed = true;

        const chart = [10, 20, 30, 40];

        for (let i = chart.length - 1; i > 0; i--) {
            const change = Math.floor(Math.random() * 20 - 10);

            chart[i] += change;
            chart[i - 1] -= change;
        }

        const question = questions[goodAnswers];
        const {
            correctAnswer
        } = question;

        [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];

        res.json({
            chart,
        });
    })


}

module.exports = gameRoutes;