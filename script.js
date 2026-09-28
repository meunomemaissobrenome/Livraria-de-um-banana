// ==========================================
// MODO ESCURO (DARK MODE) - COMPATÍVEL COM AMBOS OS IDS
// ==========================================
const darkModeBtn = document.getElementById('darkModeBtn') || document.getElementById('btnModoDiario');

if (darkModeBtn) {
    // Aplica a preferência salva assim que a página carrega
    window.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('tema') === 'escuro') {
            document.body.classList.add('dark-mode');
            if (darkModeBtn.id === 'darkModeBtn') {
                darkModeBtn.textContent = '☀️';
            } else {
                darkModeBtn.textContent = '☀️ Modo Claro';
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (darkModeBtn.id === 'darkModeBtn') {
                darkModeBtn.textContent = '🌙';
            } else {
                darkModeBtn.textContent = '🌙 Modo Noturno';
            }
        }
    });

    // Alterna o tema ao clicar no botão
    darkModeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('tema', 'escuro');
            if (darkModeBtn.id === 'darkModeBtn') {
                darkModeBtn.textContent = '☀️';
            } else {
                darkModeBtn.textContent = '☀️ Modo Claro';
            }
        } else {
            localStorage.setItem('tema', 'claro');
            if (darkModeBtn.id === 'darkModeBtn') {
                darkModeBtn.textContent = '🌙';
            } else {
                darkModeBtn.textContent = '🌙 Modo Noturno';
            }
        }
    });
}


// ==========================================
// BANCO DE PERGUNTAS PARA OS LIVROS (QUIZ)
// ==========================================
const quizzes = {
    1: [
        { pergunta: "Qual é o nome do melhor amigo do Greg?", alternativas: ["Rodrick", "Rowley Jefferson", "Manny", "Fregley"], correta: 1 },
        { pergunta: "Qual objeto na escola assusta as crianças?", alternativas: ["O queijo mofado", "O armário", "A bola", "O sino"], correta: 0 },
        { pergunta: "Como se chama o irmão mais velho?", alternativas: ["Manny", "Rodrick", "Frank", "Rowley"], correta: 1 },
        { pergunta: "O que o Greg escreve na capa?", alternativas: ["Diário", "Agenda", "Caderno", "Notas"], correta: 0 },
        { pergunta: "Qual o nome do irmão mais novo?", alternativas: ["Manny", "Rodrick", "Bryce", "Chirag"], correta: 0 }
    ],
    2: [
        { pergunta: "Qual o grande segredo do Rodrick?", alternativas: ["Ele toca numa banda", "Nota vermelha", "Faz balé", "Tem diário"], correta: 0 },
        { pergunta: "Como se chama a banda dele?", alternativas: ["Os Fraldas Cheias", "The Rockers", "Banana Band", "G Inc"], correta: 0 },
        { pergunta: "Onde o Rodrick tranca o Greg?", alternativas: ["No porão", "No banheiro", "No provador", "No armário"], correta: 0 },
        { pergunta: "Quem chantageia o Greg?", alternativas: ["O próprio Rodrick", "Rowley", "Mãe", "Diretor"], correta: 0 },
        { pergunta: "Qual o pet da família?", alternativas: ["Não têm", "Porquinho", "Cachorro Sweetie", "Gato"], correta: 2 }
    ]
};

let livroAtual = 1;
let perguntaAtual = 0;
let pontuacaoAtual = 0;
let respostaSelecionada = null;

const quizOverlay = document.getElementById('quizOverlay');
const fecharQuiz = document.getElementById('fecharQuiz');
const quizLivroTag = document.getElementById('quizLivroTag');
const contadorPergunta = document.getElementById('contadorPergunta');
const progressoBarra = document.getElementById('progressoBarra');
const perguntaTexto = document.getElementById('perguntaTexto');
const alternativasContainer = document.getElementById('alternativasContainer');
const proximaPerguntaBtn = document.getElementById('proximaPerguntaBtn');
const quizConteudo = document.getElementById('quizConteudo');
const resultadoContainer = document.getElementById('resultadoContainer');
const pontuacaoTexto = document.getElementById('pontuacaoTexto');
const mensagemFinalTexto = document.getElementById('mensagemFinalTexto');
const refazerQuizBtn = document.getElementById('refazerQuizBtn');

// ABRIR QUIZ
document.querySelectorAll('.quiz-botao').forEach(botao => {
    botao.addEventListener('click', (e) => {
        livroAtual = e.target.getAttribute('data-livro');
        perguntaAtual = 0;
        pontuacaoAtual = 0;
        respostaSelecionada = null;
        
        if(quizLivroTag) quizLivroTag.textContent = `Livro ${livroAtual}`;
        if(quizConteudo) quizConteudo.style.display = 'block';
        if(resultadoContainer) resultadoContainer.style.display = 'none';
        if(quizOverlay) quizOverlay.classList.add('ativo');
        
        carregarPergunta();
    });
});

if(fecharQuiz) {
    fecharQuiz.addEventListener('click', () => quizOverlay.classList.remove('ativo'));
}

