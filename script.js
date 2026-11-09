/* JS=========================================================
   CRICKET SCORE TRACKER — COMPLETE SCRIPT
   ========================================================= */

const players = {
    India: [
        "Shubman Gill","Rohit Sharma","Virat Kohli","Yashasvi Jaiswal",
        "KL Rahul","Rishabh Pant","Hardik Pandya","Ravindra Jadeja",
        "Kuldeep Yadav","Jasprit Bumrah","Mohammed Siraj"
    ],

    Australia: [
        "Travis Head","Mitchell Marsh","Steve Smith","Marnus Labuschagne",
        "Josh Inglis","Glenn Maxwell","Marcus Stoinis","Pat Cummins",
        "Mitchell Starc","Josh Hazlewood","Adam Zampa"
    ],

    England: [
        "Ben Duckett","Phil Salt","Joe Root","Harry Brook","Jos Buttler",
        "Liam Livingstone","Jacob Bethell","Jofra Archer","Adil Rashid",
        "Mark Wood","Gus Atkinson"
    ],

    "New Zealand": [
        "Devon Conway","Rachin Ravindra","Kane Williamson","Daryl Mitchell",
        "Tom Latham","Glenn Phillips","Michael Bracewell","Mitchell Santner",
        "Matt Henry","Lockie Ferguson","Will O'Rourke"
    ],

    "South Africa": [
        "Temba Bavuma","Quinton de Kock","Aiden Markram","Reeza Hendricks",
        "Rassie van der Dussen","David Miller","Heinrich Klaasen",
        "Marco Jansen","Keshav Maharaj","Kagiso Rabada","Anrich Nortje"
    ],

    Pakistan: [
        "Babar Azam","Mohammad Rizwan","Fakhar Zaman","Imam-ul-Haq",
        "Saud Shakeel","Salman Ali Agha","Iftikhar Ahmed","Shadab Khan",
        "Shaheen Afridi","Haris Rauf","Naseem Shah"
    ],

    "Sri Lanka": [
        "Pathum Nissanka","Kusal Mendis","Charith Asalanka",
        "Sadeera Samarawickrama","Kamindu Mendis","Dunith Wellalage",
        "Wanindu Hasaranga","Maheesh Theekshana","Asitha Fernando",
        "Dilshan Madushanka","Matheesha Pathirana"
    ],

    Bangladesh: [
        "Tanzid Hasan","Soumya Sarkar","Najmul Hossain Shanto","Litton Das",
        "Towhid Hridoy","Mushfiqur Rahim","Mehidy Hasan Miraz",
        "Rishad Hossain","Taskin Ahmed","Mustafizur Rahman","Shoriful Islam"
    ],

    "West Indies": [
        "Brandon King","Evin Lewis","Keacy Carty","Shai Hope","Nicholas Pooran",
        "Shimron Hetmyer","Roston Chase","Jason Holder","Romario Shepherd",
        "Alzarri Joseph","Gudakesh Motie"
    ]
};


/* =========================================================
   MATCH VARIABLES
   ========================================================= */

let teamA = "";
let teamB = "";

let tossWinner = "";
let batTeam = "";
let bowlTeam = "";

let inning = 1;

let totalOvers = 5;
let maxBalls = 30;

let score = 0;
let wkts = 0;
let balls = 0;

let target = 0;

let striker = "";
let nonStriker = "";
let currentBowler = "";

let nextBatterIndex = 2;
let bowlerIndex = 0;

let gameOver = false;

let history = [];

let stats = {};

let firstInningsScore = 0;
let firstInningsWickets = 0;

let audioContext = null;


/* =========================================================
   SCREEN SYSTEM
   ========================================================= */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(function(screen) {
        screen.classList.add("hidden");
    });

    const screen = document.getElementById(id);

    if (screen) {
        screen.classList.remove("hidden");
    }

    window.scrollTo(0, 0);
}


function goHome() {

    stopSpeech();

    showScreen("homeScreen");
}


function showCreateMatch() {

    showScreen("createScreen");
}


function showAbout() {

    showScreen("aboutScreen");
}


/* =========================================================
   SPEECH
   ========================================================= */

function stopSpeech() {

    if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
    }
}


