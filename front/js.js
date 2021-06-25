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

        for (let i = 1; i <= 4; i++) {
            let div = createNode('div');
            desafio.resp_certa == i ? (
                div.innerHTML = `<div onClick="alert('Achou!')" class="btn">${desafio["resp_" + i]}</div>`
            ) : (
                div.innerHTML = `<div class="btn">${desafio["resp_" + i]}</div>`
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

fetch("http://localhost:3000/desafios")
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