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

function geraDesfio(desafios) {
    const h1 = document.getElementById('pergunta');
    const rs = document.getElementById('respostas');
    desafios.map(function (desafio) {
        let span = createNode("span");
        span.innerHTML = `${desafio.enunciado}`;
        append(h1, span);

        let resps = [0, 1, 2, 3]; // array para randomizar
        for (let i = 0; i < 4; i++) {
            let el = resps[Math.floor(Math.random() * resps.length)] // pega um randomico
            const ind = resps.indexOf(el); //ach ao indice
            resps.splice(ind, 1); // remove o randomico
            let btn = createNode('button');
            // define a resposta certa, alert temporário
            desafio.resp_certa == el ? (
                btn.className = `btn`,
                btn.innerHTML = `${desafio["resp_" + el]}`,
                btn.onmouseout = stop, //uma forma de fazer
                btn.addEventListener("click", function () { stop() }, false) // outra forma
            ) : (
                btn.className = `btn`,
                btn.innerHTML = `${desafio["resp_" + el]}`,
                btn.onmouseout = stop
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

lista_acordes = ["m.mp4"];

function tocar() {
    var som = document.getElementById("audio");
    som.src = lista_acordes[0];
    som.play();
    console.log(som);
}