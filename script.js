// Palavras válidas personalizadas (base para comparação)
const palavrasBase = [
    "míope", "fome", "vime", "peso", "veio", 
    "moisés", "vsfpo", "miso", "seio", "seis", 
    "meio", "meso", "pome"
];

// Versão normalizada das palavras válidas (sem acentos e minúsculas)
const palavrasValidas = palavrasBase.map(palavra => 
    palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
);

// Letras disponíveis (em ordem alfabética)
const letrasDisponiveis = ["E", "F", "I", "M", "O", "P", "S", "V"];
let pontuacao = 0;
let palavrasAcertadas = [];

// Inicia o jogo
function iniciarJogo() {
    document.getElementById("letras").textContent = letrasDisponiveis.join(", ");
    document.getElementById("pontuacao").textContent = pontuacao;
    document.getElementById("reiniciar-btn").style.display = "none";

    // Eventos
    document.getElementById("verificar-btn").addEventListener("click", verificarPalavra);
    document.getElementById("reiniciar-btn").addEventListener("click", reiniciarJogo);
}

// Verifica se a palavra é válida (ignorando acentos e case)
function verificarPalavra() {
    const palavraInput = document.getElementById("palavra-input").value
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
    const resultado = document.getElementById("resultado");
    
    if (!palavraInput) {
        resultado.textContent = "⚠️ Digite uma palavra!";
        resultado.style.color = "orange";
        return;
    }

    if (palavrasAcertadas.some(acertada => 
        acertada.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === palavraInput)) {
        resultado.textContent = "⚠️ Você já acertou essa palavra!";
        resultado.style.color = "orange";
        return;
    }

    // Verifica se está na lista de palavras válidas
    const palavraIndex = palavrasValidas.indexOf(palavraInput);
    if (palavraIndex >= 0) {
        const letrasPalavra = palavraInput.toUpperCase().split("");
        const letrasPermitidas = letrasDisponiveis.map(l => l.toUpperCase());
        const letrasInvalidas = letrasPalavra.filter(letra => !letrasPermitidas.includes(letra));
        
        if (letrasInvalidas.length > 0) {
            resultado.textContent = `❌ Letras inválidas: ${letrasInvalidas.join(", ")}`;
            resultado.style.color = "red";
        } else {
            // Adiciona a palavra ORIGINAL (com acentos se tiver)
            const palavraOriginal = palavrasBase[palavraIndex];
            pontuacao += palavraOriginal.length * 10;
            palavrasAcertadas.push(palavraOriginal);
            
            document.getElementById("pontuacao").textContent = pontuacao;
            document.getElementById("palavras-acertadas").innerHTML += `<div>✅ ${palavraOriginal}</div>`;
            resultado.textContent = `✅ Palavra válida! +${palavraOriginal.length * 10} pontos`;
            resultado.style.color = "green";
            verificarVitoria();
        }
    } else {
        resultado.textContent = "❌ Palavra inválida!";
        resultado.style.color = "red";
    }
    
    document.getElementById("palavra-input").value = "";
}

// Verifica vitória
function verificarVitoria() {
    if (palavrasAcertadas.length === palavrasBase.length) {
        document.getElementById("resultado").innerHTML = 
            "<span style='color: gold; font-size: 1.5em;'>🎉 FELIZ ANIVERSÁRIO, MOISÉS! 🎉</span>";
        document.getElementById("verificar-btn").disabled = true;
        document.getElementById("reiniciar-btn").style.display = "block";
        triggerConfetti();
    }
}

// Confetes
function triggerConfetti() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

// Reinicia o jogo
function reiniciarJogo() {
    pontuacao = 0;
    palavrasAcertadas = [];
    document.getElementById("palavras-acertadas").innerHTML = "";
    document.getElementById("resultado").textContent = "";
    document.getElementById("verificar-btn").disabled = false;
    iniciarJogo();
}

// Inicia quando a página carrega
window.onload = iniciarJogo;