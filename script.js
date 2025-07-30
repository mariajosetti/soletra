// Palavras válidas em ordem alfabética (removidas 'meso' e 'miso')
const palavrasBase = [
    "fome", "meio", "míope", "moisés", 
    "peso", "pome", "seio", "seis",
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
    document.getElementById("reiniciar-btn").style.display = "none";
    atualizarContador();

    // Evento do botão Verificar
    document.getElementById("verificar-btn").addEventListener("click", verificarPalavra);
    
    // Evento do botão Reiniciar
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
        `Palavras restantes: ${restantes}` : 
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
        resultado.style.color = "#cc7a00";
        return;
    }

    // Verifica se já foi acertada
    const jaAcertou = palavrasAcertadas.some(acertada => 
        acertada.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === palavraInput
    );
    
    if (jaAcertou) {
        resultado.textContent = "⚠️ Você já acertou essa palavra!";
        resultado.style.color = "#cc7a00";
        return;
    }

    // Verifica se é válida
    const palavraIndex = palavrasValidas.indexOf(palavraInput);
    if (palavraIndex >= 0) {
        const palavraOriginal = palavrasBase[palavraIndex];
        pontuacao += palavraOriginal.length * 10;
        palavrasAcertadas.push(palavraOriginal);
        
        resultado.textContent = `✅ ${palavraOriginal.toUpperCase()}!`;
        resultado.style.color = "#006600";
        
        atualizarListaAcertos();
        atualizarContador();
        verificarVitoria();
    } else {
        resultado.textContent = "❌ Palavra inválida!";
        resultado.style.color = "#cc0000";
    }
    
    // Limpa e mantém foco no campo
    document.getElementById("palavra-input").value = "";
    document.getElementById("palavra-input").focus();
}

// Verifica se completou todas as palavras
function verificarVitoria() {
    if (palavrasAcertadas.length === palavrasBase.length) {
        document.getElementById("resultado").innerHTML = 
            "<span style='color: #0066cc; font-size: 1.5em;'>🎉 FELIZ ANIVERSÁRIO, MOISÉS! 🎉</span>";
        document.getElementById("verificar-btn").disabled = true;
        document.getElementById("reiniciar-btn").style.display = "block";
        triggerConfetti();
    }
}

// Efeito de confetes em tons de azul
function triggerConfetti() {
    confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 },
        colors: ['#0066cc', '#004d99', '#003366', '#66b3ff', '#b3d9ff']
    });
}

// Reinicia o jogo
function reiniciarJogo() {
    pontuacao = 0;
    palavrasAcertadas = [];
    document.getElementById("palavras-acertadas").innerHTML = "";
    document.getElementById("resultado").textContent = "";
    document.getElementById("verificar-btn").disabled = false;
    document.getElementById("reiniciar-btn").style.display = "none";
    iniciarJogo();
}

// Inicia ao carregar a página
window.onload = iniciarJogo;