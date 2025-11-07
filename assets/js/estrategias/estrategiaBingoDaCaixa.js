import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaBingoDaCaixa(numerosReferencia) {
    // Usa os 9 números de referência como base (mais frequentes)
    const base = [...numerosReferencia];
    
    // Cria pool de números complementares (excluindo os de referência)
    const todosNumeros = Array.from({length: 25}, (_, i) => i + 1);
    const complementares = todosNumeros.filter(n => !base.includes(n));
    
    // Seleciona 6 números complementares para completar os 15
    const selecionados = pegarAleatorios(complementares, 6);
    
    // Retorna 9 de referência + 6 complementares = 15 dezenas
    return [...base, ...selecionados].sort((a, b) => a - b);
}