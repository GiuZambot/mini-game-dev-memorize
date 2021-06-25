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
            log(resps.join());
            let el = resps[Math.floor(Math.random() * resps.length)] // pega um randomico
            log(`${el}`);
            const ind = resps.indexOf(el);
            log(ind);
            resps.splice(ind, 1); // remove o randomico pego
            let div = createNode('div');
            // define a resposta certa, alert temporário
            desafio.resp_certa == el ? (
                div.innerHTML = `<div onClick="alert('Achou!')" class="btn">${desafio["resp_" + el]}</div>`
            ) : (
                div.innerHTML = `<div class="btn">${desafio["resp_" + el]}</div>`
            );
            append(rs, div);
        }

        document.getElementById('carregando').innerHTML = "";

    });
}

// fetch(`../package.json`)
//     .then((resp) => resp.json())
//     .then(function (data) {
//         tst.innerHTML = data.name;
//         append(log, tst);
//     });

// fetch(`http://localhost:3000/users`)
//     .then((resp) => resp.json())
//     .then(function (data) {
//         tst.innerHTML = data[0].name;
//         append(log, tst);
//     });

fetch("http://localhost:3000/desafios/aleatorio")
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

// const data = await(await fetch(`./desafios`)).json();
// console.log(data);
// document.getElementById("insert").innerHTML = "000";
// document.getElementById("insert").innerHTML = data;