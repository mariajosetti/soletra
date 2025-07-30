// Palavras válidas personalizadas (em ordem alfabética base)
const palavrasBase = [
    "fome", "meio", "meso", "miso", "míope",
    "moisés", "peso", "pome", "seio", "seis",
    "veio", "vime", "vsfpo"
].sort(); // Garante ordem alfabética

// Versão normalizada das palavras válidas
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
}

// Atualiza o contador de palavras restantes
function atualizarContador() {
    const restantes = palavrasBase.length - palavrasAcertadas.length;
    document.getElementById("contador").textContent = 
        `Faltam ${restantes} palavra${restantes !== 1 ? 's' : ''}`;
}

// Atualiza a lista de palavras acertadas (em ordem alfabética)
function atualizarListaAcertos() {
    const lista = document.getElementById("palavras-acertadas");
    lista.innerHTML = palavrasAcertadas.sort().map(palavra => 
        `<div>✅ ${palavra}</div>`
    ).join("");
}

// Verifica se a palavra é válida
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

    const palavraIndex = palavrasValidas.indexOf(palavraInput);
    if (palavraIndex >= 0) {
        const letrasPalavra = palavraInput.toUpperCase().split("");
        const letrasPermitidas = letrasDisponiveis.map(l => l.toUpperCase());
        const letrasInvalidas = letrasPalavra.filter(letra => !letrasPermitidas.includes(letra));
        
        if (letrasInvalidas.length > 0) {
            resultado.textContent = `❌ Letras inválidas: ${letrasInvalidas.join(", ")}`;
            resultado.style.color = "red";
        } else {
            const palavraOriginal = palavrasBase[palavraIndex];
            pontuacao += palavraOriginal.length * 10;
            palavrasAcertadas.push(palavraOriginal);
            
            document.getElementById("pontuacao").textContent = pontuacao;
            resultado.textContent = `✅ Palavra válida! +${palavraOriginal.length * 10} pontos`;
            resultado.style.color = "green";
            
            atualizarListaAcertos();
            atualizarContador();
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
        document.getElementById("contador").textContent = "Todas palavras encontradas!";
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