function speak(text) {

    if (!text) return;

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();

    const message =
        new SpeechSynthesisUtterance(text);

    message.lang = "en-IN";
    message.rate = 0.88;
    message.pitch = 1;
    message.volume = 1;

    const voices =
        speechSynthesis.getVoices();

    const voice =
        voices.find(function(v) {
            return v.lang === "en-IN";
        }) ||
        voices.find(function(v) {
            return v.lang &&
                   v.lang.startsWith("en-IN");
        }) ||
        voices.find(function(v) {
            return /india|indian/i.test(v.name);
        }) ||
        voices.find(function(v) {
            return v.lang &&
                   v.lang.startsWith("en");
        });

    if (voice) {
        message.voice = voice;
    }

    setTimeout(function() {

        try {
            speechSynthesis.resume();
            speechSynthesis.speak(message);
        } catch (error) {
            console.log("Speech error:", error);
        }

    }, 80);
}


/* =========================================================
   SOUND
   ========================================================= */

function unlockAudio() {

    try {

        const AudioContextClass =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContextClass) return;

        if (!audioContext) {
            audioContext =
                new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

    } catch (error) {
        console.log("Audio error:", error);
    }
}


function playSound(type) {

    try {

        unlockAudio();

        if (!audioContext) return;

        const now =
            audioContext.currentTime;

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        let startFrequency = 500;
        let endFrequency = 700;
        let duration = 0.2;
        let wave = "sine";

        if (type === "click") {
            startFrequency = 520;
            endFrequency = 700;
            duration = 0.08;
            wave = "square";
        }

        if (type === "four") {
            startFrequency = 500;
            endFrequency = 950;
            duration = 0.45;
            wave = "triangle";
        }

        if (type === "six") {
            startFrequency = 420;
            endFrequency = 1250;
            duration = 0.7;
            wave = "sawtooth";
        }

        if (type === "wicket") {
            startFrequency = 250;
            endFrequency = 70;
            duration = 0.5;
            wave = "square";
        }

        if (type === "toss") {
            startFrequency = 450;
            endFrequency = 1000;
            duration = 0.4;
            wave = "sine";
        }

        if (type === "over") {
            startFrequency = 440;
            endFrequency = 880;
            duration = 0.55;
            wave = "triangle";
        }

        oscillator.type = wave;

        oscillator.frequency.setValueAtTime(
            startFrequency,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            endFrequency,
            now + duration
        );

        gain.gain.setValueAtTime(
            0.18,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + duration
        );

        oscillator.start(now);

        oscillator.stop(
            now + duration + 0.02
        );

    } catch (error) {
        console.log("Sound error:", error);
    }
}


document.addEventListener(
    "click",
    unlockAudio,
    { once: true }
);


/* =========================================================
   COMMENTARY
   ========================================================= */

function showEvent(text) {

    const eventBox =
        document.getElementById("event");

    if (eventBox) {
        eventBox.innerText = text;
    }

    console.log(text);
}


function commentary(text, sound) {

    if (sound) {
        playSound(sound);
    }

    showEvent(text);

    speak(text);
}


function randomItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}


/* =========================================================
   CREATE MATCH
   ========================================================= */

function startToss() {

    teamA =
        document.getElementById("teamA").value;

    teamB =
        document.getElementById("teamB").value;

    const overs =
        Number(
            document.getElementById("totalOvers").value
        );

    if (!teamA || !teamB) {

        alert(
            "Please select both teams."
        );

        return;
    }

    if (teamA === teamB) {

        alert(
            "Please select two different teams."
        );

        return;
    }

    totalOvers =
        Math.max(
            1,
            Math.min(
                50,
                Number.isFinite(overs) && overs
                    ? overs
                    : 5
            )
        );

    maxBalls =
        totalOvers * 6;

    inning = 1;
    score = 0;
    wkts = 0;
    balls = 0;
    target = 0;

    gameOver = false;

    history = [];

    document.getElementById(
        "tossTeams"
    ).innerText =
        `${teamA} vs ${teamB}`;

    document.getElementById(
        "teamAButton"
    ).innerText =
        `🏆 ${teamA}`;

    document.getElementById(
        "teamBButton"
    ).innerText =
        `🏆 ${teamB}`;

    showScreen("tossScreen");

    playSound("toss");
}


