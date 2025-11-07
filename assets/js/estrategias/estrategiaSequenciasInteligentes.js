import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaSequenciasInteligentes() {
    const todasDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    const jogo = [];
    let tentativas = 0;
    const maxTentativas = 1000;
    
    while (jogo.length < 15 && tentativas < maxTentativas) {
        const candidato = todasDezenas[Math.floor(Math.random() * todasDezenas.length)];
        
        // Verifica se o número já está no jogo
        if (jogo.includes(candidato)) {
            tentativas++;
            continue;
        }
        
        // Verifica se criar uma sequência de 3 ou mais números consecutivos
        const criaSequencia = jogo.some(num => {
            // Verifica sequência de 3: num, num+1, candidato (ou variações)
            return (
                (jogo.includes(num + 1) && candidato === num + 2) ||
                (jogo.includes(num - 1) && candidato === num - 2) ||
                (candidato === num + 1 && jogo.includes(num + 2)) ||
                (candidato === num - 1 && jogo.includes(num - 2))
            );
        });
        
        if (!criaSequencia) {
            jogo.push(candidato);
        }
        
        tentativas++;
    }
    
    // Se não conseguiu 15 números sem sequências muito longas, completa com aleatórios
    if (jogo.length < 15) {
        const faltam = todasDezenas.filter(n => !jogo.includes(n));
        jogo.push(...pegarAleatorios(faltam, 15 - jogo.length));
    }
    
    return jogo.sort((a, b) => a - b);
}