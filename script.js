// CONFIGURAÇÃO DO JOGO
const palavrasBase = [
    "fome", "meio", "seio", "seis", "veio", 
    "vime", "peso", "pome", "míope", "posse", 
    "vsfpo", "fimose", "meiose", "moisés"
].sort((a, b) => a.length - b.length || a.localeCompare(b));

const palavrasValidas = palavrasBase.map(palavra => 
    palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
);

const letrasDisponiveis = Array.from(new Set(
    palavrasBase.join("").toUpperCase().split("")
)).sort();

let palavrasAcertadas = [];

// FUNÇÕES PRINCIPAIS
function iniciarJogo() {
    document.getElementById("letras").textContent = letrasDisponiveis.join(" ");
    document.getElementById("total-palavras").textContent = palavrasBase.length;
    
    document.getElementById("verificar-btn").addEventListener("click", verificarPalavra);
    document.getElementById("reiniciar-btn").addEventListener("click", reiniciarJogo);
    
    document.getElementById("palavra-input").addEventListener("keypress", function(e) {
        if (e.key === "Enter") verificarPalavra();
    });
    
    atualizarListaCompleta();
    document.getElementById("palavra-input").focus();
}

function verificarPalavra() {
    const input = document.getElementById("palavra-input");
    const palavra = input.value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const resultado = document.getElementById("resultado");
    
    if (!palavra) {
        resultado.textContent = "Digite uma palavra válida";
        resultado.style.color = "#e74c3c";
        return;
    }

    if (palavrasAcertadas.some(p => 
        p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === palavra)) {
        resultado.textContent = "Palavra já encontrada!";
        resultado.style.color = "#e67e22";
        return;
    }

    const index = palavrasValidas.indexOf(palavra);
    if (index >= 0) {
        palavrasAcertadas.push(palavrasBase[index]);
        document.getElementById("palavras-encontradas").textContent = palavrasAcertadas.length;
        resultado.textContent = `✓ "${palavrasBase[index]}" correto!`;
        resultado.style.color = "#27ae60";
        
        atualizarListaCompleta();
        
        if (palavrasAcertadas.length === palavrasBase.length) {
            resultado.innerHTML = "<span style='font-size:1.4em'>🎉 FELIZ ANIVERSÁRIO, MOISÉS! 🎉</span>";
            triggerConfetti();
        }
    } else {
        resultado.textContent = "Palavra não encontrada";
        resultado.style.color = "#e74c3c";
    }
    
    input.value = "";
    input.focus();
}

function atualizarListaCompleta() {
    const palavrasPorTamanho = {};
    
    // Agrupa todas as palavras por tamanho
    palavrasBase.forEach(palavra => {
        const tamanho = palavra.length;
        if (!palavrasPorTamanho[tamanho]) {
            palavrasPorTamanho[tamanho] = [];
        }
        palavrasPorTamanho[tamanho].push(palavra);
    });

    let html = '';
    
    // Ordena por tamanho (4, 5, 6 letras...)
    Object.keys(palavrasPorTamanho)
        .sort((a, b) => a - b)
        .forEach(tamanho => {
            html += `<div class="grupo-tamanho">
                        <h4>${tamanho} LETRAS:</h4>
                        <div class="lista-palavras">`;
            
            // Ordena as palavras alfabeticamente e renderiza
            palavrasPorTamanho[tamanho]
                .sort((a, b) => a.localeCompare(b))
                .forEach(palavra => {
                    const foiEncontrada = palavrasAcertadas.includes(palavra);
                    html += `<span class="item-palavra ${foiEncontrada ? 'palavra-encontrada' : 'palavra-faltante'}">
                                ${foiEncontrada ? palavra : '_'.repeat(palavra.length)}
                            </span>`;
                });
            
            html += `</div></div>`;
        });
    
    document.getElementById("lista-completa").innerHTML = html;
}

function triggerConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f']
    });
}

function reiniciarJogo() {
    palavrasAcertadas = [];
    document.getElementById("palavra-input").value = "";
    document.getElementById("resultado").textContent = "";
    document.getElementById("palavras-encontradas").textContent = "0";
    atualizarListaCompleta();
    document.getElementById("palavra-input").focus();
}

// INICIALIZAÇÃO
window.onload = iniciarJogo;
