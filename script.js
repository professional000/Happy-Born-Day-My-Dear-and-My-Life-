/* =====================================
   ELEMENTS
===================================== */

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


const openGiftButton =
    document.getElementById("openGiftButton");

const birthdayContinue =
    document.getElementById("birthdayContinue");

const proposalButton =
    document.getElementById("proposalButton");

const yesButton =
    document.getElementById("yesButton");

const noButton =
    document.getElementById("noButton");

const loveSong =
    document.getElementById("loveSong");


/* =====================================
   SCREEN CHANGE
===================================== */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(function(item) {

            item.classList.remove("active");

        });

    screen.classList.add("active");

    window.scrollTo(0,0);
}


/* =====================================
   MUSIC
===================================== */

function startMusic() {

    loveSong.volume = 0.45;

    const promise =
        loveSong.play();

    if (promise !== undefined) {

        promise
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
}


/* =====================================
   OPEN GIFT
===================================== */

openGiftButton.addEventListener(
    "click",
    function() {

        console.log(
            "Gift opened 🎁"
        );

        startMusic();

        showScreen(
            scratchScreen
        );

        setTimeout(
            setupScratch,
            150
        );

        startFloatingHearts();
    }
);


/* =====================================
   SCRATCH
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


let isDrawing = false;

let scratchComplete = false;

let scratchPercentage = 0;


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
        scratchCanvas.height / 2 - 20
    );


    scratchCtx.font =
        "16px Arial";


    scratchCtx.fillText(
        "Your surprise is waiting...",
        scratchCanvas.width / 2,
        scratchCanvas.height / 2 + 25
    );


    scratchComplete = false;

    scratchPercentage = 0;

    scratchStatus.innerText =
        "Scratch: 0%";
}


/* =====================================
   POSITION
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
   SCRATCH
===================================== */

function scratch(event) {

    if (
        !isDrawing ||
        scratchComplete
    ) {

        return;
    }


    event.preventDefault();


    const position =
        getPosition(event);


    scratchCtx.globalCompositeOperation =
        "destination-out";


    scratchCtx.beginPath();


    scratchCtx.arc(
        position.x,
        position.y,
        42,
        0,
        Math.PI * 2
    );


    scratchCtx.fill();


    calculateScratch();
}


/* =====================================
   CALCULATE
===================================== */

function calculateScratch() {

    const width =
        scratchCanvas.width;

    const height =
        scratchCanvas.height;


    const imageData =
        scratchCtx.getImageData(
            0,
            0,
            width,
            height
        );


    const pixels =
        imageData.data;


    let transparent = 0;

    let total = 0;


    /*
      Sample every 20th pixel
    */

    for (
        let i = 3;
        i < pixels.length;
        i += 80
    ) {

        total++;

        if (
            pixels[i] < 50
        ) {

            transparent++;
        }
    }


    scratchPercentage =
        Math.floor(
            transparent /
            total *
            100
        );


    scratchStatus.innerText =
        "Scratch: " +
        scratchPercentage +
        "%";


    if (
        scratchPercentage >= 45 &&
        !scratchComplete
    ) {

        scratchComplete = true;

        finishScratch();
    }
}


/* =====================================
   MOUSE
===================================== */

scratchCanvas.addEventListener(
    "mousedown",
    function(event) {

        event.preventDefault();

        isDrawing = true;

        scratch(event);
    }
);


scratchCanvas.addEventListener(
    "mousemove",
    scratch
);


window.addEventListener(
    "mouseup",
    function() {

        isDrawing = false;
    }
);


/* =====================================
   TOUCH
===================================== */

scratchCanvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        isDrawing = true;

        scratch(event);

    },
    {
        passive:false
    }
);


scratchCanvas.addEventListener(
    "touchmove",
    scratch,
    {
        passive:false
    }
);


scratchCanvas.addEventListener(
    "touchend",
    function(event) {

        event.preventDefault();

        isDrawing = false;

    },
    {
        passive:false
    }
);


/* =====================================
   FINISH SCRATCH
===================================== */

