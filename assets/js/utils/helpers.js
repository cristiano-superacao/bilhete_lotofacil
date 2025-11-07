import { pegarAleatorios } from './pegarAleatorios.js';

/**
 * Calcula a frequência de cada número nos resultados fornecidos.
 * @param {Array} resultados - Array de objetos de resultado de concurso.
 * @returns {Object} - Objeto com a frequência de cada número.
 */
function calcularFrequencia(resultados) {
    const frequencia = {};
    for (let i = 1; i <= 25; i++) {
        frequencia[i] = 0;
    }
    if (resultados && resultados.length > 0) {
        resultados.forEach(resultado => {
            if (resultado && resultado.dezenas && Array.isArray(resultado.dezenas)) {
                resultado.dezenas.forEach(numero => {
                    const num = parseInt(numero);
                    if (num >= 1 && num <= 25) {
                        frequencia[num]++;
                    }
                });
            }
        });
    }
    return frequencia;
}

/**
 * Calcula os números mais frequentes (quentes).
 * @param {Array} ultimosResultados - Array com os últimos resultados.
 * @returns {Array} - Array com os números ordenados por frequência.
 */
export function calcularFrequenciasGlobais(ultimosResultados) {
    if (!ultimosResultados || ultimosResultados.length === 0) return [];
    const frequencia = calcularFrequencia(ultimosResultados);
    return Object.entries(frequencia)
        .sort(([, a], [, b]) => b - a)
        .map(([num]) => parseInt(num));
}

/**
 * Calcula a frequência dos números nos últimos 30 resultados (mensal).
 * @param {Array} ultimosResultados - Array com os últimos resultados.
 * @returns {Array} - Array com os números ordenados por frequência.
 */
export function calcularFrequenciasMensal(ultimosResultados) {
    if (!ultimosResultados || ultimosResultados.length === 0) return [];
    const concursosMensal = ultimosResultados.slice(0, 30);
    const frequencia = calcularFrequencia(concursosMensal);
    return Object.entries(frequencia)
        .sort(([, a], [, b]) => b - a)
        .map(([num]) => parseInt(num));
}

/**
 * Calcula os números menos frequentes (atrasados) nos últimos 30 concursos.
 * @param {Array} ultimosResultados - Array com os últimos resultados.
 * @returns {Array} - Array com os 15 números menos frequentes.
 */
export function calcularNumerosAtrasados(ultimosResultados) {
    if (!ultimosResultados || ultimosResultados.length === 0) {
        return Array.from({ length: 25 }, (_, i) => i + 1);
    }
    const concursosRecentes = ultimosResultados.slice(0, 30);
    const frequencia = calcularFrequencia(concursosRecentes);
    return Object.entries(frequencia)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 15)
        .map(([num]) => parseInt(num));
}

/**
 * Calcula os números menos frequentes em um conjunto de resultados.
 * @param {Array} ultimosResultados - Array com os últimos resultados.
 * @param {number} quantidade - A quantidade de números menos frequentes a retornar.
 * @returns {Array} - Array com os números menos frequentes.
 */
export function calcularNumerosMenosFrequentes(ultimosResultados, quantidade) {
    if (!ultimosResultados || ultimosResultados.length === 0) return [];
    const frequencia = calcularFrequencia(ultimosResultados);
    return Object.entries(frequencia)
        .sort(([, a], [, b]) => a - b)
        .slice(0, quantidade)
        .map(([num]) => parseInt(num));
}


/**
 * Calcula as dezenas que faltam para fechar o ciclo nos últimos `numConcursos`.
 * @param {Array} ultimosResultados - Array com os últimos resultados.
 * @param {number} numConcursos - Número de concursos para analisar o ciclo.
 * @returns {Array} - Array com as dezenas do ciclo.
 */
export function calcularDezenasCiclo(ultimosResultados, numConcursos = 10) {
    const dezenasSorteadas = new Set();
    const concursosRecentes = ultimosResultados.slice(0, numConcursos);

    if (concursosRecentes.length < numConcursos) {
        console.warn("Não há dados suficientes para calcular o ciclo completo.");
        return calcularNumerosMenosFrequentes(ultimosResultados, 5); // Fallback
    }

    concursosRecentes.forEach(concurso => {
        concurso.dezenas.forEach(dezena => dezenasSorteadas.add(parseInt(dezena)));
    });

    const dezenasCiclo = [];
    for (let i = 1; i <= 25; i++) {
        if (!dezenasSorteadas.has(i)) {
            dezenasCiclo.push(i);
        }
    }
    
    // Se o ciclo fechou, retorna os 3 menos frequentes como fallback
    return dezenasCiclo.length > 0 ? dezenasCiclo : calcularNumerosMenosFrequentes(ultimosResultados, 3);
}


/**
 * Gera um jogo aleatório de 15 números.
 * @returns {Array} - Jogo aleatório ordenado.
 */
export function gerarJogoAleatorio() {
    const todasDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    return pegarAleatorios(todasDezenas, 15).sort((a, b) => a - b);
}

/**
 * Exibe os jogos gerados na interface.
 * @param {Array} jogosGerados - Array de jogos para exibir.
 * @param {Array} analises - Array com as definições das análises/estratégias.
 * @param {number} estrategiaAtual - ID da estratégia usada.
 */
export function exibirJogosGerados(jogosGerados, analises, estrategiaAtual) {
    const container = document.getElementById('jogosGerados');
    const estrategiaNome = document.getElementById('estrategiaUsada');
    const secaoResultados = document.getElementById('resultados');

    if (!container || !estrategiaNome || !secaoResultados) {
        console.error('Elementos da seção de resultados não encontrados no DOM');
        return;
    }

    const estrategia = analises.find(a => a.id === estrategiaAtual);
    if (estrategia) {
        estrategiaNome.textContent = estrategia.titulo;
    } else {
        estrategiaNome.textContent = 'Estratégia Desconhecida';
    }

    container.innerHTML = '';
    if (jogosGerados && jogosGerados.length > 0) {
        jogosGerados.forEach((jogo, index) => {
            const jogoDiv = document.createElement('div');
            jogoDiv.className = 'bg-gray-50 rounded-lg p-4';
            jogoDiv.innerHTML = `
                <div class="flex items-center justify-between mb-3">
                    <span class="font-semibold text-gray-700">Jogo ${index + 1}</span>
                    <span class="text-xs text-gray-500">${jogo.length} números</span>
                </div>
                <div class="flex flex-wrap gap-2 numeros-aposta">
                    ${jogo.map(num => `
                        <span class="number-ball number-ball-game">
                            ${num.toString().padStart(2, '0')}
                        </span>
                    `).join('')}
                </div>
            `;
            container.appendChild(jogoDiv);
        });
    } else {
        container.innerHTML = '<p class="text-center text-gray-500 col-span-full">Não foi possível gerar jogos com esta estratégia. Tente novamente ou escolha outra.</p>';
    }

    secaoResultados.classList.remove('hidden');

    // Salvar no localStorage para persistência na sessão
    try {
        localStorage.setItem('jogosGerados', JSON.stringify({
            jogos: jogosGerados,
            estrategia: estrategiaAtual,
            data: new Date().toISOString()
        }));
    } catch (e) {
        console.warn("Não foi possível salvar os jogos gerados no localStorage.", e);
    }
}