/* =========================================================
   TOSS
   ========================================================= */

function tossWon(side) {

    tossWinner =
        side === "A"
            ? teamA
            : teamB;

    document.getElementById(
        "tossWinnerText"
    ).innerText =
        `${tossWinner} won the toss!`;

    showScreen("decisionScreen");

    playSound("toss");

    commentary(
        `${tossWinner} have won the toss. What will they choose?`
    );
}


function chooseBatting() {

    batTeam =
        tossWinner;

    bowlTeam =
        tossWinner === teamA
            ? teamB
            : teamA;

    startFirstInnings();
}


function chooseBowling() {

    bowlTeam =
        tossWinner;

    batTeam =
        tossWinner === teamA
            ? teamB
            : teamA;

    startFirstInnings();
}


/* =========================================================
   INNINGS START
   ========================================================= */

function startFirstInnings() {

    inning = 1;

    score = 0;
    wkts = 0;
    balls = 0;

    target = 0;

    history = [];

    nextBatterIndex = 2;
    bowlerIndex = 0;

    gameOver = false;

    createStats(batTeam);

    const battingPlayers =
        players[batTeam];

    const bowlingPlayers =
        players[bowlTeam];

    striker =
        battingPlayers[0];

    nonStriker =
        battingPlayers[1];

    currentBowler =
        bowlingPlayers[0];

    showScreen("scoreScreen");

    update();

    commentary(
        `${batTeam} start the first innings. ${striker} and ${nonStriker} are at the crease.`
    );
}


/* =========================================================
   PLAYER STATS
   ========================================================= */

function createStats(team) {

    stats = {};

    const list =
        players[team] ||
        createGenericPlayers();

    list.forEach(function(name) {

        stats[name] = {

            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            out: false

        };

    });
}


function createGenericPlayers() {

    return [
        "Batter 1",
        "Batter 2",
        "Batter 3",
        "Batter 4",
        "Batter 5",
        "Batter 6",
        "Batter 7",
        "Batter 8",
        "Batter 9",
        "Batter 10",
        "Batter 11"
    ];
}


function formatOvers(ballCount) {

    return (
        Math.floor(ballCount / 6) +
        "." +
        (ballCount % 6)
    );
}


/* =========================================================
   UPDATE SCOREBOARD
   ========================================================= */

function update() {

    const setText =
        function(id, value) {

            const element =
                document.getElementById(id);

            if (element) {
                element.innerText = value;
            }
        };


    setText(
        "inningsText",
        inning === 1
            ? "1st Innings"
            : "2nd Innings"
    );

    setText(
        "battingTeam",
        batTeam
    );

    setText(
        "runs",
        score
    );

    setText(
        "wickets",
        wkts
    );

    setText(
        "overs",
        formatOvers(balls)
    );


    const runRate =
        balls > 0
            ? (
                score /
                (balls / 6)
              ).toFixed(2)
            : "0.00";


    setText(
        "runRate",
        runRate
    );


    setText(
        "targetText",
        inning === 2
            ? `Target: ${target}`
            : ""
    );


    updatePlayerSelectors();

    updateScorecard();
}


/* =========================================================
   PLAYER SELECTORS
   ========================================================= */

function fillSelect(
    id,
    list,
    current
) {

    const select =
        document.getElementById(id);

    if (!select) return;

    const old =
        current || select.value;

    select.innerHTML = "";

    list.forEach(function(name) {

        const option =
            document.createElement("option");

        option.value = name;
        option.textContent = name;

        select.appendChild(option);

    });

    if (list.includes(old)) {
        select.value = old;
    }
}


