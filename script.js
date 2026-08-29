/* =========================================
   SCREEN ELEMENTS
========================================= */

const startScreen =
    document.getElementById("startScreen");

const scratchScreen =
    document.getElementById("scratchScreen");

const birthdayScreen =
    document.getElementById("birthdayScreen");

const proposalScreen =
    document.getElementById("proposalScreen");

const finalScreen =
    document.getElementById("finalScreen");


/* =========================================
   BUTTONS
========================================= */

const startButton =
    document.getElementById("startButton");

const continueButton =
    document.getElementById("continueButton");

const proposalButton =
    document.getElementById("proposalButton");

const yesButton =
    document.getElementById("yesButton");

const noButton =
    document.getElementById("noButton");


/* =========================================
   AUDIO
========================================= */

const music =
    document.getElementById(
        "backgroundMusic"
    );

const popSound =
    document.getElementById(
        "popSound"
    );

const fireworkSound =
    document.getElementById(
        "fireworkSound"
    );


/* =========================================
   SHOW SCREEN
========================================= */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(item => {

            item.classList.remove(
                "active"
            );

        });

    screen.classList.add(
        "active"
    );

}


/* =========================================
   START BUTTON
========================================= */

startButton.addEventListener(
    "click",
    () => {

        showScreen(
            scratchScreen
        );

        /*
         Browser audio permission:
         User has interacted, so music
         can start here.
        */

        music.volume = 0.45;

        music.play().catch(() => {

            console.log(
                "Music playback blocked."
            );

        });

        setupScratch();

    }
);


/* =========================================
   SCRATCH SYSTEM
========================================= */

const canvas =
    document.getElementById(
        "scratchCanvas"
    );

const ctx =
    canvas.getContext("2d");


const scratchPercent =
    document.getElementById(
        "scratchPercent"
    );


let drawing = false;

let scratchFinished = false;

let lastPercent = 0;


/* =========================================
   SETUP SCRATCH
========================================= */

function setupScratch() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width =
        rect.width;

    canvas.height =
        rect.height;


    /*
      Scratch layer
    */

    ctx.globalCompositeOperation =
        "source-over";


    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            canvas.width,
            canvas.height
        );


    gradient.addColorStop(
        0,
        "#ffd2e8"
    );

    gradient.addColorStop(
        0.5,
        "#ff78b5"
    );

    gradient.addColorStop(
        1,
        "#e91e79"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
      Scratch text
    */

    ctx.fillStyle =
        "white";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";


    ctx.font =
        "bold 28px Arial";


    ctx.fillText(
        "SCRATCH ME ❤️",
        canvas.width / 2,
        canvas.height / 2
    );


    ctx.font =
        "17px Arial";


    ctx.fillText(
        "Your surprise is waiting...",
        canvas.width / 2,
        canvas.height / 2 + 40
    );

}


/* =========================================
   GET TOUCH / MOUSE POSITION
========================================= */

function getPosition(event) {

    const rect =
        canvas.getBoundingClientRect();

    let clientX;
    let clientY;


    if (
        event.touches &&
        event.touches.length > 0
    ) {

        clientX =
            event.touches[0].clientX;

        clientY =
            event.touches[0].clientY;

    } else {

        clientX =
            event.clientX;

        clientY =
            event.clientY;

    }


    return {

        x:
            clientX - rect.left,

        y:
            clientY - rect.top

    };

}


/* =========================================
   SCRATCH
========================================= */

function scratch(event) {

    if (
        !drawing ||
        scratchFinished
    ) {

        return;

    }


    event.preventDefault();


    const position =
        getPosition(event);


    ctx.globalCompositeOperation =
        "destination-out";


    ctx.beginPath();


    ctx.arc(
        position.x,
        position.y,
        32,
        0,
        Math.PI * 2
    );


    ctx.fill();


    calculateScratch();

}


/* =========================================
   CALCULATE SCRATCH %
========================================= */

function calculateScratch() {

    const imageData =
        ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


    const data =
        imageData.data;


    let transparent =
        0;


    /*
      Sample pixels for mobile performance
    */

    for (
        let i = 3;
        i < data.length;
        i += 16
    ) {

        if (
            data[i] === 0
        ) {

            transparent++;

        }

    }


    const total =
        data.length / 16;


    const percentage =
        Math.floor(
            (transparent / total) * 100
        );


    if (
        percentage !==
        lastPercent
    ) {

        lastPercent =
            percentage;

        scratchPercent.innerText =
            `Scratch: ${percentage}%`;

    }


    /*
      Unlock after 55%
    */

    if (
        percentage >= 55 &&
        !scratchFinished
    ) {

        scratchFinished =
            true;

        finishScratch();

    }

}


