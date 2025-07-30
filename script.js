// Palavras válidas em ordem alfabética
const palavrasBase = [
    "fome", "meio", "meso", "miso", "míope",
    "moisés", "peso", "pome", "seio", "seis",
    "veio", "vime", "vsfpo"
];

// Versão normalizada para comparação (sem acentos e minúsculas)
const palavrasValidas = palavrasBase.map(palavra => 
    palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
);

// Letras disponíveis (ordem alfabética)
const letrasDisponiveis = ["E", "F", "I", "M", "O", "P", "S", "V"];
let pontuacao = 0;
let palavrasAcertadas = [];

// Inicia o jogo
function iniciarJogo() {
    document.getElementById("letras").textContent = letrasDisponiveis.join(", ");
    document.getElementById("pontuacao").textContent = pontuacao;
    document.getElementById("reiniciar-btn").style.display = "none";
    atualizarContador();

    // Eventos
    document.getElementById("verificar-btn").addEventListener("click", verificarPalavra);
    document.getElementById("reiniciar-btn").addEventListener("click", reiniciarJogo);
    
    // Evento para tecla Enter
    document.getElementById("palavra-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            verificarPalavra();
        }
    });
    
    // Foco automático no campo de input
    document.getElementById("palavra-input").focus();
}

// Atualiza o contador de palavras restantes
function atualizarContador() {
    const restantes = palavrasBase.length - palavrasAcertadas.length;
    const contador = document.getElementById("contador");
    contador.textContent = restantes > 0 ? 
        `Faltam ${restantes} palavra${restantes !== 1 ? 's' : ''}` : 
        "🎉 Todas encontradas!";
}

// Atualiza a lista de acertos em ordem alfabética
function atualizarListaAcertos() {
    const lista = document.getElementById("palavras-acertadas");
    lista.innerHTML = palavrasAcertadas
        .sort((a, b) => a.localeCompare(b, 'pt-BR'))
        .map(palavra => `<div>✅ ${palavra}</div>`)
        .join("");
}

// Verifica a palavra digitada
function verificarPalavra() {
    const palavraInput = document.getElementById("palavra-input").value
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const resultado = document.getElementById("resultado");
    
    if (!palavraInput) {
        resultado.textContent = "⚠️ Digite uma palavra!";
        resultado.style.color = "orange";
        return;
    }

    // Verifica se já foi acertada
    const jaAcertou = palavrasAcertadas.some(acertada => 
        acertada.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === palavraInput
    );
    
    if (jaAcertou) {
        resultado.textContent = "⚠️ Você já acertou essa palavra!";
        resultado.style.color = "orange";
        return;
    }

    // Verifica se é válida
    const palavraIndex = palavrasValidas.indexOf(palavraInput);
    if (palavraIndex >= 0) {
        const palavraOriginal = palavrasBase[palavraIndex];
        pontuacao += palavraOriginal.length * 10;
        palavrasAcertadas.push(palavraOriginal);
        
        document.getElementById("pontuacao").textContent = pontuacao;
        resultado.textContent = `✅ ${palavraOriginal.toUpperCase()}! +${palavraOriginal.length * 10} pontos`;
        resultado.style.color = "green";
        
        atualizarListaAcertos();
        atualizarContador();
        verificarVitoria();
    } else {
        resultado.textContent = "❌ Palavra inválida!";
        resultado.style.color = "red";
    }
    
    // Limpa e mantém foco no campo
    document.getElementById("palavra-input").value = "";
    document.getElementById("palavra-input").focus();
}

// Verifica se completou todas as palavras
function verificarVitoria() {
    if (palavrasAcertadas.length === palavrasBase.length) {
        document.getElementById("resultado").innerHTML = 
            "<span style='color: gold; font-size: 1.5em;'>🎉 FELIZ ANIVERSÁRIO, MOISÉS! 🎉</span>";
        document.getElementById("verificar-btn").disabled = true;
        document.getElementById("reiniciar-btn").style.display = "block";
        triggerConfetti();
    }
}

// Efeito de confetes
function triggerConfetti() {
    confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
    });
}

// Reinicia o jogo
function reiniciarJogo() {
    pontuacao = 0;
    palavrasAcertadas = [];
    document.getElementById("palavras-acertadas").innerHTML = "";
    document.getElementById("resultado").textContent = "";
    document.getElementById("pontuacao").textContent = "0";
    document.getElementById("verificar-btn").disabled = false;
    document.getElementById("reiniciar-btn").style.display = "none";
    iniciarJogo();
}

// Inicia ao carregar a página
window.onload = iniciarJogo;