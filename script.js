// Palavras válidas em ordem alfabética (SEM 'meso' e 'miso')
const palavrasBase = [
    "fome", "meio", "míope", "moisés",
    "peso", "pome", "seio", "seis",
    "veio", "vime", "vsfpo"
];

// Versão normalizada para comparação
const palavrasValidas = palavrasBase.map(palavra => 
    palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
);

// Letras disponíveis (ordem alfabética)
const letrasDisponiveis = ["E", "F", "I", "M", "O", "P", "S", "V"];
let palavrasAcertadas = [];

// Inicia o jogo
function iniciarJogo() {
    document.getElementById("letras").textContent = letrasDisponiveis.join(", ");
    document.getElementById("reiniciar-btn").style.display = "none";
    atualizarContador();

    // Eventos
    document.getElementById("verificar-btn").addEventListener("click", verificarPalavra);
    document.getElementById("reiniciar-btn").addEventListener("click", reiniciarJogo);
    
    document.getElementById("palavra-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            verificarPalavra();
        }
    });
    
    document.getElementById("palavra-input").focus();
}

// Atualiza o contador
function atualizarContador() {
    const restantes = palavrasBase.length - palavrasAcertadas.length;
    document.getElementById("contador").textContent = restantes > 0 ? 
        `Palavras restantes: ${restantes}` : 
        "🎉 Todas encontradas!";
}

// Atualiza a lista de acertos
function atualizarListaAcertos() {
    const lista = document.getElementById("palavras-acertadas");
    lista.innerHTML = palavrasAcertadas
        .sort((a, b) => a.localeCompare(b, 'pt-BR'))
        .map(palavra => `<div>✔️ ${palavra}</div>`)
        .join("");
}

// Verifica a palavra
function verificarPalavra() {
    const palavraInput = document.getElementById("palavra-input").value
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const resultado = document.getElementById("resultado");
    
    if (!palavraInput) {
        resultado.textContent = "⚠️ Digite uma palavra!";
        resultado.style.color = "#e6ac00";
        return;
    }

    if (palavrasAcertadas.some(acertada => 
        acertada.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === palavraInput)) {
        resultado.textContent = "⚠️ Você já acertou essa palavra!";
        resultado.style.color = "#e6ac00";
        return;
    }

    const palavraIndex = palavrasValidas.indexOf(palavraInput);
    if (palavraIndex >= 0) {
        const palavraOriginal = palavrasBase[palavraIndex];
        palavrasAcertadas.push(palavraOriginal);
        
        resultado.textContent = `✓ ${palavraOriginal.toUpperCase()} - Válida!`;
        resultado.style.color = "#006600";
        
        atualizarListaAcertos();
        atualizarContador();
        verificarVitoria();
    } else {
        resultado.textContent = "✗ Palavra inválida!";
        resultado.style.color = "#cc0000";
    }
    
    document.getElementById("palavra-input").value = "";
    document.getElementById("palavra-input").focus();
}

// Verifica vitória
function verificarVitoria() {
    if (palavrasAcertadas.length === palavrasBase.length) {
        document.getElementById("resultado").innerHTML = 
            "<span style='color: #0052cc; font-size: 1.4em;'>🎉 FELIZ ANIVERSÁRIO, MOISÉS! 🎉</span>";
        document.getElementById("verificar-btn").disabled = true;
        document.getElementById("reiniciar-btn").style.display = "block";
        triggerConfetti();
    }
}

// Confetes azuis
function triggerConfetti() {
    confetti({ 
        particleCount: 180,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0052cc', '#0066ff', '#3385ff', '#66a3ff', '#99c2ff'],
        shapes: ['circle', 'square']
    });
}

// Reinicia o jogo
function reiniciarJogo() {
    palavrasAcertadas = [];
    document.getElementById("palavras-acertadas").innerHTML = "";
    document.getElementById("resultado").textContent = "";
    document.getElementById("verificar-btn").disabled = false;
    document.getElementById("reiniciar-btn").style.display = "none";
    iniciarJogo();
}

// Inicia ao carregar
window.onload = iniciarJogo;