/* =========================================
   MOUSE
========================================= */

canvas.addEventListener(
    "mousedown",
    () => {

        drawing = true;

    }
);


canvas.addEventListener(
    "mouseup",
    () => {

        drawing = false;

    }
);


canvas.addEventListener(
    "mouseleave",
    () => {

        drawing = false;

    }
);


canvas.addEventListener(
    "mousemove",
    scratch
);


/* =========================================
   TOUCH
========================================= */

canvas.addEventListener(
    "touchstart",
    () => {

        drawing = true;

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchend",
    () => {

        drawing = false;

    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchmove",
    scratch,
    {
        passive: false
    }
);


/* =========================================
   SCRATCH FINISHED
========================================= */

function finishScratch() {

    /*
      Remove scratch completely
    */

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    scratchPercent.innerText =
        "❤️ SURPRISE UNLOCKED ❤️";


    /*
      PARTY POP SOUND
    */

    popSound.currentTime = 0;

    popSound.volume = 1;

    popSound.play().catch(() => {});


    /*
      FIREWORK SOUND
    */

    setTimeout(
        () => {

            fireworkSound.currentTime = 0;

            fireworkSound.volume = 0.7;

            fireworkSound
                .play()
                .catch(() => {});

        },
        150
    );


    /*
      Fireworks
    */

    startFireworks();


    /*
      Birthday screen
    */

    setTimeout(
        () => {

            showScreen(
                birthdayScreen
            );

        },
        5200
    );

}


/* =========================================
   FIREWORK CANVAS
========================================= */

const fireCanvas =
    document.getElementById(
        "fireworksCanvas"
    );

const fireCtx =
    fireCanvas.getContext(
        "2d"
    );


let particles = [];


function resizeFireworks() {

    fireCanvas.width =
        window.innerWidth;

    fireCanvas.height =
        window.innerHeight;

}


resizeFireworks();


window.addEventListener(
    "resize",
    resizeFireworks
);


/* =========================================
   CREATE FIREWORK
========================================= */

function createFirework(
    x,
    y
) {

    const hearts = [
        "❤️",
        "💖",
        "💕",
        "💗",
        "💓",
        "💘",
        "💝"
    ];


    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            Math.random() *
            7 + 2;


        particles.push({

            x: x,

            y: y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            gravity:
                0.08,

            life:
                100,

            emoji:
                hearts[
                    Math.floor(
                        Math.random() *
                        hearts.length
                    )
                ]

        });

    }

}


/* =========================================
   ANIMATE FIREWORK
========================================= */

function animateFireworks() {

    fireCtx.clearRect(
        0,
        0,
        fireCanvas.width,
        fireCanvas.height
    );


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );


    particles.forEach(
        particle => {

            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;

            particle.vy +=
                particle.gravity;

            particle.life -=
                1;


            fireCtx.globalAlpha =
                particle.life / 100;


            fireCtx.font =
                "22px Arial";


            fireCtx.fillText(
                particle.emoji,
                particle.x,
                particle.y
            );

        }
    );


    fireCtx.globalAlpha =
        1;


    if (
        particles.length > 0
    ) {

        requestAnimationFrame(
            animateFireworks
        );

    } else {

        fireCanvas.style.display =
            "none";

    }

}


/* =========================================
   START FIREWORKS
========================================= */

function startFireworks() {

    fireCanvas.style.display =
        "block";


    particles = [];


    createFirework(
        window.innerWidth * 0.20,
        window.innerHeight * 0.30
    );


    createFirework(
        window.innerWidth * 0.50,
        window.innerHeight * 0.25
    );


    createFirework(
        window.innerWidth * 0.80,
        window.innerHeight * 0.32
    );


    setTimeout(
        () => {

            createFirework(
                window.innerWidth * 0.35,
                window.innerHeight * 0.20
            );

        },
        450
    );


    setTimeout(
        () => {

            createFirework(
                window.innerWidth * 0.65,
                window.innerHeight * 0.25
            );

        },
        800
    );


    animateFireworks();

}


