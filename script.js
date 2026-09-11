// ======================================================
// EFEITOS SONOROS MODERNOS (Web Audio API - Sem arquivos externos)
// ======================================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function tocarSom(tipo) {
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const agora = audioCtx.currentTime;

    if (tipo === 'clique') {
        osc.frequency.setValueAtTime(400, agora);
        gain.gain.setValueAtTime(0.05, agora);
        gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.08);
        osc.start(agora);
        osc.stop(agora + 0.08);
    } else if (tipo === 'acerto') {
        osc.frequency.setValueAtTime(587.33, agora); // D5
        osc.frequency.setValueAtTime(880, agora + 0.1); // A5
        gain.gain.setValueAtTime(0.1, agora);
        gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.3);
        osc.start(agora);
        osc.stop(agora + 0.3);
    } else if (tipo === 'erro') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, agora);
        osc.frequency.setValueAtTime(100, agora + 0.15);
        gain.gain.setValueAtTime(0.1, agora);
        gain.gain.exponentialRampToValueAtTime(0.001, agora + 0.3);
        osc.start(agora);
        osc.stop(agora + 0.3);
    } else if (tipo === 'vitoria') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const o = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            o.connect(g);
            g.connect(audioCtx.destination);
            o.frequency.setValueAtTime(freq, agora + (i * 0.1));
            g.gain.setValueAtTime(0.1, agora + (i * 0.1));
            g.gain.exponentialRampToValueAtTime(0.001, agora + (i * 0.1) + 0.25);
            o.start(agora + (i * 0.1));
            o.stop(agora + (i * 0.1) + 0.25);
        });
    }
}

// ======================================================
// SISTEMA DE CONQUISTAS (LocalStorage)
// ======================================================
let livrosJogadosSet = JSON.parse(localStorage.getItem('livrosJogadosSet')) || [];
let conquistas = JSON.parse(localStorage.getItem('conquistasDiario')) || {
    especialista: false,
    voraz: false,
    podre: false
};

function atualizarbadgesUI() {
    if (conquistas.especialista) document.getElementById('badgeEspecialista').classList.add('desbloqueada');
    if (conquistas.voraz) document.getElementById('badgeVoraz').classList.add('desbloqueada');
    if (conquistas.podre) document.getElementById('badgePodre').classList.add('desbloqueada');
}
atualizarbadgesUI();

function verificarConquistas(pontosObtidos, totalPerguntas, livroId) {
    if (pontosObtidos === totalPerguntas) {
        conquistas.especialista = true;
    }
    if (pontosObtidos === 0) {
        conquistas.podre = true;
    }
    if (!livrosJogadosSet.includes(livroId)) {
        livrosJogadosSet.push(livroId);
        localStorage.setItem('livrosJogadosSet', JSON.stringify(livrosJogadosSet));
    }
    if (livrosJogadosSet.length >= 3) {
        conquistas.voraz = true;
    }
    localStorage.setItem('conquistasDiario', JSON.stringify(conquistas));
    atualizarbadgesUI();
}

// ======================================================
// MODO RABISCO (ESTILO DIÁRIO) TOGGLE
// ======================================================
const btnRabisco = document.getElementById("btnRabisco");
btnRabisco.addEventListener("click", () => {
    tocarSom('clique');
    document.body.classList.toggle("modo-rabisco");
    if(document.body.classList.contains("modo-rabisco")) {
        btnRabisco.textContent = "💻 Modo Normal";
    } else {
        btnRabisco.textContent = "✏️ Modo Diário";
    }
});

// ======================================================
// LIVRO SURPRESA (SORTEIO ALEATÓRIO)
// ======================================================
const btnSorteio = document.getElementById("btnSorteio");
const listaLivros = document.querySelectorAll(".livro");

btnSorteio.addEventListener("click", (e) => {
    e.preventDefault();
    tocarSom('clique');
    const randomIndex = Math.floor(Math.random() * listaLivros.length);
    const livroSorteado = listaLivros[randomIndex];

    // Remove destaque anterior se houver
    listaLivros.forEach(l => l.classList.remove("destaque-sorteio"));

    livroSorteado.scrollIntoView({ behavior: 'smooth', block: 'center' });
    livroSorteado.classList.add("destaque-sorteio");

    setTimeout(() => {
        livroSorteado.classList.remove("destaque-sorteio");
    }, 3500);
});

