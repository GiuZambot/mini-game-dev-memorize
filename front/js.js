function log(msg) {
    const log = document.getElementById("log");
    let div = createNode("div");
    div.innerHTML = `${msg}`;
    append(log, div);
}

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function corrigir(resp) {
    const som = document.getElementById("audio");
    resp === 1 ? (
        trocarVideo("star.mp4"),
        som.src = "tada.mp3",
        document.getElementById('msgbox').style.display = "flex"
    ) : (
        som.src = "buzz.mp3"
    )
    som.play();
}

function novaPergunta() {
    document.location.reload();
}

video_list = ["mario.webm", "sonic.mp4", "zelda.mp4"];
function trocarVideo(video) {
    const vid = document.getElementById("video");
    const atual = [];
    atual.push(...video_list);
    let x = null;
    if (video === "ini") {
        vid.src = "sonic.mp4";
    } else if (video) {
        vid.src = video;
    } else {
        x = vid.src.slice(vid.src.lastIndexOf("/") + 1);
        atual.splice(atual.indexOf(x), 1);
        vid.src = atual[Math.floor(Math.random() * atual.length)];
    }
    vid.volume = 0.7;
    vid.play();
}

function geraDesfio(desafios) {
    const h1 = document.getElementById('pergunta');
    const rs = document.getElementById('respostas');
    desafios.map(function (desafio) {
        let span = createNode("span");
        span.innerHTML = `${desafio.pergunta}`;
        append(h1, span);

        let resps = [0, 1, 2, 3]; // array para randomizar
        for (let i = 0; i < 4; i++) {
            let el = resps[Math.floor(Math.random() * resps.length)] // pega um randomico
            const ind = resps.indexOf(el); //ach ao indice
            resps.splice(ind, 1); // remove o randomico
            let btn = createNode('button');
            // define a resposta certa
            el === 0 ? (
                btn.className = `btn`,
                btn.innerHTML = `${desafio["resp_" + el]}`,
                btn.onmouseout = stop, //uma forma de fazer
                btn.addEventListener("click", function () { corrigir(1) }, false) // outra forma
            ) : (
                btn.className = `btn`,
                btn.innerHTML = `${desafio["resp_" + el]}`,
                btn.onmouseout = stop,
                btn.addEventListener("click", function () { corrigir() }, false)
            );
            append(rs, btn);
        }
        document.getElementById('carregando').innerHTML = "";
        document.getElementById('box').style.display = "block";
        const box = document.getElementById("btn1");
    });
}

fetch("http://localhost:5500/desafios/aleatorio")
    .then((resp) => resp.json())
    .then(x => geraDesfio(x))
    .catch(function (error) {
        console.log(error);
    });

// .then(function (data) {
//     // let authors = data;
//     return authors.map(function (author) {
//         let li = createNode('li');
//         let span = createNode('span');
//         span.innerHTML = `${author.name} ${author.email}`;
//         append(li, span);
//         append(ul, li);
//     })
// })



const c4 = 261.6,
    d4 = 293.7,
    e4 = 329.6,
    f4 = 349.2,
    g4 = 392.0,
    a4 = 440.0,
    b4 = 493.9;


let context,
    oscillator,
    contextGain,
    x = 1,
    type = 'sine',
    frequency;

function start() {
    context = new AudioContext();
    oscillator = context.createOscillator();
    contextGain = context.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    oscillator.connect(contextGain);
    contextGain.connect(context.destination);
    oscillator.start(0);
}

function stop() {
    start();
    contextGain.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + x
    )
}

frequency = c4;
stop();
frequency = d4;
stop();
frequency = c4;
stop();
frequency = e4;
stop();



window.onload = trocarVideo("ini");