/* =========================================
   BIRTHDAY → PROPOSAL
========================================= */

continueButton.addEventListener(
    "click",
    () => {

        showScreen(
            proposalScreen
        );

    }
);


/* =========================================
   PROPOSAL → FINAL
========================================= */

proposalButton.addEventListener(
    "click",
    () => {

        showScreen(
            finalScreen
        );

    }
);


/* =========================================
   SEND RESULT TO EMAIL
========================================= */

function sendResult(
    answer,
    message
) {

    const form =
        document.getElementById(
            "resultForm"
        );


    document.getElementById(
        "formResponse"
    ).value =
        answer;


    document.getElementById(
        "formMessage"
    ).value =
        message;


    document.getElementById(
        "formTime"
    ).value =
        new Date().toLocaleString(
            "en-IN",
            {
                dateStyle: "full",
                timeStyle: "long"
            }
        );


    /*
      Send Formspree request
    */

    fetch(
        form.action,
        {

            method: "POST",

            body:
                new FormData(form),

            headers: {

                "Accept":
                    "application/json"

            }

        }
    )
    .then(
        response => {

            if (
                response.ok
            ) {

                console.log(
                    "Response sent successfully."
                );

            } else {

                console.log(
                    "Could not send response."
                );

            }

        }
    )
    .catch(
        error => {

            console.log(
                "Email error:",
                error
            );

        }
    );

}


/* =========================================
   YES
========================================= */

yesButton.addEventListener(
    "click",
    () => {

        /*
          Send YES to email
        */

        sendResult(
            "❤️ YES",
            "She accepted the love proposal! ❤️💍"
        );


        /*
          Screen celebration
        */

        answerMessage.innerHTML =

            "❤️ SHE SAID YES! ❤️<br><br>" +

            "இனிமேல் என் கதையின்<br>" +

            "அழகான கதாபாத்திரம் நீ தான்... 💍💕";


        /*
          Massive fireworks
        */

        startFireworks();


        setTimeout(
            startFireworks,
            500
        );


        setTimeout(
            startFireworks,
            1000
        );

    }
);


/* =========================================
   NO
========================================= */

let noClicks = 0;


noButton.addEventListener(
    "click",
    () => {

        noClicks++;


        if (
            noClicks === 1
        ) {

            answerMessage.innerHTML =
                "🥺 Are you sure? ❤️";

        }

        else {

            answerMessage.innerHTML =
                "💔 Okay... But my heart will still wait for you ❤️";

        }


        /*
          Send NO result
        */

        sendResult(
            "💔 NO",
            "She clicked the NO button."
        );

    }
);


/* =========================================
   NO BUTTON MOVES
   Only after second attempt
========================================= */

noButton.addEventListener(
    "mouseover",
    () => {

        if (
            noClicks >= 1
        ) {

            moveNoButton();

        }

    }
);


function moveNoButton() {

    const maxX =
        window.innerWidth - 160;

    const maxY =
        window.innerHeight - 90;


    const x =
        Math.random() *
        Math.max(
            maxX,
            50
        );


    const y =
        Math.random() *
        Math.max(
            maxY,
            50
        );


    noButton.style.position =
        "fixed";


    noButton.style.left =
        `${x}px`;


    noButton.style.top =
        `${y}px`;

}


/* =========================================
   FLOATING HEARTS
========================================= */

const heartsContainer =
    document.getElementById(
        "hearts-container"
    );


const heartTypes = [
    "❤️",
    "💖",
    "💕",
    "💗",
    "💓",
    "💘",
    "💝"
];


function createFloatingHeart() {

    const heart =
        document.createElement(
            "div"
        );


    heart.className =
        "floating-heart";


    heart.innerText =
        heartTypes[
            Math.floor(
                Math.random() *
                heartTypes.length
            )
        ];


    heart.style.left =
        Math.random() * 100 +
        "%";


    heart.style.fontSize =
        Math.random() * 22 +
        15 +
        "px";


    heart.style.animationDuration =
        Math.random() * 5 +
        5 +
        "s";


    heartsContainer.appendChild(
        heart
    );


    setTimeout(
        () => {

            heart.remove();

        },
        10000
    );

}


setInterval(
    createFloatingHeart,
    500
);
