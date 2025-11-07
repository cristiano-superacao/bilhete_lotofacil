import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaMatematicaFinais() {
    let jogo = [];
    const finaisUsados = new Set();
    const todasDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    while (jogo.length < 15) {
        const candidato = todasDezenas[Math.floor(Math.random() * todasDezenas.length)];
        const final = candidato % 10;
        const countFinal = Array.from(finaisUsados).filter(f => f === final).length;
        if (!jogo.includes(candidato) && countFinal < 3) {
            jogo.push(candidato);
            finaisUsados.add(final);
        }
    }
    return jogo.sort((a, b) => a - b);
}