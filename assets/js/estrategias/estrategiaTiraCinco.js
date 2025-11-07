import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaTiraCinco(menosFrequentes) {
    const todasDezenas = Array.from({ length: 25 }, (_, i) => i + 1);
    const dezenasDisponiveis = todasDezenas.filter(n => !menosFrequentes.includes(n));
    return pegarAleatorios(dezenasDisponiveis, 15).sort((a, b) => a - b);
}