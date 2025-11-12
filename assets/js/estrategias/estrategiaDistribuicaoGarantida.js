import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaDistribuicaoGarantida(frequencias) {
    const todosNumeros = Array.from({length: 25}, (_, i) => i + 1);
    let jogo = [];
    let tentativas = 0;
    const maxTentativas = 1000;
    
    while (tentativas < maxTentativas) {
        jogo = [];
        
        // 1. Garantir distribuição por colunas (5 colunas: 1-5, 6-10, 11-15, 16-20, 21-25)
        const colunas = [
            [1,2,3,4,5],
            [6,7,8,9,10],
            [11,12,13,14,15],
            [16,17,18,19,20],
            [21,22,23,24,25]
        ];
        
        // Seleciona 2-4 números de cada coluna para garantir cobertura
        const numerosPorColuna = [3, 3, 3, 3, 3]; // 15 números distribuídos
        
        colunas.forEach((coluna, index) => {
            const selecionados = pegarAleatorios(coluna, numerosPorColuna[index]);
            jogo.push(...selecionados);
        });
        
        // 2. Validar equilíbrio par/ímpar (deve ser 7-8 ou 8-7)
        const pares = jogo.filter(n => n % 2 === 0).length;
        const impares = jogo.length - pares;
        
        if ((pares === 7 && impares === 8) || (pares === 8 && impares === 7)) {
            // 3. Validar distribuição de finais (terminações)
            const finais = {};
            jogo.forEach(num => {
                const final = num % 10;
                finais[final] = (finais[final] || 0) + 1;
            });
            
            // Deve ter pelo menos 7 finais diferentes
            const finaisDiferentes = Object.keys(finais).length;
            // Nenhum final pode se repetir mais de 2 vezes
            const maxRepeticoes = Math.max(...Object.values(finais));
            
            if (finaisDiferentes >= 7 && maxRepeticoes <= 2) {
                // 4. Validar soma total (deve estar entre 185 e 205)
                const soma = jogo.reduce((acc, num) => acc + num, 0);
                
                if (soma >= 185 && soma <= 205) {
                    // 5. Garantir pelo menos 1 número primo
                    const primos = [2, 3, 5, 7, 11, 13, 17, 19, 23];
                    const temPrimo = jogo.some(n => primos.includes(n));
                    
                    if (temPrimo) {
                        // 6. Evitar sequências longas (máximo 3 consecutivos)
                        const jogoOrdenado = [...jogo].sort((a, b) => a - b);
                        let sequenciaMaxima = 1;
                        let sequenciaAtual = 1;
                        
                        for (let i = 1; i < jogoOrdenado.length; i++) {
                            if (jogoOrdenado[i] === jogoOrdenado[i-1] + 1) {
                                sequenciaAtual++;
                                sequenciaMaxima = Math.max(sequenciaMaxima, sequenciaAtual);
                            } else {
                                sequenciaAtual = 1;
                            }
                        }
                        
                        if (sequenciaMaxima <= 3) {
                            // TODAS AS VALIDAÇÕES PASSARAM!
                            return jogo.sort((a, b) => a - b);
                        }
                    }
                }
            }
        }
        
        tentativas++;
    }
    
    // Fallback: se não conseguiu gerar com todas as validações, gera com mínimas
    jogo = [];
    const colunas = [
        [1,2,3,4,5],
        [6,7,8,9,10],
        [11,12,13,14,15],
        [16,17,18,19,20],
        [21,22,23,24,25]
    ];
    
    colunas.forEach(coluna => {
        jogo.push(...pegarAleatorios(coluna, 3));
    });
    
    return jogo.sort((a, b) => a - b);
}
