import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaForcaPrimos() {
    // Números primos até 25: 2, 3, 5, 7, 11, 13, 17, 19, 23
    const primos = [2, 3, 5, 7, 11, 13, 17, 19, 23];
    
    // Números não-primos de 1 a 25
    const naoPrimos = [1, 4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25];
    
    // Seleciona aleatoriamente entre 4 e 6 números primos
    const qtdPrimos = 4 + Math.floor(Math.random() * 3); // 4, 5 ou 6
    const selecionadosPrimos = pegarAleatorios(primos, qtdPrimos);
    
    // Completa com números não-primos até 15
    const qtdNaoPrimos = 15 - qtdPrimos;
    const selecionadosNaoPrimos = pegarAleatorios(naoPrimos, qtdNaoPrimos);
    
    return [...selecionadosPrimos, ...selecionadosNaoPrimos].sort((a, b) => a - b);
}