function updatePlayerSelectors() {

    const battingPlayers =
        players[batTeam] ||
        createGenericPlayers();

    const bowlingPlayers =
        players[bowlTeam] ||
        createGenericPlayers();


    fillSelect(
        "striker",
        battingPlayers,
        striker
    );

    fillSelect(
        "nonStriker",
        battingPlayers,
        nonStriker
    );

    fillSelect(
        "bowler",
        bowlingPlayers,
        currentBowler
    );


    const strikerSelect =
        document.getElementById("striker");

    const nonStrikerSelect =
        document.getElementById("nonStriker");

    const bowlerSelect =
        document.getElementById("bowler");


    if (strikerSelect) {

        strikerSelect.onchange =
            function() {

                striker =
                    strikerSelect.value;

            };

    }


    if (nonStrikerSelect) {

        nonStrikerSelect.onchange =
            function() {

                nonStriker =
                    nonStrikerSelect.value;

            };

    }


    if (bowlerSelect) {

        bowlerSelect.onchange =
            function() {

                currentBowler =
                    bowlerSelect.value;

            };

    }
}


/* =========================================================
   SAVE / UNDO
   ========================================================= */

function saveState() {

    history.push(
        JSON.stringify({

            inning,
            totalOvers,
            maxBalls,

            score,
            wkts,
            balls,
            target,

            striker,
            nonStriker,
            currentBowler,

            nextBatterIndex,
            bowlerIndex,

            gameOver,

            batTeam,
            bowlTeam,

            firstInningsScore,
            firstInningsWickets,

            stats

        })
    );


    if (history.length > 40) {
        history.shift();
    }
}


/* =========================================================
   BALL HISTORY
   ========================================================= */

function addHistoryBall(value) {

    const box =
        document.getElementById(
            "ballHistory"
        );

    if (!box) return;


    if (
        box.innerText ===
        "No balls yet"
    ) {

        box.innerHTML = "";

    }


    const span =
        document.createElement("span");

    span.className =
        "ball-item";

    span.innerText =
        value;

    box.prepend(span);
}


/* =========================================================
   SCORE POPUP
   ========================================================= */

function showPopup(text) {

    const popup =
        document.getElementById(
            "scorePopup"
        );

    if (!popup) return;

    popup.innerText =
        text;

    popup.classList.remove(
        "show"
    );

    void popup.offsetWidth;

    popup.classList.add(
        "show"
    );


    setTimeout(
        function() {

            popup.classList.remove(
                "show"
            );

        },
        1200
    );
}


/* =========================================================
   STADIUM ANIMATION
   ========================================================= */

function stadiumShot(runs) {

    const stadium =
        document.getElementById(
            "stadium"
        );

    const ball =
        document.getElementById(
            "cricketBall"
        );

    const shadow =
        document.getElementById(
            "ballShadow"
        );

    const bat =
        document.querySelector(
            ".striker-player"
        );


    if (!stadium || !ball) {
        return;
    }


    stadium.classList.remove(
        "shot-four",
        "shot-six",
        "celebrate-four",
        "celebrate-six",
        "ball-impact"
    );


    ball.style.animation =
        "none";


    if (shadow) {
        shadow.style.animation =
            "none";
    }


    void stadium.offsetWidth;


    if (bat) {

        bat.classList.remove(
            "swing"
        );

        void bat.offsetWidth;

        bat.classList.add(
            "swing"
        );

    }


    if (runs === 4) {

        stadium.classList.add(
            "shot-four"
        );


        setTimeout(
            function() {

                stadium.classList.add(
                    "ball-impact"
                );

            },
            950
        );


        setTimeout(
            function() {

                stadium.classList.add(
                    "celebrate-four"
                );

                showPopup(
                    "FOUR! 🏏"
                );

            },
            1050
        );

    }


    if (runs === 6) {

        stadium.classList.add(
            "shot-six"
        );


        setTimeout(
            function() {

                stadium.classList.add(
                    "celebrate-six"
                );

                showPopup(
                    "SIX! 🚀"
                );

            },
            1050
        );

    }


    setTimeout(
        function() {

            stadium.classList.remove(
                "shot-four",
                "shot-six",
                "celebrate-four",
                "celebrate-six",
                "ball-impact"
            );


            if (bat) {

                bat.classList.remove(
                    "swing"
                );

            }


            ball.style.animation = "";


            if (shadow) {
                shadow.style.animation = "";
            }

        },
        1900
    );
}


/* =========================================================
   ADD RUNS
   ========================================================= */

