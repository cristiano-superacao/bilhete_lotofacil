import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaHibridaOtimizada(frequencias, ultimoResultado, numerosAtrasados) {
    const todosNumeros = Array.from({length: 25}, (_, i) => i + 1);
    
    // 1. FREQUÊNCIA (40% do jogo - 6 números)
    // Pega os 6 números mais frequentes
    const numerosFrequentes = Object.entries(frequencias)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
        .map(([num]) => parseInt(num));
    
    let jogo = [...numerosFrequentes];
    
    // 2. REPETIÇÃO (27% do jogo - 4 números)
    // Pega 4 números do último resultado que também sejam frequentes
    if (ultimoResultado && ultimoResultado.dezenas) {
        const dezenasUltimo = ultimoResultado.dezenas.map(d => parseInt(d));
        const candidatos = dezenasUltimo.filter(n => !jogo.includes(n));
        
        if (candidatos.length >= 4) {
            // Prioriza os que também são frequentes
            const candidatosOrdenados = candidatos.sort((a, b) => 
                (frequencias[b] || 0) - (frequencias[a] || 0)
            );
            jogo.push(...candidatosOrdenados.slice(0, 4));
        } else {
            // Se não tem 4 do último, completa com frequentes
            const maisFrequentes = Object.entries(frequencias)
                .sort(([, a], [, b]) => b - a)
                .map(([num]) => parseInt(num))
                .filter(n => !jogo.includes(n));
            jogo.push(...maisFrequentes.slice(0, 4 - candidatos.length));
            jogo.push(...candidatos);
        }
    } else {
        // Se não tem último resultado, pega mais frequentes
        const maisFrequentes = Object.entries(frequencias)
            .sort(([, a], [, b]) => b - a)
            .map(([num]) => parseInt(num))
            .filter(n => !jogo.includes(n));
        jogo.push(...maisFrequentes.slice(0, 4));
    }
    
    // 3. ATRASADOS (20% do jogo - 3 números)
    // Pega números que estão atrasados mas não extremamente
    if (numerosAtrasados && numerosAtrasados.length > 0) {
        const atrasadosModerados = numerosAtrasados
            .filter(n => !jogo.includes(n))
            .slice(0, 10); // Pega dos 10 mais atrasados
        
        if (atrasadosModerados.length >= 3) {
            jogo.push(...pegarAleatorios(atrasadosModerados, 3));
        } else {
            const disponiveis = todosNumeros.filter(n => !jogo.includes(n));
            jogo.push(...pegarAleatorios(disponiveis, 3 - atrasadosModerados.length));
            jogo.push(...atrasadosModerados);
        }
    } else {
        const disponiveis = todosNumeros.filter(n => !jogo.includes(n));
        jogo.push(...pegarAleatorios(disponiveis, 3));
    }
    
    // 4. ALEATÓRIOS INTELIGENTES (13% do jogo - 2 números)
    // Completa validando par/ímpar e colunas
    let tentativas = 0;
    const maxTentativas = 100;
    
    while (jogo.length < 15 && tentativas < maxTentativas) {
        const disponiveis = todosNumeros.filter(n => !jogo.includes(n));
        const candidato = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        
        const jogoTemp = [...jogo, candidato];
        const pares = jogoTemp.filter(n => n % 2 === 0).length;
        const impares = jogoTemp.length - pares;
        
        // Aceita se mantém ou melhora o equilíbrio
        if (jogo.length < 14 || (pares === 7 && impares === 8) || (pares === 8 && impares === 7)) {
            jogo.push(candidato);
        }
        
        tentativas++;
    }
    
    // Completar se faltar
    if (jogo.length < 15) {
        const disponiveis = todosNumeros.filter(n => !jogo.includes(n));
        jogo.push(...pegarAleatorios(disponiveis, 15 - jogo.length));
    }
    
    // VALIDAÇÕES FINAIS
    // Ajustar par/ímpar se necessário
    const pares = jogo.filter(n => n % 2 === 0).length;
    if (pares < 7 || pares > 8) {
        // Tenta ajustar trocando 1 número
        const disponiveis = todosNumeros.filter(n => !jogo.includes(n));
        if (disponiveis.length > 0) {
            if (pares < 7) {
                // Precisa de mais pares
                const imparNoJogo = jogo.find(n => n % 2 !== 0);
                const parDisponivel = disponiveis.find(n => n % 2 === 0);
                if (imparNoJogo && parDisponivel) {
                    jogo = jogo.filter(n => n !== imparNoJogo);
                    jogo.push(parDisponivel);
                }
            } else {
                // Precisa de mais ímpares
                const parNoJogo = jogo.find(n => n % 2 === 0);
                const imparDisponivel = disponiveis.find(n => n % 2 !== 0);
                if (parNoJogo && imparDisponivel) {
                    jogo = jogo.filter(n => n !== parNoJogo);
                    jogo.push(imparDisponivel);
                }
            }
        }
    }
    
    // Validar soma
    let soma = jogo.reduce((acc, n) => acc + n, 0);
    let ajustes = 0;
    const maxAjustes = 10;
    
    while ((soma < 185 || soma > 205) && ajustes < maxAjustes) {
        if (soma < 185) {
            // Trocar número baixo por alto
            const numerosBaixos = jogo.filter(n => n <= 12).sort((a, b) => a - b);
            const disponiveisAltos = todosNumeros.filter(n => n >= 13 && !jogo.includes(n));
            
            if (numerosBaixos.length > 0 && disponiveisAltos.length > 0) {
                jogo = jogo.filter(n => n !== numerosBaixos[0]);
                jogo.push(disponiveisAltos[disponiveisAltos.length - 1]);
            } else {
                break;
            }
        } else {
            // Trocar número alto por baixo
            const numerosAltos = jogo.filter(n => n >= 14).sort((a, b) => b - a);
            const disponiveisBaixos = todosNumeros.filter(n => n <= 13 && !jogo.includes(n));
            
            if (numerosAltos.length > 0 && disponiveisBaixos.length > 0) {
                jogo = jogo.filter(n => n !== numerosAltos[0]);
                jogo.push(disponiveisBaixos[0]);
            } else {
                break;
            }
        }
        
        soma = jogo.reduce((acc, n) => acc + n, 0);
        ajustes++;
    }
    
    return jogo.sort((a, b) => a - b);
}
