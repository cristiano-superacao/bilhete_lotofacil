import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaFechamentoMatematico(frequencias) {
    const todosNumeros = Array.from({length: 25}, (_, i) => i + 1);
    let jogo = [];
    let tentativas = 0;
    const maxTentativas = 500;
    
    while (tentativas < maxTentativas) {
        jogo = [];
        
        // Gera jogo base com boa distribuição
        const colunas = [
            [1,2,3,4,5],
            [6,7,8,9,10],
            [11,12,13,14,15],
            [16,17,18,19,20],
            [21,22,23,24,25]
        ];
        
        // Distribui pelos grupos para garantir cobertura
        colunas.forEach(coluna => {
            jogo.push(...pegarAleatorios(coluna, 3));
        });
        
        // 1. VALIDAR SOMA (deve estar entre 185 e 205)
        let soma = jogo.reduce((acc, num) => acc + num, 0);
        
        // Ajustar soma se necessário
        let ajustes = 0;
        while ((soma < 185 || soma > 205) && ajustes < 20) {
            if (soma < 185) {
                // Trocar número baixo por alto
                const numerosBaixos = jogo.filter(n => n <= 10).sort((a, b) => a - b);
                const disponiveisAltos = todosNumeros.filter(n => n >= 15 && !jogo.includes(n));
                
                if (numerosBaixos.length > 0 && disponiveisAltos.length > 0) {
                    const remover = numerosBaixos[0];
                    const adicionar = pegarAleatorios(disponiveisAltos, 1)[0];
                    jogo = jogo.filter(n => n !== remover);
                    jogo.push(adicionar);
                    soma = soma - remover + adicionar;
                } else {
                    break;
                }
            } else {
                // Trocar número alto por baixo
                const numerosAltos = jogo.filter(n => n >= 16).sort((a, b) => b - a);
                const disponiveisBaixos = todosNumeros.filter(n => n <= 10 && !jogo.includes(n));
                
                if (numerosAltos.length > 0 && disponiveisBaixos.length > 0) {
                    const remover = numerosAltos[0];
                    const adicionar = pegarAleatorios(disponiveisBaixos, 1)[0];
                    jogo = jogo.filter(n => n !== remover);
                    jogo.push(adicionar);
                    soma = soma - remover + adicionar;
                } else {
                    break;
                }
            }
            ajustes++;
        }
        
        // Se a soma não está no range, recomeça
        if (soma < 185 || soma > 205) {
            tentativas++;
            continue;
        }
        
        // 2. VALIDAR DISTRIBUIÇÃO DE FINAIS
        const finais = {};
        jogo.forEach(num => {
            const final = num % 10;
            finais[final] = (finais[final] || 0) + 1;
        });
        
        const finaisDiferentes = Object.keys(finais).length;
        const maxRepeticoes = Math.max(...Object.values(finais));
        
        // Deve ter pelo menos 7 finais diferentes e máximo 2 repetições
        if (finaisDiferentes >= 7 && maxRepeticoes <= 2) {
            // 3. VALIDAR PAR/ÍMPAR
            const pares = jogo.filter(n => n % 2 === 0).length;
            const impares = jogo.length - pares;
            
            if ((pares === 7 && impares === 8) || (pares === 8 && impares === 7)) {
                // 4. VALIDAR COBERTURA DE FAIXAS
                const faixas = [
                    jogo.some(n => n >= 1 && n <= 5),
                    jogo.some(n => n >= 6 && n <= 10),
                    jogo.some(n => n >= 11 && n <= 15),
                    jogo.some(n => n >= 16 && n <= 20),
                    jogo.some(n => n >= 21 && n <= 25)
                ];
                
                if (faixas.every(Boolean)) {
                    // 5. VALIDAR QUE NÃO TEM MAIS DE 4 NÚMEROS NA MESMA DEZENA
                    const dezenas = {};
                    jogo.forEach(num => {
                        const dezena = Math.floor((num - 1) / 5); // 0-4 representando as 5 dezenas
                        dezenas[dezena] = (dezenas[dezena] || 0) + 1;
                    });
                    
                    const maxPorDezena = Math.max(...Object.values(dezenas));
                    
                    if (maxPorDezena <= 4) {
                        // TODAS AS VALIDAÇÕES PASSARAM!
                        return jogo.sort((a, b) => a - b);
                    }
                }
            }
        }
        
        tentativas++;
    }
    
    // Fallback: gera com validações mínimas
    jogo = pegarAleatorios(todosNumeros, 15);
    
    // Força soma no range
    let soma = jogo.reduce((acc, n) => acc + n, 0);
    let ajustes = 0;
    
    while ((soma < 185 || soma > 205) && ajustes < 50) {
        if (soma < 185) {
            const idx = Math.floor(Math.random() * jogo.length);
            const atual = jogo[idx];
            const disponiveisAltos = todosNumeros.filter(n => n > atual && !jogo.includes(n));
            if (disponiveisAltos.length > 0) {
                const novo = pegarAleatorios(disponiveisAltos, 1)[0];
                jogo[idx] = novo;
                soma = soma - atual + novo;
            }
        } else {
            const idx = Math.floor(Math.random() * jogo.length);
            const atual = jogo[idx];
            const disponiveisBaixos = todosNumeros.filter(n => n < atual && !jogo.includes(n));
            if (disponiveisBaixos.length > 0) {
                const novo = pegarAleatorios(disponiveisBaixos, 1)[0];
                jogo[idx] = novo;
                soma = soma - atual + novo;
            }
        }
        ajustes++;
    }
    
    return jogo.sort((a, b) => a - b);
}
