/* =====================================
   GET ELEMENTS
===================================== */

const startScreen =
    document.getElementById(
        "startScreen"
    );

const scratchScreen =
    document.getElementById(
        "scratchScreen"
    );

const birthdayScreen =
    document.getElementById(
        "birthdayScreen"
    );

const proposalScreen =
    document.getElementById(
        "proposalScreen"
    );

const finalScreen =
    document.getElementById(
        "finalScreen"
    );


const openGiftButton =
    document.getElementById(
        "openGiftButton"
    );

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


const loveSong =
    document.getElementById(
        "loveSong"
    );


/* =====================================
   SCREEN FUNCTION
===================================== */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(function(item) {

            item.classList.remove(
                "active"
            );

        });


    screen.classList.add(
        "active"
    );


    window.scrollTo(
        0,
        0
    );

}


/* =====================================
   OPEN YOUR GIFT
===================================== */

openGiftButton.addEventListener(
    "click",
    function() {

        console.log(
            "Open Your Gift clicked"
        );


        /*
          Go to scratch screen
        */

        showScreen(
            scratchScreen
        );


        /*
          Start song
        */

        loveSong.volume =
            0.45;


        const musicPromise =
            loveSong.play();


        if (
            musicPromise !== undefined
        ) {

            musicPromise
                .then(function() {

                    console.log(
                        "Music started ❤️"
                    );

                })
                .catch(function(error) {

                    console.log(
                        "Music blocked:",
                        error
                    );

                });

        }


        /*
          Setup scratch card
        */

        setTimeout(
            setupScratch,
            100
        );

    }
);


/* =====================================
   SCRATCH ELEMENTS
===================================== */

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


let isDrawing =
    false;

let scratchComplete =
    false;

let scratchStarted =
    false;


/* =====================================
   SETUP SCRATCH
===================================== */

function setupScratch() {

    const box =
        scratchCanvas.getBoundingClientRect();


    if (
        box.width === 0 ||
        box.height === 0
    ) {

        console.log(
            "Scratch canvas not ready"
        );

        setTimeout(
            setupScratch,
            200
        );

        return;

    }


    scratchCanvas.width =
        Math.floor(box.width);

    scratchCanvas.height =
        Math.floor(box.height);


    /*
      Scratch cover
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
        "#ffe0ef"
    );


    gradient.addColorStop(
        0.5,
        "#ff70b5"
    );


    gradient.addColorStop(
        1,
        "#e71978"
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
        "#ffffff";


    scratchCtx.textAlign =
        "center";


    scratchCtx.textBaseline =
        "middle";


    scratchCtx.font =
        "bold 28px Arial";


    scratchCtx.fillText(
        "SCRATCH ME ❤️",
        scratchCanvas.width / 2,
        scratchCanvas.height / 2 - 20
    );


    scratchCtx.font =
        "16px Arial";


    scratchCtx.fillText(
        "Your surprise is waiting...",
        scratchCanvas.width / 2,
        scratchCanvas.height / 2 + 25
    );


    scratchComplete =
        false;


    scratchStarted =
        false;


    scratchStatus.innerText =
        "Scratch: 0%";

}


/* =====================================
   GET POINTER POSITION
===================================== */

function getPosition(event) {

    const rect =
        scratchCanvas.getBoundingClientRect();


    let clientX;
    let clientY;


    if (
        event.touches &&
        event.touches.length
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
            clientX -
            rect.left,

        y:
            clientY -
            rect.top

    };

}


/* =====================================
   SCRATCH FUNCTION
===================================== */

function scratch(event) {

    if (
        !isDrawing ||
        scratchComplete
    ) {

        return;

    }


    event.preventDefault();


    scratchStarted =
        true;


    const position =
        getPosition(event);


    scratchCtx.globalCompositeOperation =
        "destination-out";


    scratchCtx.beginPath();


    scratchCtx.arc(
        position.x,
        position.y,
        38,
        0,
        Math.PI * 2
    );


    scratchCtx.fill();


    calculateScratch();

}


/* =====================================
   CALCULATE SCRATCH
===================================== */

function calculateScratch() {

    /*
      Read canvas pixels
    */

    const imageData =
        scratchCtx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );


    const pixels =
        imageData.data;


    let transparent =
        0;


    /*
      Sample pixels
    */

    for (
        let i = 3;
        i < pixels.length;
        i += 16
    ) {

        if (
            pixels[i] < 30
        ) {

            transparent++;

        }

    }


    const total =
        pixels.length / 16;


    const percentage =
        Math.floor(
            (
                transparent /
                total
            ) * 100
        );


    scratchStatus.innerText =
        "Scratch: " +
        percentage +
        "%";


    /*
      Unlock at 50%
    */

    if (
        percentage >= 50 &&
        !scratchComplete
    ) {

        scratchComplete =
            true;


        finishScratch();

    }

}


