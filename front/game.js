const game = {
    // Configuração do game
    cores: 5,
    relogio: 20,
    pontos: 0,
    timer: null,
    // host: "https://gamedevlearn.herokuapp.com", // origem do json desafio, uso local "http://localhost:5500"
    // host: "http://localhost:5500",
    certoMsg: `<h1>Você Acertou!</h1><button class="msgbox__btn" onclick="game.ini(false)">Nova Pergunta</button><p>Quantos pontos você consegue fazer antes de morrer?</p>`,
    morteMsg: `<h1>Você Morreu!</h1><button class="msgbox__btn" onclick="game.ini(true)">Começar de novo!</button><p>Não desanime, tente de novo! Mas salve seus pontos!</p><div class="putrank"><input type="text" id="nickRank" placeholder="Seu nick aqui"><button onclick="game.rankPut()">Salvar</button></div>`,
    // Elementos manipulados durante o game
    SOM: document.getElementById("audio"),
    VID: document.getElementById("video"),
    MSGBOX: document.getElementById("msgbox"),
    BOX: document.getElementsByClassName("box")[0],
    PONTO: document.getElementsByClassName("status__pontos")[0],
    REL: document.getElementsByClassName("status__relogio")[0],
    CORE: document.getElementsByClassName("status__coracao")[0],
    PERGUNTA: document.getElementsByClassName("pergunta")[0],
    RESPOSTA: document.getElementsByClassName("resposta")[0],
    RANK: document.getElementsByClassName("ranking")[0],
    nd: function (element) { return document.createElement(element); },
    ap: function (parent, el) { return parent.appendChild(el); },
    ini: function (prop) {
        // Executa som de inicio, insere gif animado de carregamento, busca json do DB, envia para a função de renderizar o desafio
        this.pong.plin();
        this.MSGBOX.innerHTML = `<img src="load.gif" alt="Gif Carregando">`;
        prop ? (this.cores = 5, this.CORE.innerHTML = 5, this.pontos = 0, this.PONTO.innerHTML = 0) : 0;
        fetch(this.host + "/desafios/aleatorio")
            .then((resp) => resp.json())
            .then(x => this.geraDesfio(x))
            .catch(function (error) {
                console.log(error);
            });
        this.rankGet();
    },
    rankGet: function name(nome) {
        // Puxa ranking
        this.RANK.innerHTML = `<img src="load.gif" alt="Gif Carregando">`;
        fetch(this.host + "/ranking")
            .then((resp) => resp.json())
            .then(function (data) {
                game.RANK.innerHTML = "";
                return data.map(function (jogador) {
                    jogador.nome == nome ? (
                        game.RANK.innerHTML += `<div class="pAtivo">${jogador.nome}</div><div class="pAtivo">${jogador.pontos}</div>`
                    ) : (
                        game.RANK.innerHTML += `<div>${jogador.nome}</div><div>${jogador.pontos}</div>`
                    );
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        this.RANK.style.display = "flex";
    },
    rankPut: function () {
        // Envia
        const nome = document.getElementById("nickRank").value;
        if (!nome) {
            return alert("Faltou escrever seu apelido!");
        }
        const data = new URLSearchParams();
        data.append("nome", nome);
        data.append("pontos", this.pontos + 1);
        fetch(this.host + "/rankingPost", { method: 'POST', body: data })
            .then(response => response.text())
            .then((resp) => {
                document.getElementById("msgbox").innerHTML = resp;
                game.rankGet(nome);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    geraDesfio: function (desafios) {
        // Desliga a box da mensagem e reinicia divs
        this.MSGBOX.className = "msgbox__none";
        this.PERGUNTA.innerHTML = "";
        this.RESPOSTA.innerHTML = "";
        // Insere pergunta
        this.PERGUNTA.innerHTML = `${desafios[0].pergunta}`;
        // Insere respostas em ordem randomica.
        const resps = [0, 1, 2, 3]; // array para randomizar
        for (let i = 0; i < 4; i++) {
            // Randomizando
            const el = resps[Math.floor(Math.random() * resps.length)] // pega um randomico
            const ind = resps.indexOf(el);
            resps.splice(ind, 1); // remove o randomico para não se repetir
            //Botão da respota
            const btn = this.nd('button');
            btn.className = `btn`;
            btn.id = "btn" + el;
            btn.innerHTML = `${desafios[0]["resp_" + el]}`;
            btn.addEventListener("mouseout", () => this.pong.ping());
            btn.addEventListener("mousedown", () => game.corrigir(el), { once: true });
            this.ap(this.RESPOSTA, btn);
        }
        // Mostra o jogo, inicia vídeo, animação do background e contagem de tempo.
        this.BOX.style.display = "block";
        this.RANK.style.display = "flex";
        this.trocarVideo();
        document.body.style.animation = "";
        setTimeout(() => document.body.style.animation = "back_tempo 20s ease", 25);
        this.relogio = 20;
        this.contagem();
    },
    contagem: function () {
        this.timer = setTimeout(() => {
            this.relogio--;
            this.REL.innerHTML = this.relogio;
            this.relogio < 1 ? (
                // Morte por esgotamento do tempo, fim de jogo.
                this.trocarVideo("morte.mp4"),
                this.BOX.style.display = "none",
                document.body.style.animationPlayState = "paused",
                this.MSGBOX.innerHTML = this.morteMsg,
                this.MSGBOX.className = "msgbox__morte"
            ) : (
                this.pong.ping("tic"),
                this.contagem()
            )
        }, 1000);
    },
    corrigir: function (resp) {
        //Separado para agilizar audio do botão
        resp === 0 ? (this.SOM.src = "tada.mp3") : (this.SOM.src = "buzz.mp3");
        this.SOM.play();

        resp === 0 ? (
            // Resposta correta: exibe vídeo, adiciona uma vida, soma os pontos, exibe caixa de mensagem.
            clearTimeout(this.timer),
            this.trocarVideo("star.mp4"),
            document.body.style.animationPlayState = "paused",
            this.cores++,
            this.CORE.innerHTML = this.cores,
            this.pontos += this.relogio,
            this.PONTO.innerHTML = this.pontos,
            this.MSGBOX.innerHTML = this.certoMsg,
            this.BOX.style.display = "none",
            this.RANK.style.display = "none",
            this.MSGBOX.className = "msgbox"
        ) : (
            // Resposta errada: tira uma vida
            this.cores--,
            this.CORE.innerHTML = this.cores,
            document.getElementById("btn" + resp).className = "btn__errado",
            document.getElementById("btn" + resp).removeEventListener("mouseout", () => this.pong.ping())
        )

        if (this.cores < 1) {
            // Caso de morte por esgotamento de vidas
            this.BOX.style.display = "none";
            clearTimeout(this.timer);
            this.trocarVideo("morte.mp4");
            document.body.style.animationPlayState = "paused";
            this.MSGBOX.innerHTML = this.morteMsg;
            this.MSGBOX.className = "msgbox__morte"
        }
    },
    trocarVideo: function (video) {
        // Videos de fundo, de vitória e derrota.
        if (video === "ini") {
            this.VID.src = "sonic.mp4";
        } else if (video) {
            this.VID.src = video;
        } else {
            // Troca para um vídeo aleatório sem repetir
            const video_list = ["mario.webm", "sonic.mp4", "zelda.mp4", "io.mp4"];
            const x = this.VID.src.slice(this.VID.src.lastIndexOf("/") + 1); // Pega o vídeo atual
            video_list.splice(video_list.indexOf(x), 1); // Remove o vídeo atual da array
            this.VID.src = video_list[Math.floor(Math.random() * video_list.length)]; // Seta um vídeo diferente
        }
        this.VID.volume = 0.3;
        this.VID.play();
    },
    pong: {
        // Sons do jogo
        fsnd: {
            c4: 261.6,
            d4: 293.7,
            e4: 329.6,
            f4: 349.2,
            g4: 392.0,
            a4: 440.0,
            b4: 493.9,
            tic: 800
        },
        ping: function (f) {
            f = this.fsnd[f] || this.fsnd.c4;
            const context = new AudioContext();
            const oscillator = context.createOscillator();
            const contextGain = context.createGain();
            oscillator.frequency.value = f;
            oscillator.type = 'sine';
            oscillator.connect(contextGain);
            contextGain.connect(context.destination);
            oscillator.start(0);
            contextGain.gain.exponentialRampToValueAtTime(
                0.0000001, context.currentTime + 0.5
            );
        },
        plin: function () {
            this.ping("c4");
            this.ping("d4");
            this.ping("ec");
            this.ping("f4");
        }
    }
}

window.onload = () => game.rankGet();