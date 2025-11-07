import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaFrequenciaMensal(frequenciasMensal) {
    const quantidadeFrequentes = Math.floor(15 * 0.6); // 60%
    let jogo = pegarAleatorios(frequenciasMensal.slice(0, 12), quantidadeFrequentes);
    const todasDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    const dezenasRestantes = todasDezenas.filter(n => !jogo.includes(n));
    jogo.push(...pegarAleatorios(dezenasRestantes, 15 - jogo.length));
    return jogo.sort((a, b) => a - b);
}