// ======================================================
// PESQUISA INTELIGENTE
// ======================================================
const campoPesquisa = document.getElementById("campoPesquisa");
const botaoPesquisa = document.getElementById("botaoPesquisa");
const nenhumResultado = document.getElementById("nenhumResultado");
const quantidadeLivros = document.getElementById("quantidadeLivros");
const textoResultado = document.getElementById("textoResultado");

function pesquisarLivros() {
    const texto = campoPesquisa.value.toLowerCase().trim();
    let encontrados = 0;

    listaLivros.forEach(function(livro) {
        const titulo = livro.querySelector("h3").textContent.toLowerCase();
        const numero = livro.querySelector(".numero").textContent.toLowerCase();
        const autor = livro.querySelector(".autor").textContent.toLowerCase();
        const informacoes = titulo + " " + numero + " " + autor;

        if (informacoes.includes(texto)) {
            livro.style.display = "";
            encontrados++;
        } else {
            livro.style.display = "none";
        }
    });

    quantidadeLivros.textContent = encontrados + (encontrados === 1 ? " livro" : " livros");

    if (encontrados === 0) {
        nenhumResultado.style.display = "block";
        textoResultado.textContent = "Nenhum livro corresponde à sua pesquisa.";
    } else {
        nenhumResultado.style.display = "none";
        if (texto === "") {
            textoResultado.textContent = "Todos os livros disponíveis.";
        } else {
            textoResultado.textContent = encontrados + (encontrados === 1 ? " livro encontrado." : " livros encontrados.");
        }
    }
}

campoPesquisa.addEventListener("input", pesquisarLivros);
botaoPesquisa.addEventListener("click", pesquisarLivros);
campoPesquisa.addEventListener("keydown", function(event) {
    if (event.key === "Enter") { pesquisarLivros(); }
});

// ======================================================
// QUIZ E BANCO DE DADOS DE PERGUNTAS
// ======================================================
const quizOverlay = document.getElementById("quizOverlay");
const fecharQuiz = document.getElementById("fecharQuiz");
const quizLivro = document.getElementById("quizLivro");
const quizTitulo = document.getElementById("quizTitulo");
const contadorPergunta = document.getElementById("contadorPergunta");
const pergunta = document.getElementById("pergunta");
const alternativas = document.getElementById("alternativas");
const proximaPergunta = document.getElementById("proximaPergunta");
const progressoBarra = document.getElementById("progressoBarra");
const quizConteudo = document.getElementById("quizConteudo");
const resultado = document.getElementById("resultado");
const pontuacao = document.getElementById("pontuacao");
const mensagemFinal = document.getElementById("mensagemFinal");
const refazerQuiz = document.getElementById("refazerQuiz");

let livroAtual = 1;
let perguntaAtual = 0;
let pontos = 0;
let respostaSelecionada = false;

