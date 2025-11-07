import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaCicloDezenas(cicloAbertas, cicloFechadas) {
    // Prioriza dezenas que faltam fechar o ciclo
    const jogo = [];
    
    // Adiciona dezenas do ciclo aberto (que ainda não saíram)
    if (cicloAbertas && cicloAbertas.length > 0) {
        const qtdAbertas = Math.min(10, cicloAbertas.length);
        jogo.push(...pegarAleatorios(cicloAbertas, qtdAbertas));
    }
    
    // Completa com dezenas do ciclo fechado se necessário
    if (cicloFechadas && cicloFechadas.length > 0 && jogo.length < 15) {
        const qtdFechadas = Math.min(15 - jogo.length, cicloFechadas.length);
        const fechadasSelecionadas = pegarAleatorios(cicloFechadas, qtdFechadas);
        jogo.push(...fechadasSelecionadas.filter(n => !jogo.includes(n)));
    }
    
    // Se ainda não tiver 15 dezenas, completa com números aleatórios
    if (jogo.length < 15) {
        const todosNumeros = Array.from({length: 25}, (_, i) => i + 1);
        const disponiveis = todosNumeros.filter(n => !jogo.includes(n));
        const faltam = 15 - jogo.length;
        jogo.push(...pegarAleatorios(disponiveis, faltam));
    }
    
    return jogo.sort((a, b) => a - b);
}