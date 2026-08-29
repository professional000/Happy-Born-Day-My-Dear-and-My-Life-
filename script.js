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

const birthdayContinue =
    document.getElementById(
        "birthdayContinue"
    );

const proposalButton =
    document.getElementById(
        "proposalButton"
    );

const yesButton =
    document.getElementById(
        "yesButton"
    );

const noButton =
    document.getElementById(
        "noButton"
    );

const answerMessage =
    document.getElementById(
        "answerMessage"
    );


/* =========================================
   MUSIC
========================================= */

const loveSong =
    document.getElementById(
        "loveSong"
    );


/* =========================================
   SCREEN CHANGE
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
   START WEBSITE
========================================= */

startButton.addEventListener(
    "click",
    function () {

        showScreen(
            scratchScreen
        );


        /*
          Start music after
          user interaction.
        */

        loveSong.volume = 0.45;

        loveSong
            .play()
            .catch(() => {

                console.log(
                    "Music autoplay blocked."
                );

            });


        setupScratch();

    }
);


/* =========================================
   SCRATCH CARD
========================================= */

const scratchCanvas =
    document.getElementById(
        "scratchCanvas"
    );

const scratchCtx =
    scratchCanvas.getContext(
        "2d"
    );


const scratchStatus =
    document.getElementById(
        "scratchStatus"
    );


let isDrawing = false;

let scratchComplete = false;

let lastPercentage = 0;


/* =========================================
   SETUP SCRATCH
========================================= */

function setupScratch() {

    const rect =
        scratchCanvas
            .getBoundingClientRect();


    scratchCanvas.width =
        Math.floor(rect.width);

    scratchCanvas.height =
        Math.floor(rect.height);


    /*
      Pink scratch layer
    */

    scratchCtx.globalCompositeOperation =
        "source-over";


    const gradient =
        scratchCtx.createLinearGradient(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );


    gradient.addColorStop(
        0,
        "#ffd2e9"
    );


    gradient.addColorStop(
        0.5,
        "#ff72b3"
    );


    gradient.addColorStop(
        1,
        "#e91d78"
    );


    scratchCtx.fillStyle =
        gradient;


    scratchCtx.fillRect(
        0,
        0,
        scratchCanvas.width,
        scratchCanvas.height
    );


    /*
      Main text
    */

    scratchCtx.fillStyle =
        "white";


    scratchCtx.textAlign =
        "center";


    scratchCtx.textBaseline =
        "middle";


    scratchCtx.font =
        "bold 28px Arial";


    scratchCtx.fillText(
        "SCRATCH ME ❤️",
        scratchCanvas.width / 2,
        scratchCanvas.height / 2
    );


    scratchCtx.font =
        "17px Arial";


    scratchCtx.fillText(
        "Your surprise is waiting...",
        scratchCanvas.width / 2,
        scratchCanvas.height / 2 + 42
    );


    scratchComplete =
        false;


    lastPercentage =
        0;


    scratchStatus.innerText =
        "Scratch: 0%";

}


/* =========================================
   POSITION
========================================= */

function getPointerPosition(event) {

    const rect =
        scratchCanvas
            .getBoundingClientRect();


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
        !isDrawing ||
        scratchComplete
    ) {

        return;

    }


    event.preventDefault();


    const position =
        getPointerPosition(
            event
        );


    scratchCtx.globalCompositeOperation =
        "destination-out";


    scratchCtx.beginPath();


    scratchCtx.arc(
        position.x,
        position.y,
        35,
        0,
        Math.PI * 2
    );


    scratchCtx.fill();


    calculateScratch();

}


/* =========================================
   CALCULATE %
========================================= */

function calculateScratch() {

    const imageData =
        scratchCtx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );


    const pixels =
        imageData.data;


    let transparentPixels =
        0;


    /*
      Check every 16th pixel.
      This keeps mobile smooth.
    */

    for (
        let i = 3;
        i < pixels.length;
        i += 16
    ) {

        if (
            pixels[i] === 0
        ) {

            transparentPixels++;

        }

    }


    const totalPixels =
        pixels.length / 16;


    const percentage =
        Math.floor(
            (
                transparentPixels /
                totalPixels
            ) * 100
        );


    if (
        percentage !==
        lastPercentage
    ) {

        lastPercentage =
            percentage;


        scratchStatus.innerText =
            "Scratch: " +
            percentage +
            "%";

    }


    /*
      Unlock at 55%
    */

    if (
        percentage >= 55 &&
        !scratchComplete
    ) {

        scratchComplete =
            true;


        finishScratch();

    }

}


