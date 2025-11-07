import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaFrequenciaHistorica(frequencias) {
    const quentes = frequencias.slice(0, 8);
    const frios = frequencias.slice(-8);
    const neutros = frequencias.slice(8, 17);
    let jogo = [];
    jogo.push(...pegarAleatorios(quentes, 7));
    jogo.push(...pegarAleatorios(frios, 5));
    jogo.push(...pegarAleatorios(neutros, 3));
    return jogo.sort((a, b) => a - b);
}