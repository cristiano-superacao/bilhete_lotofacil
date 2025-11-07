import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaAtrasados(numerosAtrasados) {
    const quantidadeAtrasados = Math.floor(15 * 0.6); // 60%
    let jogo = pegarAleatorios(numerosAtrasados, Math.min(quantidadeAtrasados, numerosAtrasados.length));
    const todasDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    const dezenasRestantes = todasDezenas.filter(n => !jogo.includes(n));
    jogo.push(...pegarAleatorios(dezenasRestantes, 15 - jogo.length));
    return jogo.sort((a, b) => a - b);
}