/* =========================================
   MOUSE EVENTS
========================================= */

scratchCanvas.addEventListener(
    "mousedown",
    function () {

        isDrawing = true;

    }
);


scratchCanvas.addEventListener(
    "mouseup",
    function () {

        isDrawing = false;

    }
);


scratchCanvas.addEventListener(
    "mouseleave",
    function () {

        isDrawing = false;

    }
);


scratchCanvas.addEventListener(
    "mousemove",
    scratch
);


/* =========================================
   TOUCH EVENTS
========================================= */

scratchCanvas.addEventListener(
    "touchstart",
    function () {

        isDrawing = true;

    },
    {
        passive: false
    }
);


scratchCanvas.addEventListener(
    "touchend",
    function () {

        isDrawing = false;

    },
    {
        passive: false
    }
);


scratchCanvas.addEventListener(
    "touchcancel",
    function () {

        isDrawing = false;

    },
    {
        passive: false
    }
);


scratchCanvas.addEventListener(
    "touchmove",
    scratch,
    {
        passive: false
    }
);


/* =========================================
   SCRATCH COMPLETE
========================================= */

function finishScratch() {

    /*
      Remove scratch layer
    */

    scratchCtx.clearRect(
        0,
        0,
        scratchCanvas.width,
        scratchCanvas.height
    );


    scratchStatus.innerText =
        "❤️ SURPRISE UNLOCKED ❤️";


    /*
      PARTY POP SOUND
    */

    playPartySound();


    /*
      Fireworks sound
    */

    setTimeout(
        function () {

            playFireworkSound();

        },
        150
    );


    /*
      Fireworks
    */

    launchFireworks();


    /*
      Birthday message after
      fireworks
    */

    setTimeout(
        function () {

            showScreen(
                birthdayScreen
            );

        },
        5200
    );

}


/* =========================================
   PARTY POP SOUND
========================================= */

function playPartySound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const audioContext =
            new AudioContext();


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.type =
            "sawtooth";


        oscillator.frequency.setValueAtTime(
            180,
            audioContext.currentTime
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            40,
            audioContext.currentTime + 0.35
        );


        gain.gain.setValueAtTime(
            0.5,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.35
        );


        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );


        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + 0.35
        );


    } catch (error) {

        console.log(
            "Party sound error",
            error
        );

    }

}


/* =========================================
   FIREWORK SOUND
========================================= */

function playFireworkSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const audioContext =
            new AudioContext();


        const duration =
            0.7;


        const buffer =
            audioContext.createBuffer(
                1,
                audioContext.sampleRate *
                duration,
                audioContext.sampleRate
            );


        const data =
            buffer.getChannelData(0);


        /*
          White noise
        */

        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            data[i] =
                Math.random() * 2 - 1;

        }


        const source =
            audioContext.createBufferSource();


        const gain =
            audioContext.createGain();


        source.buffer =
            buffer;


        gain.gain.setValueAtTime(
            0.5,
            audioContext.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime +
            duration
        );


        source.connect(gain);

        gain.connect(
            audioContext.destination
        );


        source.start();

    } catch (error) {

        console.log(
            "Firework sound error",
            error
        );

    }

}


/* =========================================
   FIREWORKS
========================================= */

const fireworksCanvas =
    document.getElementById(
        "fireworksCanvas"
    );


const fireworksCtx =
    fireworksCanvas.getContext(
        "2d"
    );


let particles = [];


function resizeFireworks() {

    fireworksCanvas.width =
        window.innerWidth;

    fireworksCanvas.height =
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
    y,
    amount = 80
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
        i < amount;
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

            size:
                Math.random() *
                12 + 16,

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
   FIREWORK ANIMATION
========================================= */

function animateFireworks() {

    fireworksCtx.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
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


            fireworksCtx.globalAlpha =
                particle.life / 100;


            fireworksCtx.font =
                particle.size +
                "px Arial";


            fireworksCtx.fillText(
                particle.emoji,
                particle.x,
                particle.y
            );

        }
    );


    fireworksCtx.globalAlpha =
        1;


    if (
        particles.length > 0
    ) {

        requestAnimationFrame(
            animateFireworks
        );

    } else {

        fireworksCanvas.style.display =
            "none";

    }

}


