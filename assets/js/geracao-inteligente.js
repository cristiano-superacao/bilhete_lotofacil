/**
 * Geração Inteligente de Jogos - Lotofácil
 * Baseado em análise estatística de 500 concursos
 */

// Dados estatísticos reais dos últimos 90 concursos
const NUMEROS_FREQUENTES = [
    { num: 15, freq: 67.8 }, { num: 3, freq: 66.7 }, { num: 1, freq: 63.3 },
    { num: 14, freq: 63.3 }, { num: 22, freq: 63.3 }, { num: 12, freq: 62.2 },
    { num: 25, freq: 62.2 }, { num: 4, freq: 61.1 }, { num: 13, freq: 61.1 },
    { num: 17, freq: 61.1 }
];

const NUMEROS_PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23];

let jogosGerados = [];

/**
 * Obtém classe de frequência de um número
 */
function getClasseFrequencia(numero) {
    const frequente = NUMEROS_FREQUENTES.find(n => n.num === numero);
    if (frequente) return 'frequente';
    if (numero <= 8 || numero >= 20) return 'raro';
    return 'medio';
}

/**
 * Calcula score de um jogo baseado nos critérios
 */
function calcularScore(jogo, criterios) {
    let score = 0;
    let detalhes = [];

    // Critério 1: Números Frequentes (30 pontos)
    if (criterios.frequentes) {
        const frequentesNoJogo = jogo.filter(n => 
            NUMEROS_FREQUENTES.some(f => f.num === n)
        ).length;
        const pontos = Math.min(frequentesNoJogo * 3, 30);
        score += pontos;
        detalhes.push(`${frequentesNoJogo} frequentes (+${pontos})`);
    }

    // Critério 2: Equilíbrio Par/Ímpar (20 pontos)
    if (criterios.equilibrio) {
        const pares = jogo.filter(n => n % 2 === 0).length;
        const impares = 15 - pares;
        const diferenca = Math.abs(pares - impares);
        const pontos = diferenca <= 3 ? 20 : (diferenca <= 5 ? 10 : 0);
        score += pontos;
        detalhes.push(`Par/Ímpar ${pares}/${impares} (+${pontos})`);
    }

    // Critério 3: Sequências Consecutivas (20 pontos)
    if (criterios.sequencias) {
        const ordenado = [...jogo].sort((a, b) => a - b);
        let temSequencia = false;
        for (let i = 0; i < ordenado.length - 2; i++) {
            if (ordenado[i + 1] === ordenado[i] + 1 && 
                ordenado[i + 2] === ordenado[i] + 2) {
                temSequencia = true;
                break;
            }
        }
        const pontos = temSequencia ? 20 : 0;
        score += pontos;
        detalhes.push(`Sequência: ${temSequencia ? 'Sim' : 'Não'} (+${pontos})`);
    }

    // Critério 4: Distribuição Baixos/Altos (15 pontos)
    if (criterios.distribuicao) {
        const baixos = jogo.filter(n => n <= 12).length;
        const altos = 15 - baixos;
        const diferenca = Math.abs(baixos - altos);
        const pontos = diferenca <= 5 ? 15 : (diferenca <= 7 ? 8 : 0);
        score += pontos;
        detalhes.push(`Baixos/Altos ${baixos}/${altos} (+${pontos})`);
    }

    // Critério 5: Números Primos (10 pontos)
    if (criterios.primos) {
        const primosNoJogo = jogo.filter(n => NUMEROS_PRIMOS.includes(n)).length;
        const pontos = (primosNoJogo >= 3 && primosNoJogo <= 5) ? 10 : 0;
        score += pontos;
        detalhes.push(`${primosNoJogo} primos (+${pontos})`);
    }

    // Critério 6: Diversidade (5 pontos)
    const spread = Math.max(...jogo) - Math.min(...jogo);
    const pontos = spread >= 18 ? 5 : 0;
    score += pontos;
    detalhes.push(`Spread ${spread} (+${pontos})`);

    return { score, detalhes };
}

/**
 * Gera um jogo inteligente baseado nos critérios
 */
function gerarJogoInteligente(criterios) {
    const jogo = new Set();
    
    // 1. Adicionar 5-7 números frequentes (se critério ativo)
    if (criterios.frequentes) {
        const qtdFrequentes = 5 + Math.floor(Math.random() * 3);
        const frequentesEmbaralhados = [...NUMEROS_FREQUENTES]
            .sort(() => Math.random() - 0.5)
            .slice(0, qtdFrequentes);
        frequentesEmbaralhados.forEach(item => jogo.add(item.num));
    }

    // 2. Adicionar números para formar sequência (se critério ativo)
    if (criterios.sequencias && jogo.size < 15) {
        const inicio = 3 + Math.floor(Math.random() * 20);
        if (!jogo.has(inicio)) jogo.add(inicio);
        if (!jogo.has(inicio + 1)) jogo.add(inicio + 1);
        if (!jogo.has(inicio + 2)) jogo.add(inicio + 2);
    }

    // 3. Balancear par/ímpar (se critério ativo)
    if (criterios.equilibrio) {
        while (jogo.size < 15) {
            const pares = [...jogo].filter(n => n % 2 === 0).length;
            const impares = jogo.size - pares;
            const precisaPar = pares < impares;
            
            let numero;
            do {
                numero = 1 + Math.floor(Math.random() * 25);
            } while (jogo.has(numero) || (precisaPar && numero % 2 !== 0) || (!precisaPar && numero % 2 === 0));
            
            jogo.add(numero);
        }
    }

    // 4. Completar com números aleatórios
    while (jogo.size < 15) {
        const numero = 1 + Math.floor(Math.random() * 25);
        jogo.add(numero);
    }

    return Array.from(jogo).sort((a, b) => a - b);
}

