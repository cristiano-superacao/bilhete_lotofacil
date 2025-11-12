import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaRepeticaoInteligente(ultimoResultado, frequencias) {
    const todosNumeros = Array.from({length: 25}, (_, i) => i + 1);
    let jogo = [];
    let tentativas = 0;
    const maxTentativas = 500;
    
    // Se não tem último resultado, usa aleatório com validações
    if (!ultimoResultado || !Array.isArray(ultimoResultado) || ultimoResultado.length !== 15) {
        return gerarComValidacoesMinimas(todosNumeros);
    }
    
    // Análise estatística: 60% dos concursos repetem 5-7 números do sorteio anterior
    // Vamos usar essa estratégia de repetição inteligente
    
    while (tentativas < maxTentativas) {
        jogo = [];
        
        // 1. SELECIONAR 5-6 NÚMEROS DO ÚLTIMO RESULTADO
        // Preferir os mais frequentes do último resultado
        const numerosUltimoOrdenados = [...ultimoResultado].sort((a, b) => {
            const freqA = frequencias[a] || 0;
            const freqB = frequencias[b] || 0;
            return freqB - freqA; // Mais frequentes primeiro
        });
        
        const quantidadeRepetir = 5 + Math.floor(Math.random() * 2); // 5 ou 6
        const numerosRepetidos = numerosUltimoOrdenados.slice(0, quantidadeRepetir);
        jogo.push(...numerosRepetidos);
        
        // 2. ADICIONAR NÚMEROS FREQUENTES NÃO PRESENTES NO ÚLTIMO
        const numerosNaoPresentes = todosNumeros.filter(n => !ultimoResultado.includes(n));
        const frequentesNaoPresentes = numerosNaoPresentes
            .sort((a, b) => (frequencias[b] || 0) - (frequencias[a] || 0))
            .slice(0, 10);
        
        const quantidadeFrequentes = 4 + Math.floor(Math.random() * 2); // 4 ou 5
        const numerosFrequentes = pegarAleatorios(frequentesNaoPresentes, quantidadeFrequentes);
        jogo.push(...numerosFrequentes);
        
        // 3. COMPLETAR COM NÚMEROS BALANCEADOS
        const faltam = 15 - jogo.length;
        if (faltam > 0) {
            const disponiveis = todosNumeros.filter(n => !jogo.includes(n));
            
            // Pegar números que ajudam no balanço par/ímpar
            const paresAtuais = jogo.filter(n => n % 2 === 0).length;
            const imparesAtuais = jogo.length - paresAtuais;
            
            let numerosComplementares = [];
            if (paresAtuais < imparesAtuais) {
                // Precisa mais pares
                const pares = disponiveis.filter(n => n % 2 === 0);
                const impares = disponiveis.filter(n => n % 2 !== 0);
                const qtdPares = Math.ceil(faltam * 0.6);
                numerosComplementares.push(...pegarAleatorios(pares, Math.min(qtdPares, pares.length)));
                if (numerosComplementares.length < faltam) {
                    numerosComplementares.push(...pegarAleatorios(impares, faltam - numerosComplementares.length));
                }
            } else {
                // Precisa mais ímpares
                const pares = disponiveis.filter(n => n % 2 === 0);
                const impares = disponiveis.filter(n => n % 2 !== 0);
                const qtdImpares = Math.ceil(faltam * 0.6);
                numerosComplementares.push(...pegarAleatorios(impares, Math.min(qtdImpares, impares.length)));
                if (numerosComplementares.length < faltam) {
                    numerosComplementares.push(...pegarAleatorios(pares, faltam - numerosComplementares.length));
                }
            }
            
            jogo.push(...numerosComplementares.slice(0, faltam));
        }
        
        // 4. VALIDAÇÕES ESTATÍSTICAS
        
        // Validação Par/Ímpar (deve ser 7-8 ou 8-7)
        const pares = jogo.filter(n => n % 2 === 0).length;
        const impares = jogo.length - pares;
        
        if (!((pares === 7 && impares === 8) || (pares === 8 && impares === 7))) {
            tentativas++;
            continue;
        }
        
        // Validação Cobertura de Colunas (todas as 5 colunas)
        const colunas = [
            jogo.some(n => n >= 1 && n <= 5),
            jogo.some(n => n >= 6 && n <= 10),
            jogo.some(n => n >= 11 && n <= 15),
            jogo.some(n => n >= 16 && n <= 20),
            jogo.some(n => n >= 21 && n <= 25)
        ];
        
        if (!colunas.every(Boolean)) {
            tentativas++;
            continue;
        }
        
        // Validação Soma (185-205)
        const soma = jogo.reduce((acc, num) => acc + num, 0);
        if (soma < 185 || soma > 205) {
            tentativas++;
            continue;
        }
        
        // Validação Sequências (máximo 3 consecutivos)
        const jogoOrdenado = [...jogo].sort((a, b) => a - b);
        let maxSequencia = 1;
        let sequenciaAtual = 1;
        
        for (let i = 1; i < jogoOrdenado.length; i++) {
            if (jogoOrdenado[i] === jogoOrdenado[i-1] + 1) {
                sequenciaAtual++;
                maxSequencia = Math.max(maxSequencia, sequenciaAtual);
            } else {
                sequenciaAtual = 1;
            }
        }
        
        if (maxSequencia <= 3) {
            // TODAS AS VALIDAÇÕES PASSARAM!
            return jogo.sort((a, b) => a - b);
        }
        
        tentativas++;
    }
    
    // Fallback
    return gerarComValidacoesMinimas(todosNumeros);
}

function gerarComValidacoesMinimas(todosNumeros) {
    let jogo = [];
    let tentativas = 0;
    
    while (tentativas < 200) {
        jogo = pegarAleatorios(todosNumeros, 15);
        
        // Validar apenas par/ímpar e cobertura de colunas
        const pares = jogo.filter(n => n % 2 === 0).length;
        const impares = jogo.length - pares;
        
        const colunas = [
            jogo.some(n => n >= 1 && n <= 5),
            jogo.some(n => n >= 6 && n <= 10),
            jogo.some(n => n >= 11 && n <= 15),
            jogo.some(n => n >= 16 && n <= 20),
            jogo.some(n => n >= 21 && n <= 25)
        ];
        
        if (((pares === 7 && impares === 8) || (pares === 8 && impares === 7)) && colunas.every(Boolean)) {
            return jogo.sort((a, b) => a - b);
        }
        
        tentativas++;
    }
    
    // Último recurso: aleatório puro
    return pegarAleatorios(todosNumeros, 15).sort((a, b) => a - b);
}