/* =========================================
   LAUNCH FIREWORKS
========================================= */

function launchFireworks() {

    fireworksCanvas.style.display =
        "block";


    particles = [];


    createFirework(
        window.innerWidth * 0.20,
        window.innerHeight * 0.28
    );


    createFirework(
        window.innerWidth * 0.50,
        window.innerHeight * 0.22
    );


    createFirework(
        window.innerWidth * 0.80,
        window.innerHeight * 0.30
    );


    setTimeout(
        function () {

            createFirework(
                window.innerWidth * 0.35,
                window.innerHeight * 0.20
            );

        },
        450
    );


    setTimeout(
        function () {

            createFirework(
                window.innerWidth * 0.65,
                window.innerHeight * 0.25
            );

        },
        850
    );


    animateFireworks();

}


/* =========================================
   BIRTHDAY → PROPOSAL
========================================= */

birthdayContinue.addEventListener(
    "click",
    function () {

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
    function () {

        showScreen(
            finalScreen
        );

    }
);


/* =========================================
   SEND RESULT TO FORMSPREE
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
        "formAnswer"
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
                dateStyle:
                    "full",

                timeStyle:
                    "long"
            }
        );


    fetch(
        form.action,
        {

            method:
                "POST",

            body:
                new FormData(form),

            headers: {

                "Accept":
                    "application/json"

            }

        }
    )
    .then(
        function (response) {

            if (
                response.ok
            ) {

                console.log(
                    "Result sent successfully ❤️"
                );

            } else {

                console.log(
                    "Formspree error."
                );

            }

        }
    )
    .catch(
        function (error) {

            console.log(
                "Email error:",
                error
            );

        }
    );

}


/* =========================================
   YES BUTTON
========================================= */

yesButton.addEventListener(
    "click",
    function () {

        /*
          EMAIL RESULT
        */

        sendResult(
            "❤️ YES",
            "She accepted the love proposal! ❤️💍"
        );


        /*
          MESSAGE
        */

        answerMessage.innerHTML =

            "❤️ SHE SAID YES! ❤️<br><br>" +

            "இனிமேல் என் கதையின்<br>" +

            "அழகான கதாபாத்திரம்<br>" +

            "நீ தான்... 💍💕";


        /*
          BIG CELEBRATION
        */

        launchFireworks();


        setTimeout(
            launchFireworks,
            500
        );


        setTimeout(
            launchFireworks,
            1000
        );


        setTimeout(
            launchFireworks,
            1500
        );


        /*
          Heart burst
        */

        createHeartBurst();

    }
);


/* =========================================
   NO BUTTON
========================================= */

noButton.addEventListener(
    "click",
    function () {

        sendResult(
            "💔 NO",
            "She clicked the NO button."
        );


        answerMessage.innerHTML =

            "🥺 Are you sure?<br>" +

            "ஒருமுறை நன்றாக யோசித்துப் பாரு... ❤️";


        /*
          Little heart effect
        */

        createHeartBurst();

    }
);


/* =========================================
   HEART BURST
========================================= */

function createHeartBurst() {

    const hearts = [

        "❤️",
        "💖",
        "💕",
        "💗",
        "💓",
        "💝"

    ];


    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const heart =
            document.createElement(
                "div"
            );


        heart.className =
            "floating-heart";


        heart.innerText =
            hearts[
                Math.floor(
                    Math.random() *
                    hearts.length
                )
            ];


        heart.style.left =
            Math.random() * 100 +
            "%";


        heart.style.fontSize =
            Math.random() * 25 +
            20 +
            "px";


        heart.style.animationDuration =
            Math.random() * 3 +
            3 +
            "s";


        document
            .getElementById(
                "heartsContainer"
            )
            .appendChild(
                heart
            );


        setTimeout(
            function () {

                heart.remove();

            },
            7000
        );

    }

}


/* =========================================
   CONTINUOUS FLOATING HE