/**
 * Gera 10 jogos inteligentes
 */
function gerarJogosInteligentes() {
    const criterios = {
        frequentes: document.getElementById('criterio-frequentes').checked,
        equilibrio: document.getElementById('criterio-equilibrio').checked,
        sequencias: document.getElementById('criterio-sequencias').checked,
        distribuicao: document.getElementById('criterio-distribuicao').checked,
        repeticao: document.getElementById('criterio-repeticao').checked,
        primos: document.getElementById('criterio-primos').checked
    };

    jogosGerados = [];
    
    // Gerar jogos candidatos (gerar 20 e pegar os 10 melhores)
    const candidatos = [];
    for (let i = 0; i < 20; i++) {
        const jogo = gerarJogoInteligente(criterios);
        const avaliacao = calcularScore(jogo, criterios);
        candidatos.push({
            jogo,
            score: avaliacao.score,
            detalhes: avaliacao.detalhes
        });
    }

    // Ordenar por score e pegar top 10
    candidatos.sort((a, b) => b.score - a.score);
    jogosGerados = candidatos.slice(0, 10);

    exibirJogos();
    exibirEstatisticas();
}

/**
 * Exibe os jogos gerados
 */
function exibirJogos() {
    const container = document.getElementById('jogos-grid');
    const resultadosContainer = document.getElementById('resultados-container');
    
    resultadosContainer.classList.remove('hidden');
    
    container.innerHTML = jogosGerados.map((item, idx) => {
        const numerosHTML = item.jogo.map(num => {
            const classe = getClasseFrequencia(num);
            return `<div class="w-10 h-10 rounded-lg numero-${classe} flex items-center justify-center font-bold text-sm">
                ${num.toString().padStart(2, '0')}
            </div>`;
        }).join('');

        const detalhesHTML = item.detalhes.map(d => 
            `<span class="inline-block bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 mr-1 mb-1">${d}</span>`
        ).join('');

        return `
            <div class="jogo-card bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-5 border-2 border-gray-200 hover:border-purple-400">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-bold text-gray-800">
                        <i class="fas fa-ticket-alt mr-2 text-purple-500"></i>Jogo ${idx + 1}
                    </h3>
                    <div class="score-badge bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                        ${item.score} pts
                    </div>
                </div>
                
                <div class="grid grid-cols-5 gap-2 mb-3">
                    ${numerosHTML}
                </div>
                
                <div class="mb-3">
                    ${detalhesHTML}
                </div>
                
                <button onclick="copiarJogo(${idx})" class="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors text-sm font-semibold">
                    <i class="fas fa-copy mr-2"></i>Copiar Jogo
                </button>
            </div>
        `;
    }).join('');
}

/**
 * Exibe estatísticas gerais
 */
function exibirEstatisticas() {
    const scoreMedio = (jogosGerados.reduce((sum, j) => sum + j.score, 0) / jogosGerados.length).toFixed(1);
    document.getElementById('score-medio').textContent = scoreMedio;
    
    const numerosUnicos = new Set();
    jogosGerados.forEach(item => item.jogo.forEach(n => numerosUnicos.add(n)));
    document.getElementById('numeros-unicos').textContent = numerosUnicos.size;
}

/**
 * Copia um jogo específico
 */
function copiarJogo(index) {
    const jogo = jogosGerados[index].jogo;
    const texto = jogo.map(n => n.toString().padStart(2, '0')).join(' ');
    
    navigator.clipboard.writeText(texto).then(() => {
        alert(`✅ Jogo ${index + 1} copiado!\n\n${texto}`);
    });
}

/**
 * Copia todos os jogos
 */
function copiarTodosJogos() {
    const texto = jogosGerados.map((item, idx) => {
        const numeros = item.jogo.map(n => n.toString().padStart(2, '0')).join(' ');
        return `Jogo ${idx + 1} (${item.score} pts): ${numeros}`;
    }).join('\n');
    
    navigator.clipboard.writeText(texto).then(() => {
        alert('✅ Todos os jogos copiados para a área de transferência!');
    });
}

/**
 * Exporta jogos para CSV
 */
function exportarJogos() {
    const csv = ['Jogo,Score,Números'].concat(
        jogosGerados.map((item, idx) => {
            const numeros = item.jogo.map(n => n.toString().padStart(2, '0')).join('-');
            return `${idx + 1},${item.score},"${numeros}"`;
        })
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lotofacil_inteligente_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

/**
 * Limpa os jogos gerados
 */
function limparJogos() {
    jogosGerados = [];
    document.getElementById('resultados-container').classList.add('hidden');
}

// Carregar ao iniciar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧠 Sistema de Geração Inteligente carregado');
});