function addRuns(runs) {

    if (gameOver) return;


    if (balls >= maxBalls) {

        endInnings();

        return;
    }


    saveState();


    score += runs;

    balls++;


    if (stats[striker]) {

        stats[striker].runs += runs;

        stats[striker].balls++;


        if (runs === 4) {
            stats[striker].fours++;
        }


        if (runs === 6) {
            stats[striker].sixes++;
        }

    }


    let text = "";


    if (runs === 0) {

        text =
            randomItem([

                `${currentBowler} beats the bat. Dot ball.`,

                `Good delivery from ${currentBowler}. No run.`,

                `${striker} can't find the gap. Dot ball.`

            ]);

        playSound("click");

    }


    else if (runs === 1) {

        text =
            `${striker} nudges it into the gap and takes a quick single.`;

        playSound("click");

    }


    else if (runs === 2) {

        text =
            `${striker} works it into space. They come back for two.`;

        playSound("click");

    }


    else if (runs === 3) {

        text =
            `Excellent running between the wickets! ${striker} gets three.`;

        playSound("click");

    }


    else if (runs === 4) {

        text =
            randomItem([

                `FOUR! ${striker} finds the boundary! What a shot!`,

                `FOUR! ${striker} picks the gap beautifully and it races away!`,

                `That's four! ${striker} times it brilliantly through the field!`

            ]);

        playSound("four");

        stadiumShot(4);

    }


    else if (runs === 6) {

        text =
            randomItem([

                `SIX! ${striker} has launched that into the stands!`,

                `Massive six! ${striker} gets underneath it and sends it miles!`,

                `That's huge! ${striker} sends it out of the park!`

            ]);

        playSound("six");

        stadiumShot(6);

    }


    showEvent(text);

    speak(text);


    addHistoryBall(
        runs === 0
            ? "•"
            : runs
    );


    if (runs % 2 === 1) {

        swapStrike();

    }


    afterLegalBall();
}


/* =========================================================
   WIDE
   ========================================================= */

function addWide() {

    if (gameOver) return;


    saveState();


    score++;


    const text =
        `Wide ball! ${currentBowler} misses the line and ${batTeam} get an extra run.`;


    showEvent(text);

    speak(text);

    playSound("click");

    addHistoryBall("Wd");


    update();


    if (
        inning === 2 &&
        score >= target
    ) {

        announceWin();

    }
}


/* =========================================================
   NO BALL
   ========================================================= */

function addNoBall() {

    if (gameOver) return;


    saveState();


    score++;


    const text =
        `No ball! ${currentBowler} oversteps and ${batTeam} get an extra run.`;


    showEvent(text);

    speak(text);

    playSound("click");

    addHistoryBall("Nb");


    update();


    if (
        inning === 2 &&
        score >= target
    ) {

        announceWin();

    }
}


/* =========================================================
   WICKET
   ========================================================= */

function addWicket() {

    if (gameOver) return;


    if (balls >= maxBalls) {

        endInnings();

        return;
    }


    saveState();


    const outPlayer =
        striker;


    wkts++;

    balls++;


    if (stats[outPlayer]) {

        stats[outPlayer].balls++;

        stats[outPlayer].out =
            true;

    }


    const text =
        `WICKET! ${outPlayer} is gone to the pavillion! ${currentBowler} take the wicket!`;


    showEvent(text);

    speak(text);

    playSound("wicket");

    addHistoryBall("W");


    if (wkts >= 10) {

        endInnings();

        return;
    }


    bringNewBatter();


    if (balls >= maxBalls) {

        endInnings();

        return;
    }


    if (balls % 6 === 0) {

        endOver();

        return;
    }


    update();
}


/* =========================================================
   NEW BATTER
   ========================================================= */

function bringNewBatter() {

    const battingPlayers =
        players[batTeam] ||
        createGenericPlayers();


    while (
        nextBatterIndex <
        battingPlayers.length &&
        stats[
            battingPlayers[
                nextBatterIndex
            ]
        ] &&
        stats[
            battingPlayers[
                nextBatterIndex
            ]
        ].out
    ) {

        nextBatterIndex++;

    }


    if (
        nextBatterIndex >=
        battingPlayers.length
    ) {

        return;
    }


    striker =
        battingPlayers[
            nextBatterIndex
        ];


    nextBatterIndex++;


    const text =
        `${striker} walks out to the middle. New batter at the crease.`;


    showEvent(text);

    speak(text);
}