const quizzes = {
    1: [
        { pergunta: "Quem é o protagonista da série?", alternativas: ["Greg Heffley", "Rowley Jefferson", "Manny Heffley", "Rodrick Heffley"], correta: 0 },
        { pergunta: "Quem é o melhor amigo de Greg?", alternativas: ["Fregley", "Rowley Jefferson", "Chirag Gupta", "Frank Heffley"], correta: 1 },
        { pergunta: "Qual é o nome do irmão mais velho de Greg?", alternativas: ["Manny", "Rodrick", "Rowley", "Frank"], correta: 1 },
        { pergunta: "Quem é o irmão mais novo de Greg?", alternativas: ["Rodrick", "Fregley", "Manny", "Frank"], correta: 2 },
        { pergunta: "Quem criou a série Diário de um Banana?", alternativas: ["Jeff Kinney", "J. K. Rowling", "Stan Lee", "Rick Riordan"], correta: 0 }
    ],
    2: [
        { pergunta: "Qual é o sobrenome de Greg?", alternativas: ["Jefferson", "Heffley", "Gupta", "Hills"], correta: 1 },
        { pergunta: "Qual personagem é conhecido por ser o melhor amigo de Greg?", alternativas: ["Rodrick", "Manny", "Rowley", "Fregley"], correta: 2 },
        { pergunta: "Quem é o irmão que toca em uma banda?", alternativas: ["Manny", "Greg", "Rodrick", "Rowley"], correta: 2 },
        { pergunta: "Qual é o nome da mãe de Greg?", alternativas: ["Susan", "Patty", "Holly", "Heather"], correta: 0 },
        { pergunta: "Qual é o nome do pai de Greg?", alternativas: ["Frank", "Robert", "John", "Bill"], correta: 0 }
    ],
    3: [
        { pergunta: "Greg Heffley é o personagem principal?", alternativas: ["Sim", "Não", "Somente no filme", "Somente no primeiro livro"], correta: 0 },
        { pergunta: "Quem é o amigo mais próximo de Greg?", alternativas: ["Rodrick", "Rowley", "Manny", "Fregley"], correta: 1 },
        { pergunta: "Qual personagem é o irmão mais velho de Greg?", alternativas: ["Manny", "Frank", "Rodrick", "Rowley"], correta: 2 },
        { pergunta: "Qual personagem é o irmão mais novo?", alternativas: ["Manny", "Rodrick", "Rowley", "Fregley"], correta: 0 },
        { pergunta: "Quem escreveu Diário de um Banana?", alternativas: ["Jeff Kinney", "Dav Pilkey", "R. L. Stine", "Rick Riordan"], correta: 0 }
    ],
    4: [
        { pergunta: "Qual é o nome completo do protagonista?", alternativas: ["Greg Heffley", "Rowley Jefferson", "Rodrick Heffley", "Manny Heffley"], correta: 0 },
        { pergunta: "Qual personagem é amigo de Greg?", alternativas: ["Rowley", "Frank", "Susan", "Rodrick"], correta: 0 },
        { pergunta: "Qual é o nome do irmão mais velho?", alternativas: ["Manny", "Rodrick", "Rowley", "Fregley"], correta: 1 },
        { pergunta: "Qual é o nome da mãe de Greg?", alternativas: ["Susan", "Holly", "Patty", "Linda"], correta: 0 },
        { pergunta: "Qual é o nome do pai de Greg?", alternativas: ["Frank", "Robert", "Jeff", "Gary"], correta: 0 }
    ],
    5: [
        { pergunta: "Quem é o protagonista da série?", alternativas: ["Greg Heffley", "Rowley Jefferson", "Rodrick Heffley", "Manny Heffley"], correta: 0 },
        { pergunta: "Quem é o melhor amigo de Greg?", alternativas: ["Manny", "Rowley", "Rodrick", "Fregley"], correta: 1 },
        { pergunta: "Qual é o nome do irmão mais velho?", alternativas: ["Manny", "Rodrick", "Frank", "Rowley"], correta: 1 },
        { pergunta: "Qual é o nome da família de Greg?", alternativas: ["Jefferson", "Heffley", "Gupta", "Hills"], correta: 1 },
        { pergunta: "Quem é o autor da série?", alternativas: ["Jeff Kinney", "Dav Pilkey", "Stephen King", "Rick Riordan"], correta: 0 }
    ]
};

const quizBase = [
    { pergunta: "Quem é o protagonista da série?", alternativas: ["Greg Heffley", "Rowley Jefferson", "Rodrick Heffley", "Manny Heffley"], correta: 0 },
    { pergunta: "Quem é o melhor amigo de Greg?", alternativas: ["Rodrick", "Rowley Jefferson", "Manny", "Fregley"], correta: 1 },
    { pergunta: "Qual é o nome do irmão mais velho de Greg?", alternativas: ["Manny", "Frank", "Rodrick", "Rowley"], correta: 2 },
    { pergunta: "Qual é o nome do irmão mais novo de Greg?", alternativas: ["Manny", "Rodrick", "Rowley", "Fregley"], correta: 0 },
    { pergunta: "Quem criou Diário de um Banana?", alternativas: ["Jeff Kinney", "Dav Pilkey", "Rick Riordan", "Stan Lee"], correta: 0 }
];

for (let i = 6; i <= 18; i++) {
    quizzes[i] = quizBase.map(function(item) {
        return {
            pergunta: item.pergunta,
            alternativas: [...item.alternativas],
            correta: item.correta
        };
    });
}