/* =====================================
   MOUSE EVENTS
===================================== */

scratchCanvas.addEventListener(
    "mousedown",
    function() {

        isDrawing =
            true;

    }
);


scratchCanvas.addEventListener(
    "mouseup",
    function() {

        isDrawing =
            false;

    }
);


scratchCanvas.addEventListener(
    "mouseleave",
    function() {

        isDrawing =
            false;

    }
);


scratchCanvas.addEventListener(
    "mousemove",
    scratch
);


/* =====================================
   TOUCH EVENTS
===================================== */

scratchCanvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        isDrawing =
            true;

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


scratchCanvas.addEventListener(
    "touchend",
    function(event) {

        event.preventDefault();

        isDrawing =
            false;

    },
    {
        passive: false
    }
);


/* =====================================
   FINISH SCRATCH
===================================== */

function finishScratch() {

    console.log(
        "Scratch completed 🎉"
    );


    /*
      Remove cover
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
      Party sound
    */

    partySound();


    /*
      Firework sound
    */

    setTimeout(
        fireworkSound,
        150
    );


    /*
      Fireworks
    */

    launchFireworks();


    /*
      More fireworks
    */

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
      Birthday screen
    */

    setTimeout(
        function() {

            showScreen(
                birthdayScreen
            );

        },
        4500
    );

}


/* =====================================
   PARTY POP SOUND
===================================== */

function partySound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const audio =
            new AudioContext();


        const oscillator =
            audio.createOscillator();


        const gain =
            audio.createGain();


        oscillator.type =
            "sawtooth";


        oscillator.frequency.setValueAtTime(
            220,
            audio.currentTime
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            35,
            audio.currentTime + 0.4
        );


        gain.gain.setValueAtTime(
            0.45,
            audio.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audio.currentTime + 0.4
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            audio.destination
        );


        oscillator.start();


        oscillator.stop(
            audio.currentTime + 0.4
        );

    }

    catch(error) {

        console.log(
            "Party sound error",
            error
        );

    }

}


/* =====================================
   FIREWORK SOUND
===================================== */

function fireworkSound() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const audio =
            new AudioContext();


        const duration =
            0.6;


        const buffer =
            audio.createBuffer(
                1,
                audio.sampleRate *
                duration,
                audio.sampleRate
            );


        const data =
            buffer.getChannelData(
                0
            );


        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            data[i] =
                Math.random() *
                2 -
                1;

        }


        const source =
            audio.createBufferSource();


        const gain =
            audio.createGain();


        source.buffer =
            buffer;


        gain.gain.setValueAtTime(
            0.5,
            audio.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audio.currentTime +
            duration
        );


        source.connect(
            gain
        );


        gain.connect(
            audio.destination
        );


        source.start();

    }

    catch(error) {

        console.log(
            "Firework sound error",
            error
        );

    }

}


/* =====================================
   FIREWORK CANVAS
===================================== */

const fireworksCanvas =
    document.getElementById(
        "fireworksCanvas"
    );


const fireworksCtx =
    fireworksCanvas.getContext(
        "2d"
    );


let particles =
    [];


/* =====================================
   RESIZE
===================================== */

function resizeCanvas() {

    fireworksCanvas.width =
        window.innerWidth;

    fireworksCanvas.height =
        window.innerHeight;

}


resizeCanvas();


window.addEventListener(
    "resize",
    resizeCanvas
);


/* =====================================
   CREATE HEART FIREWORK
===================================== */

