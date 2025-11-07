import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaDivisaoColunas() {
    const colunas = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25]
    ];
    let jogo = [];
    colunas.forEach(coluna => {
        jogo.push(...pegarAleatorios(coluna, 3));
    });
    return jogo.sort((a, b) => a - b);
}