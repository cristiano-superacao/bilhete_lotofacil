import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaParImpar() {
    const pares = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
    const impares = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
    const quantidadePares = Math.random() < 0.5 ? 7 : 8;
    const quantidadeImpares = 15 - quantidadePares;
    let jogo = [];
    jogo.push(...pegarAleatorios(pares, quantidadePares));
    jogo.push(...pegarAleatorios(impares, quantidadeImpares));
    return jogo.sort((a, b) => a - b);
}