/* =========================================================
   LEGAL BALL
   ========================================================= */

function afterLegalBall() {

    if (
        inning === 2 &&
        score >= target
    ) {

        announceWin();

        return;
    }


    if (balls >= maxBalls) {

        endInnings();

        return;
    }


    if (balls % 6 === 0) {

        endOver();

        return;
    }


    update();
}


/* =========================================================
   STRIKE
   ========================================================= */

function swapStrike() {

    const temp =
        striker;

    striker =
        nonStriker;

    nonStriker =
        temp;
}


/* =========================================================
   OVER COMPLETE
   ========================================================= */

function endOver() {

    playSound("over");


    const overNumber =
        Math.floor(
            balls / 6
        );


    const text =
        `Over complete! ${batTeam} are ${score} for ${wkts} after ${overNumber} overs.`;


    showEvent(text);

    speak(text);


    bowlerIndex++;


    const bowlingPlayers =
        players[bowlTeam] ||
        createGenericPlayers();


    currentBowler =
        bowlingPlayers[
            bowlerIndex %
            bowlingPlayers.length
        ];


    swapStrike();


    update();
}


/* =========================================================
   END INNINGS
   ========================================================= */

function endInnings() {

    if (gameOver) return;


    if (inning === 1) {

        firstInningsScore =
            score;

        firstInningsWickets =
            wkts;


        target =
            score + 1;


        const oversPlayed =
            formatOvers(balls);


        const text =
            `First innings complete! ${batTeam} have scored ${score} for ${wkts} in ${oversPlayed} overs. ${bowlTeam} need ${target} runs to win.`;


        showEvent(text);

        speak(text);

        playSound("over");


        setTimeout(
            function() {

                const start =
                    confirm(
                        `${batTeam} scored ${score}/${wkts} in ${oversPlayed} overs.\n\n${bowlTeam} need ${target} runs to win.\n\nStart second innings?`
                    );


                if (start) {

                    secondInnings();

                }

            },
            500
        );

    }

    else {

        finishSecondInnings();

    }
}


/* =========================================================
   SECOND INNINGS
   ========================================================= */

function secondInnings() {

    inning = 2;


    const oldBatTeam =
        batTeam;


    batTeam =
        bowlTeam;

    bowlTeam =
        oldBatTeam;


    score = 0;

    wkts = 0;

    balls = 0;

    history = [];

    nextBatterIndex = 2;

    bowlerIndex = 0;

    gameOver = false;


    createStats(batTeam);


    const battingPlayers =
        players[batTeam] ||
        createGenericPlayers();


    const bowlingPlayers =
        players[bowlTeam] ||
        createGenericPlayers();


    striker =
        battingPlayers[0];

    nonStriker =
        battingPlayers[1];

    currentBowler =
        bowlingPlayers[0];


    showScreen(
        "scoreScreen"
    );


    update();


    commentary(
        `Second innings begins! ${batTeam} need ${target} runs to win. ${striker} and ${nonStriker} are opening.`,
        "click"
    );
}


/* =========================================================
   CHASE WIN
   ========================================================= */

function announceWin() {

    if (gameOver) return;


    gameOver = true;


    const wicketsRemaining =
        10 - wkts;


    const text =
        `Match over! ${batTeam} have chased the target. They win by ${wicketsRemaining} wickets!`;


    showEvent(text);

    speak(text);

    playSound("over");


    setTimeout(
        finishSecondInnings,
        1000
    );
}


/* =========================================================
   FINAL RESULT
   ========================================================= */

