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
// ==========================================
// CADASTRO / LOGIN - Diário de um Banana
// Funciona em todas as páginas (index.html e comprar.html).
// Os dados ficam salvos no navegador (localStorage).
// ==========================================
(() => {
    'use strict';

    // Mude para true se quiser OBRIGAR login para ver livro, fazer quiz ou comprar.
    const EXIGIR_LOGIN = false;

    const CHAVE_USUARIOS = 'bananaUsuarios';
    const CHAVE_SESSAO = 'bananaSessao';

    // ---------- Armazenamento ----------
    function lerUsuarios() {
        try { return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || []; }
        catch (e) { return []; }
    }

    function salvarUsuarios(lista) {
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
    }

    function emailLogado() {
        try { return localStorage.getItem(CHAVE_SESSAO); }
        catch (e) { return null; }
    }

    function usuarioLogado() {
        const email = emailLogado();
        if (!email) return null;
        return lerUsuarios().find(u => u.email === email) || null;
    }

    // ---------- Segurança da senha (hash + sal) ----------
    function gerarSal() {
        const a = new Uint8Array(16);
        crypto.getRandomValues(a);
        return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
    }

    async function gerarHash(senha, sal) {
        const texto = sal + senha;
        if (window.crypto && crypto.subtle) {
            const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
            return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
        }
        // Plano B para navegadores sem crypto.subtle
        let h = 5381;
        for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) | 0;
        return 'f' + h;
    }

    // ---------- Validações ----------
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function forcaSenha(s) {
        let pontos = 0;
        if (s.length >= 6) pontos++;
        if (s.length >= 10) pontos++;
        if (/[A-Z]/.test(s) && /[a-z]/.test(s)) pontos++;
        if (/\d/.test(s)) pontos++;
        if (/[^A-Za-z0-9]/.test(s)) pontos++;
        return pontos; // 0 a 5
    }

    // ---------- Montagem da interface ----------
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';
    overlay.id = 'authOverlay';
    overlay.innerHTML = `
        <div class="auth-modal" role="dialog" aria-modal="true" aria-labelledby="authTitulo">
            <button type="button" class="auth-fechar" id="authFechar" aria-label="Fechar">&times;</button>
            <div class="auth-logo">🍌</div>
            <h2 class="auth-titulo" id="authTitulo">Bem-vindo(a)!</h2>

            <div class="auth-abas">
                <button type="button" class="auth-aba ativo" data-aba="login">Entrar</button>
                <button type="button" class="auth-aba" data-aba="cadastro">Criar conta</button>
            </div>

            <!-- LOGIN -->
            <form class="auth-form ativo" id="formLogin" novalidate>
                <div class="auth-msg" id="msgLogin"></div>
                <div class="auth-campo">
                    <label for="loginEmail">E-mail</label>
                    <input type="email" id="loginEmail" autocomplete="email" placeholder="seuemail@exemplo.com">
                    <small class="auth-erro"></small>
                </div>
                <div class="auth-campo tem-olho">
                    <label for="loginSenha">Senha</label>
                    <div class="auth-input-wrap">
                        <input type="password" id="loginSenha" autocomplete="current-password" placeholder="Sua senha">
                        <button type="button" class="auth-olho" data-alvo="loginSenha" aria-label="Mostrar senha">👁️</button>
                    </div>
                    <small class="auth-erro"></small>
                </div>
                <button type="submit" class="auth-enviar">Entrar</button>
                <p class="auth-troca">Ainda não tem conta? <button type="button" data-ir="cadastro">Cadastre-se</button></p>
            </form>

            <!-- CADASTRO -->
            <form class="auth-form" id="formCadastro" novalidate>
                <div class="auth-msg" id="msgCadastro"></div>
                <div class="auth-campo">
                    <label for="cadNome">Nome</label>
                    <input type="text" id="cadNome" autocomplete="name" maxlength="50" placeholder="Seu nome">
                    <small class="auth-erro"></small>
                </div>
                <div class="auth-campo">
                    <label for="cadEmail">E-mail</label>
                    <input type="email" id="cadEmail" autocomplete="email" placeholder="seuemail@exemplo.com">
                    <small class="auth-erro"></small>
                </div>
                <div class="auth-campo tem-olho">
                    <label for="cadSenha">Senha</label>
                    <div class="auth-input-wrap">
                        <input type="password" id="cadSenha" autocomplete="new-password" placeholder="Mínimo de 6 caracteres">
                        <button type="button" class="auth-olho" data-alvo="cadSenha" aria-label="Mostrar senha">👁️</button>
                    </div>
                    <div class="auth-forca"><div class="auth-forca-barra" id="forcaBarra"></div></div>
                    <div class="auth-forca-texto" id="forcaTexto"></div>
                    <small class="auth-erro"></small>
                </div>
                <div class="auth-campo tem-olho">
                    <label for="cadSenha2">Confirmar senha</label>
                    <div class="auth-input-wrap">
                        <input type="password" id="cadSenha2" autocomplete="new-password" placeholder="Repita a senha">
                        <button type="button" class="auth-olho" data-alvo="cadSenha2" aria-label="Mostrar senha">👁️</button>
                    </div>
                    <small class="auth-erro"></small>
                </div>
                <button type="submit" class="auth-enviar">Criar minha conta</button>
                <p class="auth-troca">Já tem conta? <button type="button" data-ir="login">Entrar</button></p>
            </form>
        </div>
    `;

    const toast = document.createElement('div');
    toast.className = 'auth-toast';

    let iniciado = false;

    document.addEventListener('DOMContentLoaded', iniciar);
    if (document.readyState !== 'loading') iniciar();

    function iniciar() {
        if (iniciado) return;
        iniciado = true;

        document.body.appendChild(overlay);
        document.body.appendChild(toast);

        const nav = document.querySelector('.nav-links');
        const area = document.createElement('span');
        area.className = 'auth-area';
        area.id = 'authArea';
        if (nav) nav.appendChild(area);

        atualizarArea();
        ligarEventos();
    }

    // ---------- Área do menu (botão ou nome do usuário) ----------
    function atualizarArea() {
        const area = document.getElementById('authArea');
        if (!area) return;
        area.textContent = '';
        const user = usuarioLogado();

        if (user) {
            const ola = document.createElement('span');
            ola.className = 'auth-ola';
            ola.append('Olá, ');
            const nome = document.createElement('strong');
            nome.textContent = user.nome.split(' ')[0];
            ola.appendChild(nome);

            const sair = document.createElement('button');
            sair.type = 'button';
            sair.className = 'auth-btn auth-btn-sair';
            sair.textContent = 'Sair';
            sair.addEventListener('click', sairDaConta);

            area.append(ola, sair);
        } else {
            const entrar = document.createElement('button');
            entrar.type = 'button';
            entrar.className = 'auth-btn';
            entrar.textContent = '👤 Entrar / Cadastrar';
            entrar.addEventListener('click', () => abrir('login'));
            area.appendChild(entrar);
        }
    }

    // ---------- Abrir / fechar ----------
    function abrir(aba) {
        limparTudo();
        trocarAba(aba || 'login');
        overlay.classList.add('ativo');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const primeiro = overlay.querySelector('.auth-form.ativo input');
            if (primeiro) primeiro.focus();
        }, 50);
    }

    function fechar() {
        overlay.classList.remove('ativo');
        document.body.style.overflow = '';
    }

    function trocarAba(aba) {
        overlay.querySelectorAll('.auth-aba').forEach(b =>
            b.classList.toggle('ativo', b.dataset.aba === aba));
        document.getElementById('formLogin').classList.toggle('ativo', aba === 'login');
        document.getElementById('formCadastro').classList.toggle('ativo', aba === 'cadastro');
        document.getElementById('authTitulo').textContent =
            aba === 'login' ? 'Bem-vindo(a) de volta!' : 'Crie sua conta';
        limparErros();
    }

    function avisar(texto) {
        toast.textContent = texto;
        toast.classList.add('ativo');
        setTimeout(() => toast.classList.remove('ativo'), 3000);
    }

    // ---------- Erros ----------
    function erroCampo(input, msg) {
        const campo = input.closest('.auth-campo');
        campo.classList.add('invalido');
        campo.querySelector('.auth-erro').textContent = msg;
    }

    function limparErros() {
        overlay.querySelectorAll('.auth-campo').forEach(c => {
            c.classList.remove('invalido');
            c.querySelector('.auth-erro').textContent = '';
        });
        overlay.querySelectorAll('.auth-msg').forEach(m => {
            m.classList.remove('ativo');
            m.textContent = '';
        });
    }

    function msgGeral(id, texto) {
        const m = document.getElementById(id);
        m.textContent = texto;
        m.classList.add('ativo');
    }

    function limparTudo() {
        overlay.querySelectorAll('input').forEach(i => {
            i.value = '';
            if (i.dataset.eraSenha) i.type = 'password';
        });
        overlay.querySelectorAll('.auth-olho').forEach(b => b.textContent = '👁️');
        overlay.querySelectorAll('input[type="text"]').forEach(i => {
            if (i.id.toLowerCase().includes('senha')) i.type = 'password';
        });
        atualizarForca('');
        limparErros();
    }

    // ---------- Força da senha ----------
    function atualizarForca(senha) {
        const barra = document.getElementById('forcaBarra');
        const texto = document.getElementById('forcaTexto');
        if (!senha) {
            barra.style.width = '0';
            texto.textContent = '';
            return;
        }
        const p = forcaSenha(senha);
        const niveis = [
            { w: '20%', cor: '#dc2626', t: 'Muito fraca' },
            { w: '20%', cor: '#dc2626', t: 'Muito fraca' },
            { w: '40%', cor: '#f97316', t: 'Fraca' },
            { w: '60%', cor: '#eab308', t: 'Média' },
            { w: '80%', cor: '#84cc16', t: 'Boa' },
            { w: '100%', cor: '#16a34a', t: 'Forte' }
        ];
        const n = niveis[p];
        barra.style.width = n.w;
        barra.style.background = n.cor;
        texto.textContent = 'Força da senha: ' + n.t;
    }

    // ---------- Ações ----------
    async function cadastrar(e) {
        e.preventDefault();
        limparErros();

        const nomeEl = document.getElementById('cadNome');
        const emailEl = document.getElementById('cadEmail');
        const senhaEl = document.getElementById('cadSenha');
        const senha2El = document.getElementById('cadSenha2');

        const nome = nomeEl.value.trim().replace(/\s+/g, ' ');
        const email = emailEl.value.trim().toLowerCase();
        const senha = senhaEl.value;
        const senha2 = senha2El.value;
        let ok = true;

        if (nome.length < 3) { erroCampo(nomeEl, 'Digite seu nome (mínimo de 3 letras).'); ok = false; }
        if (!regexEmail.test(email)) { erroCampo(emailEl, 'Digite um e-mail válido.'); ok = false; }
        if (senha.length < 6) { erroCampo(senhaEl, 'A senha precisa ter no mínimo 6 caracteres.'); ok = false; }
        if (senha2 !== senha) { erroCampo(senha2El, 'As senhas não são iguais.'); ok = false; }
        if (!ok) return;

        const usuarios = lerUsuarios();
        if (usuarios.some(u => u.email === email)) {
            erroCampo(emailEl, 'Este e-mail já está cadastrado. Tente entrar.');
            return;
        }

        const botao = e.target.querySelector('.auth-enviar');
        botao.disabled = true;

        try {
            const sal = gerarSal();
            const hash = await gerarHash(senha, sal);
            usuarios.push({ nome, email, sal, hash, criadoEm: new Date().toISOString() });
            salvarUsuarios(usuarios);
            localStorage.setItem(CHAVE_SESSAO, email);

            fechar();
            atualizarArea();
            avisar('Conta criada com sucesso! Bem-vindo(a), ' + nome.split(' ')[0] + '! 🎉');
        } catch (err) {
            msgGeral('msgCadastro', 'Não foi possível salvar sua conta. Verifique se o navegador permite armazenamento.');
        } finally {
            botao.disabled = false;
        }
    }

    let tentativas = 0;
    let bloqueadoAte = 0;

    async function entrar(e) {
        e.preventDefault();
        limparErros();

        const emailEl = document.getElementById('loginEmail');
        const senhaEl = document.getElementById('loginSenha');
        const email = emailEl.value.trim().toLowerCase();
        const senha = senhaEl.value;
        let ok = true;

        if (!regexEmail.test(email)) { erroCampo(emailEl, 'Digite um e-mail válido.'); ok = false; }
        if (!senha) { erroCampo(senhaEl, 'Digite sua senha.'); ok = false; }
        if (!ok) return;

        if (Date.now() < bloqueadoAte) {
            const seg = Math.ceil((bloqueadoAte - Date.now()) / 1000);
            msgGeral('msgLogin', 'Muitas tentativas. Aguarde ' + seg + 's e tente de novo.');
            return;
        }

        const botao = e.target.querySelector('.auth-enviar');
        botao.disabled = true;

        try {
            const user = lerUsuarios().find(u => u.email === email);
            const hash = user ? await gerarHash(senha, user.sal) : null;

            if (!user || hash !== user.hash) {
                tentativas++;
                if (tentativas >= 5) {
                    bloqueadoAte = Date.now() + 30000;
                    tentativas = 0;
                    msgGeral('msgLogin', 'Muitas tentativas. Aguarde 30s e tente de novo.');
                } else {
                    msgGeral('msgLogin', 'E-mail ou senha incorretos.');
                }
                return;
            }

            tentativas = 0;
            localStorage.setItem(CHAVE_SESSAO, user.email);
            fechar();
            atualizarArea();
            avisar('Bem-vindo(a) de volta, ' + user.nome.split(' ')[0] + '! 👋');
        } finally {
            botao.disabled = false;
        }
    }

    function sairDaConta() {
        localStorage.removeItem(CHAVE_SESSAO);
        atualizarArea();
        avisar('Você saiu da sua conta.');
    }

    // ---------- Eventos ----------
    function ligarEventos() {
        document.getElementById('authFechar').addEventListener('click', fechar);

        overlay.addEventListener('mousedown', (e) => {
            if (e.target === overlay) fechar();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('ativo')) fechar();
        });

        overlay.querySelectorAll('.auth-aba').forEach(b =>
            b.addEventListener('click', () => { limparTudo(); trocarAba(b.dataset.aba); }));

        overlay.querySelectorAll('[data-ir]').forEach(b =>
            b.addEventListener('click', () => { limparTudo(); trocarAba(b.dataset.ir); }));

        overlay.querySelectorAll('.auth-olho').forEach(b =>
            b.addEventListener('click', () => {
                const input = document.getElementById(b.dataset.alvo);
                const mostrar = input.type === 'password';
                input.type = mostrar ? 'text' : 'password';
                b.textContent = mostrar ? '🙈' : '👁️';
            }));

        document.getElementById('cadSenha').addEventListener('input', (e) => atualizarForca(e.target.value));
        document.getElementById('formCadastro').addEventListener('submit', cadastrar);
        document.getElementById('formLogin').addEventListener('submit', entrar);

        // Se EXIGIR_LOGIN estiver ligado, bloqueia livros, quiz e compras para quem não entrou
        if (EXIGIR_LOGIN) {
            document.addEventListener('click', (e) => {
                const alvo = e.target.closest('.btn-ver-livro, .quiz-botao, .btn-amazon');
                if (alvo && !usuarioLogado()) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    abrir('login');
                    avisar('Entre na sua conta para continuar 📚');
                }
            }, true);
        }

        // Mantém várias abas sincronizadas (login/logout)
        window.addEventListener('storage', (e) => {
            if (e.key === CHAVE_SESSAO) atualizarArea();
        });
    }
})();