function createFirework(
    x,
    y,
    amount = 70
) {

    const hearts = [

        "❤️",
        "💖",
        "💕",
        "💗",
        "💓",
        "💝",
        "💘"

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
            6 +
            2;


        particles.push({

            x:
                x,

            y:
                y,

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
                12 +
                14,

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


/* =====================================
   ANIMATE
===================================== */

function animateFireworks() {

    fireworksCtx.clearRect(
        0,
        0,
        fireworksCanvas.width,
        fireworksCanvas.height
    );


    particles =
        particles.filter(
            function(particle) {

                return particle.life > 0;

            }
        );


    particles.forEach(
        function(particle) {

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

    }

    else {

        fireworksCanvas.style.display =
            "none";

    }

}


/* =====================================
   LAUNCH FIREWORKS
===================================== */

function launchFireworks() {

    fireworksCanvas.style.display =
        "block";


    createFirework(
        window.innerWidth * 0.2,
        window.innerHeight * 0.3
    );


    createFirework(
        window.innerWidth * 0.5,
        window.innerHeight * 0.2
    );


    createFirework(
        window.innerWidth * 0.8,
        window.innerHeight * 0.3
    );


    animateFireworks();

}


/* =====================================
   BIRTHDAY → PROPOSAL
===================================== */

birthdayContinue.addEventListener(
    "click",
    function() {

        showScreen(
            proposalScreen
        );

    }
);


/* =====================================
   PROPOSAL → FINAL
===================================== */

proposalButton.addEventListener(
    "click",
    function() {

        showScreen(
            finalScreen
        );

    }
);


/* =====================================
   FORMSPREE RESULT
===================================== */

function sendResult(
    answer,
    message
) {

    const form =
        document.getElementById(
            "resultForm"
        );


    const formAnswer =
        document.getElementById(
            "formAnswer"
        );


    const formMessage =
        document.getElementById(
            "formMessage"
        );


    const formTime =
        document.getElementById(
            "formTime"
        );


    formAnswer.value =
        answer;


    formMessage.value =
        message;


    formTime.value =
        new Date().toLocaleString(
            "en-IN"
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
        function(response) {

            if (
                response.ok
            ) {

                console.log(
                    "Email sent successfully ❤️"
                );

            }

            else {

                console.log(
                    "Formspree error"
                );

            }

        }
    )
    .catch(
        function(error) {

            console.log(
                "Email error:",
                error
            );

        }
    );

}


/* =====================================
   YES BUTTON
===================================== */

yesButton.addEventListener(
    "click",
    function() {

        /*
          Send email
        */

        sendResult(
            "❤️ YES",
            "She accepted the love proposal! ❤️💍"
        );


        /*
          Message
        */

        document.getElementById(
            "answerMessage"
        ).innerHTML =

            "❤️ SHE SAID YES! ❤️" +

            "<br><br>" +

            "இனிமேல் என் கதையின்" +

            "<br>" +

            "அழகான கதாபாத்திரம்" +

            "<br>" +

            "நீ தான்... 💍💕";


        /*
          Celebration
        */

        launchFireworks();


        setTimeout(
            launchFireworks,
            400
        );


        setTimeout(
            launchFireworks,
            800
        );


        setTimeout(
            launchFireworks,
            1200
        );


        /*
          Hearts
        */

        heartBurst();

    }
);


/* =====================================
   NO BUTTON
===================================== */

noButton.addEventListener(
    "click",
    function() {

        /*
          Send email
        */

        sendResult(
            "💔 NO",
            "She clicked the NO button."
        );


        /*
          Message
        */

        document.getElementById(
            "answerMessage"
        ).innerHTML =

            "🥺 Are you sure?" +

            "<br><br>" +

            "ஒருமுறை நன்றாக யோசித்துப் பாரு... ❤️";


        heartBurst();

    }
);


/* =====================================
   HEART BURST
===================================== */

function heartBurst() {

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
        i < 30;
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
            Math.random() *
            100 +
            "%";


        heart.style.fontSize =
            Math.random() *
            20 +
            18 +
            "px";


        heart.style.animationDuration =
    