function finishSecondInnings() {

    gameOver = true;


    let winner = "";

    let details = "";


    if (score >= target) {

        winner =
            `🏆 ${batTeam} WON!`;


        details =
            `${batTeam} won by <b>${10 - wkts} wickets</b>.<br><br>` +
            `Final Score: <b>${score}/${wkts}</b><br>` +
            `Overs: <b>${formatOvers(balls)}</b>`;

    }


    else if (
        score === firstInningsScore
    ) {

        winner =
            "🤝 MATCH TIED";


        details =
            `Both teams scored <b>${score}</b> runs.<br><br>` +
            `Match ended in a tie.`;

    }


    else {

        winner =
            `🏆 ${bowlTeam} WON!`;


        details =
            `${bowlTeam} won by <b>${firstInningsScore - score} runs</b>.<br><br>` +
            `${batTeam} scored <b>${score}/${wkts}</b>.`;

    }


    const winnerElement =
        document.getElementById(
            "winner"
        );


    const detailsElement =
        document.getElementById(
            "resultDetails"
        );


    if (winnerElement) {

        winnerElement.innerHTML =
            winner;

    }


    if (detailsElement) {

        detailsElement.innerHTML =
            details;

    }


    showScreen(
        "resultScreen"
    );
}


/* =========================================================
   SCORECARD
   ========================================================= */

function updateScorecard() {

    const table =
        document.getElementById(
            "battingTable"
        );


    if (!table) return;


    table.innerHTML = "";


    const battingPlayers =
        players[batTeam] ||
        createGenericPlayers();


    battingPlayers.forEach(
        function(name, index) {

            const st =
                stats[name] ||
                {
                    runs: 0,
                    balls: 0,
                    fours: 0,
                    sixes: 0,
                    out: false
                };


            if (
                index > nextBatterIndex - 1 &&
                st.runs === 0 &&
                st.balls === 0 &&
                !st.out
            ) {

                return;

            }


            const row =
                document.createElement("tr");


            row.innerHTML =

                `<td>` +
                name +
                (name === striker
                    ? " 🏏"
                    : "") +
                (st.out
                    ? " <small>out</small>"
                    : "") +
                `</td>` +

                `<td>${st.runs}</td>` +

                `<td>${st.balls}</td>` +

                `<td>${st.fours}</td>` +

                `<td>${st.sixes}</td>`;


            table.appendChild(row);

        }
    );
}


//BallHistory

function updateBallHistory(ballHistoryArray) {
  const historyContainer = document.getElementById('ball-history');
  historyContainer.innerHTML = ''; // Clear current list

  ballHistoryArray.forEach((ball) => {
    const span = document.createElement('span');
    span.textContent = ball;
    
    // Assign classes based on the ball outcome
    span.className = 'ball-item';
    if (ball === 'W') {
      span.classList.add('ball-wicket');
    } else if (ball === '4' || ball === '6') {
      span.classList.add('ball-boundary');
    } else {
      span.classList.add('ball-normal');
    }

    historyContainer.appendChild(span);
  });
}


/* =========================================================
   UNDO
   ========================================================= */

function undo() {

    if (
        !history.length ||
        gameOver
    ) {

        return;
    }


    const state =
        JSON.parse(
            history.pop()
        );


    inning =
        state.inning;

    totalOvers =
        state.totalOvers;

    maxBalls =
        state.maxBalls;

    score =
        state.score;

    wkts =
        state.wkts;

    balls =
        state.balls;

    target =
        state.target;

    striker =
        state.striker;

    nonStriker =
        state.nonStriker;

    currentBowler =
        state.currentBowler;

    nextBatterIndex =
        state.nextBatterIndex;

    bowlerIndex =
        state.bowlerIndex;

    gameOver =
        state.gameOver;

    batTeam =
        state.batTeam;

    bowlTeam =
        state.bowlTeam;

    firstInningsScore =
        state.firstInningsScore;

    firstInningsWickets =
        state.firstInningsWickets;

    stats =
        state.stats;


    update();

    showEvent(
        "Last ball undone."
    );
}


/* =========================================================
   RESET
   ========================================================= */

function resetWithoutConfirmation() {

    startFirstInnings();
}


function resetMatch() {

    if (
        confirm(
            "Reset this innings and start again?"
        )
    ) {

        resetWithoutConfirmation();

    }
}


/* =========================================================
   NEW MATCH
   ========================================================= */

function newMatch() {

    stopSpeech();

    showScreen(
        "homeScreen"
    );

    teamA = "";
    teamB = "";

    tossWinner = "";

    batTeam = "";
    bowlTeam = "";

    history = [];
}


window.addEventListener(
    "beforeunload",
    stopSpeech
);