document.querySelectorAll(".quiz-botao").forEach(function(botao) {
    botao.addEventListener("click", function() {
        tocarSom('clique');
        livroAtual = Number(botao.dataset.livro);
        iniciarQuiz();
    });
});

function iniciarQuiz() {
    perguntaAtual = 0;
    pontos = 0;
    respostaSelecionada = false;
    quizOverlay.classList.add("ativo");
    document.body.style.overflow = "hidden";
    quizConteudo.classList.remove("esconder");
    resultado.classList.remove("ativo");
    quizLivro.textContent = "Livro " + livroAtual;
    quizTitulo.textContent = "🧠 Quiz - Diário de um Banana " + livroAtual;
    mostrarPergunta();
}

function mostrarPergunta() {
    const perguntasDoLivro = quizzes[livroAtual];
    const dados = perguntasDoLivro[perguntaAtual];
    respostaSelecionada = false;
    proximaPergunta.disabled = true;

    contadorPergunta.textContent = "Pergunta " + (perguntaAtual + 1) + " de " + perguntasDoLivro.length;
    progressoBarra.style.width = (((perguntaAtual + 1) / perguntasDoLivro.length) * 100) + "%";
    pergunta.textContent = dados.pergunta;
    alternativas.innerHTML = "";

    dados.alternativas.forEach(function(opcao, indice) {
        const botao = document.createElement("button");
        botao.className = "alternativa";
        botao.textContent = opcao;
        botao.addEventListener("click", function() {
            tocarSom('clique');
            selecionarResposta(indice, botao);
        });
        alternativas.appendChild(botao);
    });

    if (perguntaAtual === perguntasDoLivro.length - 1) {
        proximaPergunta.textContent = "Finalizar quiz ✓";
    } else {
        proximaPergunta.textContent = "Próxima pergunta →";
    }
}

function selecionarResposta(indiceEscolhido, botaoEscolhido) {
    if (respostaSelecionada) { return; }
    respostaSelecionada = true;

    const dados = quizzes[livroAtual][perguntaAtual];
    const botoes = document.querySelectorAll(".alternativa");

    botoes.forEach(function(botao) { botao.disabled = true; });

    if (indiceEscolhido === dados.correta) {
        pontos++;
        tocarSom('acerto');
        botaoEscolhido.classList.add("correta");
    } else {
        tocarSom('erro');
        botaoEscolhido.classList.add("errada");
        botoes[dados.correta].classList.add("correta");
    }
    proximaPergunta.disabled = false;
}

proximaPergunta.addEventListener("click", function() {
    if (!respostaSelecionada) { return; }
    tocarSom('clique');
    const total = quizzes[livroAtual].length;

    if (perguntaAtual < total - 1) {
        perguntaAtual++;
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
});

function mostrarResultado() {
    quizConteudo.classList.add("esconder");
    resultado.classList.add("ativo");
    const total = quizzes[livroAtual].length;

    pontuacao.textContent = pontos + " de " + total + " respostas corretas";
    verificarConquistas(pontos, total, livroAtual);

    if (pontos === total) {
        tocarSom('vitoria');
        mensagemFinal.textContent = "🏆 Perfeito! Você acertou todas!";
    } else if (pontos >= 4) {
        tocarSom('acerto');
        mensagemFinal.textContent = "🔥 Muito bem! Você conhece bastante a série!";
    } else if (pontos >= 3) {
        mensagemFinal.textContent = "👏 Bom trabalho! Você foi muito bem.";
    } else if (pontos >= 2) {
        mensagemFinal.textContent = "🙂 Você foi bem, mas pode tentar novamente.";
    } else {
        mensagemFinal.textContent = "🍌 Que tal tentar novamente e melhorar sua pontuação?";
    }
}

refazerQuiz.addEventListener("click", function() {
    tocarSom('clique');
    iniciarQuiz();
});

function fecharModalQuiz() {
    tocarSom('clique');
    quizOverlay.classList.remove("ativo");
    document.body.style.overflow = "";
}

fecharQuiz.addEventListener("click", fecharModalQuiz);
quizOverlay.addEventListener("click", function(event) {
    if (event.target === quizOverlay) { fecharModalQuiz(); }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && quizOverlay.classList.contains("ativo")) {
        fecharModalQuiz();
    }
});
