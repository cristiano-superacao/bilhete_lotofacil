import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaRepetidas(ultimoResultado) {
    if (!ultimoResultado) return [];
    const ultimasDezenas = ultimoResultado.dezenas;
    const quantidadeRepetir = Math.floor(Math.random() * 3) + 5; // 5 a 7 números
    let jogo = pegarAleatorios(ultimasDezenas, quantidadeRepetir);
    const todasDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    const dezenasRestantes = todasDezenas.filter(n => !jogo.includes(n));
    jogo.push(...pegarAleatorios(dezenasRestantes, 15 - jogo.length));
    return jogo.sort((a, b) => a - b);
}