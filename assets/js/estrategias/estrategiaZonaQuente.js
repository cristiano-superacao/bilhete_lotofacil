import { pegarAleatorios } from '../utils/pegarAleatorios.js';

export function estrategiaZonaQuente(frequencias) {
    // Ordena números por frequência (do mais para o menos frequente)
    const numerosOrdenados = Object.entries(frequencias)
        .sort(([, a], [, b]) => b - a)
        .map(([num]) => parseInt(num));
    
    // Divide em 3 zonas
    const zonaQuente = numerosOrdenados.slice(0, 15);  // Top 15 mais frequentes
    const zonaMorna = numerosOrdenados.slice(15, 20);  // Posições 16-20
    const zonaFria = numerosOrdenados.slice(20, 25);   // Posições 21-25
    
    let jogo = [];
    let tentativas = 0;
    const maxTentativas = 100;
    
    while (tentativas < maxTentativas) {
        jogo = [];
        
        // Seleciona 9-10 da zona quente
        const qtdQuente = Math.random() < 0.5 ? 9 : 10;
        jogo.push(...pegarAleatorios(zonaQuente, qtdQuente));
        
        // Seleciona 3-4 da zona morna
        const qtdMorna = 15 - qtdQuente - 2; // O resto menos 2 da fria
        jogo.push(...pegarAleatorios(zonaMorna, qtdMorna));
        
        // Seleciona 2 da zona fria
        jogo.push(...pegarAleatorios(zonaFria, 2));
        
        // Validar equilíbrio par/ímpar
        const pares = jogo.filter(n => n % 2 === 0).length;
        const impares = jogo.length - pares;
        
        if ((pares === 7 && impares === 8) || (pares === 8 && impares === 7)) {
            // Validar que tem números de todas as 5 colunas
            const colunas = [
                jogo.some(n => n >= 1 && n <= 5),
                jogo.some(n => n >= 6 && n <= 10),
                jogo.some(n => n >= 11 && n <= 15),
                jogo.some(n => n >= 16 && n <= 20),
                jogo.some(n => n >= 21 && n <= 25)
            ];
            
            if (colunas.every(Boolean)) {
                return jogo.sort((a, b) => a - b);
            }
        }
        
        tentativas++;
    }
    
    // Fallback: força equilíbrio
    jogo = [];
    jogo.push(...pegarAleatorios(zonaQuente, 10));
    jogo.push(...pegarAleatorios(zonaMorna, 3));
    jogo.push(...pegarAleatorios(zonaFria, 2));
    
    return jogo.sort((a, b) => a - b);
}