function finishScratch() {

    scratchCtx.clearRect(
        0,
        0,
        scratchCanvas.width,
        scratchCanvas.height
    );


    scratchStatus.innerText =
        "❤️ SURPRISE UNLOCKED ❤️";


    /*
      Party POP
    */

    partyPopSound();


    /*
      Fireworks
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
      Birthday page
    */

    setTimeout(
        function() {

            showScreen(
                birthdayScreen
            );

        },
        4000
    );
}


/* =====================================
   PARTY POP SOUND
===================================== */

function partyPopSound() {

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
            180,
            audio.currentTime
        );


        oscillator.frequency.exponentialRampToValueAtTime(
            40,
            audio.currentTime + 0.35
        );


        gain.gain.setValueAtTime(
            0.5,
            audio.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audio.currentTime + 0.35
        );


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.35
        );

    } catch(error) {

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


        const duration = 0.5;


        const buffer =
            audio.createBuffer(
                1,
                audio.sampleRate * duration,
                audio.sampleRate
            );


        const data =
            buffer.getChannelData(0);


        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            data[i] =
                Math.random() * 2 - 1;
        }


        const source =
            audio.createBufferSource();


        const gain =
            audio.createGain();


        source.buffer =
            buffer;


        gain.gain.setValueAtTime(
            0.45,
            audio.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audio.currentTime + duration
        );


        source.connect(gain);

        gain.connect(
            audio.destination
        );


        source.start();

    } catch(error) {

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


let particles = [];


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
   HEART FIREWORK
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
            Math.PI * 2;


        const speed =
            Math.random() * 6 + 2;


        particles.push({

            x:x,

            y:y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            gravity:0.08,

            life:100,

            size:
                Math.random() *
                14 + 14,

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
   FIREWORK ANIMATION
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
            function(p) {

                return p.life > 0;

            }
        );


    particles.forEach(
        function(p) {

            p.x += p.vx;

            p.y += p.vy;

            p.vy += p.gravity;

            p.life -= 1;


            fireworksCtx.globalAlpha =
                p.life / 100;


            fireworksCtx.font =
                p.size + "px Arial";


            fireworksCtx.fillText(
                p.emoji,
                p.x,
                p.y
            );
        }
    );


    fireworksCtx.globalAlpha = 1;


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


/* =====================================
   LAUNCH
===================================== */

function launchFireworks() {

    fireworksCanvas.style.display =
        "block";


    fireworkSound();


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
   FORMSPREE
===================================== */

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
            "en-IN"
        );


    fetch(
        form.action,
        {

            method:"POST",

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

            if (response.ok) {

                console.log(
                    "Formspree email sent ❤️"
                );

            } else {

                console.log(
                    "Formspree failed"
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
   YES
===================================== */

yesButton.addEventListener(
    "click",
    function() {

        sendResult(
            "❤️ YES",
            "She accepted the love proposal! ❤️💍"
        );


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
          Fireworks
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


        heartBurst();
    }
);


/* =====================================
   NO
===================================== */

noButton.addEventListener(
    "click",
    function() {

        sendResult(
            "💔 NO",
            "She clicked the NO button."
        );


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
        "💝",
        "💘"
    ];


    for (
        let i = 0;
        i < 40;
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
            Math.random() * 100 + "%";


        heart.style.fontSize =
            Math.random() * 20 +
            18 + "px";


        heart.style.animationDuration =
            Math.random() * 3 +
            2 + "s";


        document
            .getElementById(
                "heartsContainer"
            )
            .appendChild(heart);


        setTimeout(
            function() {

                heart.remove();

            },
            5000
        );
    }
}


/* =====================================
   CONTINUOUS HEARTS
===================================== */

function startFloatingHearts() {

    setInterval(
        function() {

            const heart =
                document.createElement(
                    "div"
                );


            heart.className =
                "floating-heart";


            const hearts = [
                "❤️",
                "💕",
                "💖",
                "💗"
            ];


            heart.innerText =
                hearts[
                    Math.floor(
                        Math.random() *
                        hearts.length
                    )
                ];


            heart.style.left =
                Math.random() * 100 + "%";


            heart.style.fontSize =
                Math.random() * 18 +
                16 + "px";


            heart.style.animationDuration =
                Math.random() * 5 +
                5 + "s";


            document
                .getElementById(
                    "heartsContainer"
                )
                .appendChild(heart);


            setTimeout(
                function() {

                    heart.remove();

                },
                10000
            );

        },
        900
    );
    }