function carregarPergunta() {
    respostaSelecionada = null;
    if(proximaPerguntaBtn) proximaPerguntaBtn.disabled = true;
    
    const dados = quizzes[livroAtual] || quizzes[1];
    const questao = dados[perguntaAtual];
    
    if(contadorPergunta) contadorPergunta.textContent = `Pergunta ${perguntaAtual + 1} de ${dados.length}`;
    if(progressoBarra) progressoBarra.style.width = `${((perguntaAtual + 1) / dados.length) * 100}%`;
    if(perguntaTexto) perguntaTexto.textContent = questao.pergunta;
    
    if(alternativasContainer) {
        alternativasContainer.innerHTML = '';
        questao.alternativas.forEach((alt, index) => {
            const btn = document.createElement('button');
            btn.classList.add('btn-alternativa');
            btn.textContent = alt;
            btn.addEventListener('click', () => selecionarAlt(index, questao.correta, btn));
            alternativasContainer.appendChild(btn);
        });
    }
}

function selecionarAlt(indexSel, indexCorreto, btnEl) {
    if (respostaSelecionada !== null) return;
    respostaSelecionada = indexSel;
    
    const botoes = alternativasContainer.querySelectorAll('.btn-alternativa');
    botoes.forEach((b, i) => {
        b.disabled = true;
        if (i === indexCorreto) b.classList.add('correta');
        else if (i === indexSel) b.classList.add('errada');
    });

    if (indexSel === indexCorreto) pontuacaoAtual++;
    if(proximaPerguntaBtn) proximaPerguntaBtn.disabled = false;
}

if(proximaPerguntaBtn) {
    proximaPerguntaBtn.addEventListener('click', () => {
        const dados = quizzes[livroAtual] || quizzes[1];
        perguntaAtual++;
        if (perguntaAtual < dados.length) {
            carregarPergunta();
        } else {
            if(quizConteudo) quizConteudo.style.display = 'none';
            if(resultadoContainer) resultadoContainer.style.display = 'block';
            if(pontuacaoTexto) pontuacaoTexto.textContent = `${pontuacaoAtual} de ${dados.length} corretas`;
            if(mensagemFinalTexto) {
                mensagemFinalTexto.textContent = pontuacaoAtual === dados.length ? 
                    "Excelente! Você é um verdadeiro fã da leitura!" : 
                    "Bom trabalho! Continue lendo para acertar tudo!";
            }
        }
    });
}

if(refazerQuizBtn) {
    refazerQuizBtn.addEventListener('click', () => {
        perguntaAtual = 0;
        pontuacaoAtual = 0;
        if(quizConteudo) quizConteudo.style.display = 'block';
        if(resultadoContainer) resultadoContainer.style.display = 'none';
        carregarPergunta();
    });
}


// ==========================================
// FILTRO POR CATEGORIAS DA SIDEBAR
// ==========================================
const catBtns = document.querySelectorAll('.cat-btn');
const livrosCards = document.querySelectorAll('.livro-card');
const contadorLivros = document.getElementById('contadorLivros');

catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        
        const categoria = btn.getAttribute('data-categoria');
        let visiveis = 0;
        
        livrosCards.forEach(card => {
            const catCard = card.getAttribute('data-cat');
            if (categoria === 'todos' || catCard === categoria) {
                card.style.display = 'flex';
                visiveis++;
            } else {
                card.style.display = 'none';
            }
        });
        if(contadorLivros) contadorLivros.textContent = `${visiveis} livros encontrados`;
    });
});


// ==========================================
// PESQUISA INTELIGENTE
// ==========================================
const campoPesquisa = document.getElementById('campoPesquisa');
const botaoPesquisa = document.getElementById('botaoPesquisa');
const nenhumResultado = document.getElementById('nenhumResultado');

function executarPesquisa() {
    if (!campoPesquisa) return;
    const termo = campoPesquisa.value.toLowerCase().trim();
    let visiveis = 0;

    livrosCards.forEach(card => {
        const titulo = card.querySelector('h3').textContent.toLowerCase();
        const autor = card.querySelector('.autor').textContent.toLowerCase();
        const num = card.querySelector('.num-livro').textContent.toLowerCase();

        if (titulo.includes(termo) || autor.includes(termo) || num.includes(termo)) {
            card.style.display = 'flex';
            visiveis++;
        } else {
            card.style.display = 'none';
        }
    });

    if(nenhumResultado) nenhumResultado.style.display = visiveis === 0 ? 'block' : 'none';
    if(contadorLivros) contadorLivros.textContent = `${visiveis} livros encontrados`;
}

if(campoPesquisa) campoPesquisa.addEventListener('input', executarPesquisa);
if(botaoPesquisa) botaoPesquisa.addEventListener('click', executarPesquisa);


// ==========================================
// LIVRO SURPRESA
// ==========================================
const btnSorteio = document.getElementById('btnSorteio');
if(btnSorteio) {
    btnSorteio.addEventListener('click', (e) => {
        e.preventDefault();
        const visiveis = Array.from(livrosCards).filter(c => c.style.display !== 'none');
        if (visiveis.length === 0) return;
        const sorteado = visiveis[Math.floor(Math.random() * visiveis.length)];
        sorteado.scrollIntoView({ behavior: 'smooth', block: 'center' });
        sorteado.style.border = '2px solid #2563eb';
        setTimeout(() => sorteado.style.border = '1px solid #e2e8f0', 2500);
    });
}
