/**
 * Análise de Padrões - Lotofácil
 * 
 * Analisa padrões temporais nos resultados:
 * - Dias da semana com mais sorteios
 * - Padrões de repetição por semana/mês/ano
 * - Números mais sorteados por período
 * - Estatísticas de frequência temporal
 * 
 * Uso: node database/analise-padroes.js
 */

const API_BASE_URL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil';
const TOTAL_CONCURSOS = 500; // Analisar últimos 500 concursos

/**
 * Busca um concurso específico
 */
async function buscarConcurso(numeroConcurso) {
    try {
        const response = await fetch(`${API_BASE_URL}/${numeroConcurso}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error(`❌ Erro concurso ${numeroConcurso}:`, error.message);
        return null;
    }
}

/**
 * Busca múltiplos concursos
 */
async function buscarConcursos(inicio, fim) {
    console.log(`\n🔍 Buscando concursos ${inicio} a ${fim}...`);
    const concursos = [];
    
    for (let num = inicio; num <= fim; num++) {
        const dados = await buscarConcurso(num);
        if (dados) {
            concursos.push(dados);
            process.stdout.write(`\r✓ Carregados: ${concursos.length}/${fim - inicio + 1}`);
        }
        await new Promise(resolve => setTimeout(resolve, 200)); // Rate limit
    }
    
    console.log(`\n✅ Total carregado: ${concursos.length} concursos\n`);
    return concursos;
}

/**
 * Analisa padrões de dias da semana
 */
function analisarDiasDaSemana(concursos) {
    const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const contagem = new Array(7).fill(0);
    const porDia = {};
    
    concursos.forEach(c => {
        const data = new Date(c.dataApuracao);
        const dia = data.getDay();
        contagem[dia]++;
        
        if (!porDia[dia]) porDia[dia] = [];
        porDia[dia].push({
            concurso: c.numero,
            data: c.dataApuracao,
            dezenas: c.listaDezenas
        });
    });
    
    console.log('📅 ANÁLISE POR DIA DA SEMANA');
    console.log('═'.repeat(60));
    contagem.forEach((qtd, idx) => {
        const percentual = ((qtd / concursos.length) * 100).toFixed(1);
        const barra = '█'.repeat(Math.floor(qtd / 5));
        console.log(`${diasSemana[idx].padEnd(10)} │ ${qtd.toString().padStart(3)} sorteios (${percentual}%) ${barra}`);
    });
    
    return { contagem, porDia };
}

/**
 * Analisa padrões mensais
 */
function analisarPadroesMensais(concursos) {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const porMes = {};
    
    concursos.forEach(c => {
        const data = new Date(c.dataApuracao);
        const mes = data.getMonth();
        const ano = data.getFullYear();
        const chave = `${ano}-${mes}`;
        
        if (!porMes[chave]) {
            porMes[chave] = {
                ano,
                mes,
                concursos: [],
                totalSorteios: 0
            };
        }
        
        porMes[chave].concursos.push(c.numero);
        porMes[chave].totalSorteios++;
    });
    
    console.log('\n\n📊 ANÁLISE MENSAL (últimos 12 meses)');
    console.log('═'.repeat(60));
    
    const ordenados = Object.values(porMes).sort((a, b) => {
        if (b.ano !== a.ano) return b.ano - a.ano;
        return b.mes - a.mes;
    }).slice(0, 12);
    
    ordenados.forEach(({ ano, mes, totalSorteios, concursos }) => {
        const barra = '█'.repeat(Math.floor(totalSorteios / 2));
        const range = `${Math.min(...concursos)}-${Math.max(...concursos)}`;
        console.log(`${meses[mes]}/${ano} │ ${totalSorteios.toString().padStart(2)} sorteios │ Concursos ${range} ${barra}`);
    });
    
    return porMes;
}

/**
 * Analisa frequência de números por período
 */
function analisarFrequenciaPorPeriodo(concursos) {
    const periodos = {
        ultimos30: concursos.slice(-30),
        ultimos60: concursos.slice(-60),
        ultimos90: concursos.slice(-90),
        todos: concursos
    };
    
    const analises = {};
    
    Object.entries(periodos).forEach(([periodo, lista]) => {
        const frequencia = {};
        
        lista.forEach(c => {
            c.listaDezenas.forEach(num => {
                const n = parseInt(num);
                frequencia[n] = (frequencia[n] || 0) + 1;
            });
        });
        
        analises[periodo] = {
            total: lista.length,
            frequencia: Object.entries(frequencia)
                .map(([num, freq]) => ({ 
                    numero: parseInt(num), 
                    frequencia: freq,
                    percentual: ((freq / lista.length) * 100).toFixed(1)
                }))
                .sort((a, b) => b.frequencia - a.frequencia)
        };
    });
    
    console.log('\n\n🔢 TOP 10 NÚMEROS MAIS SORTEADOS');
    console.log('═'.repeat(80));
    
    ['ultimos30', 'ultimos60', 'ultimos90'].forEach(periodo => {
        const label = {
            ultimos30: 'Últimos 30 concursos',
            ultimos60: 'Últimos 60 concursos',
            ultimos90: 'Últimos 90 concursos'
        }[periodo];
        
        console.log(`\n${label}:`);
        analises[periodo].frequencia.slice(0, 10).forEach((item, idx) => {
            const barra = '█'.repeat(Math.floor(item.frequencia / 3));
            console.log(`  ${(idx + 1).toString().padStart(2)}. Nº ${item.numero.toString().padStart(2)} │ ${item.frequencia.toString().padStart(3)}x (${item.percentual}%) ${barra}`);
        });
    });
    
    return analises;
}

/**
 * Detecta padrões de repetição
 */
function detectarPadroesRepeticao(concursos) {
    console.log('\n\n🔄 PADRÕES DE REPETIÇÃO ENTRE CONCURSOS CONSECUTIVOS');
    console.log('═'.repeat(80));
    
    const repeticoes = {
        mesmosDia: 0,
        intervalo1dia: 0,
        intervalo2dias: 0,
        intervalo3dias: 0,
        intervaloMaior: 0
    };
    
    const dezenasRepetidas = [];
    
    for (let i = 1; i < concursos.length; i++) {
        const atual = concursos[i];
        const anterior = concursos[i - 1];
        
        const dataAtual = new Date(atual.dataApuracao);
        const dataAnterior = new Date(anterior.dataApuracao);
        const diffDias = Math.floor((dataAtual - dataAnterior) / (1000 * 60 * 60 * 24));
        
        if (diffDias === 0) repeticoes.mesmosDia++;
        else if (diffDias === 1) repeticoes.intervalo1dia++;
        else if (diffDias === 2) repeticoes.intervalo2dias++;
        else if (diffDias === 3) repeticoes.intervalo3dias++;
        else repeticoes.intervaloMaior++;
        
        // Contar dezenas repetidas
        const dezenasAtuais = new Set(atual.listaDezenas.map(d => parseInt(d)));
        const dezenasAnteriores = new Set(anterior.listaDezenas.map(d => parseInt(d)));
        const comuns = [...dezenasAtuais].filter(d => dezenasAnteriores.has(d));
        
        if (comuns.length > 0) {
            dezenasRepetidas.push({
                concursos: `${anterior.numero} → ${atual.numero}`,
                repetidas: comuns.length,
                numeros: comuns.sort((a, b) => a - b)
            });
        }
    }
    
    console.log('\nIntervalos entre sorteios:');
    console.log(`  Mesmo dia:    ${repeticoes.mesmosDia} vezes`);
    console.log(`  1 dia:        ${repeticoes.intervalo1dia} vezes`);
    console.log(`  2 dias:       ${repeticoes.intervalo2dias} vezes`);
    console.log(`  3 dias:       ${repeticoes.intervalo3dias} vezes`);
    console.log(`  > 3 dias:     ${repeticoes.intervaloMaior} vezes`);
    
    // Análise de repetições de dezenas
    const mediaRepetidas = dezenasRepetidas.reduce((sum, d) => sum + d.repetidas, 0) / dezenasRepetidas.length;
    const maioresRepetições = dezenasRepetidas.sort((a, b) => b.repetidas - a.repetidas).slice(0, 10);
    
    console.log(`\n\nMédia de dezenas repetidas entre concursos consecutivos: ${mediaRepetidas.toFixed(1)}`);
    console.log('\nTop 10 maiores repetições:');
    maioresRepetições.forEach((item, idx) => {
        console.log(`  ${(idx + 1).toString().padStart(2)}. Concursos ${item.concursos} │ ${item.repetidas} números repetidos: [${item.numeros.join(', ')}]`);
    });
    
    return { repeticoes, dezenasRepetidas };
}

/**
 * Analisa sequências e padrões especiais
 */
function analisarPadroesEspeciais(concursos) {
    console.log('\n\n✨ PADRÕES ESPECIAIS');
    console.log('═'.repeat(80));
    
    let comSequencia = 0;
    let parImparBalanceado = 0;
    let muitosAltos = 0;
    let muitosBaixos = 0;
    
    const exemplosSequencias = [];
    
    concursos.forEach(c => {
        const dezenas = c.listaDezenas.map(d => parseInt(d)).sort((a, b) => a - b);
        
        // Detectar sequências
        let temSequencia = false;
        for (let i = 0; i < dezenas.length - 2; i++) {
            if (dezenas[i + 1] === dezenas[i] + 1 && dezenas[i + 2] === dezenas[i] + 2) {
                temSequencia = true;
                if (exemplosSequencias.length < 5) {
                    exemplosSequencias.push({
                        concurso: c.numero,
                        data: c.dataApuracao,
                        sequencia: [dezenas[i], dezenas[i + 1], dezenas[i + 2]]
                    });
                }
                break;
            }
        }
        if (temSequencia) comSequencia++;
        
        // Analisar par/ímpar
        const pares = dezenas.filter(d => d % 2 === 0).length;
        const impares = dezenas.length - pares;
        if (Math.abs(pares - impares) <= 3) parImparBalanceado++;
        
        // Altos vs Baixos (1-12 baixos, 13-25 altos)
        const baixos = dezenas.filter(d => d <= 12).length;
        const altos = dezenas.length - baixos;
        if (altos >= 10) muitosAltos++;
        if (baixos >= 10) muitosBaixos++;
    });
    
    console.log(`\n📈 Concursos com sequências consecutivas: ${comSequencia} (${((comSequencia / concursos.length) * 100).toFixed(1)}%)`);
    console.log(`⚖️  Concursos com equilíbrio par/ímpar: ${parImparBalanceado} (${((parImparBalanceado / concursos.length) * 100).toFixed(1)}%)`);
    console.log(`🔼 Concursos com muitos números altos (≥10): ${muitosAltos} (${((muitosAltos / concursos.length) * 100).toFixed(1)}%)`);
    console.log(`🔽 Concursos com muitos números baixos (≥10): ${muitosBaixos} (${((muitosBaixos / concursos.length) * 100).toFixed(1)}%)`);
    
    console.log('\n\nExemplos de concursos com sequências:');
    exemplosSequencias.forEach(ex => {
        console.log(`  Concurso ${ex.concurso} (${ex.data}): Sequência [${ex.sequencia.join(', ')}]`);
    });
}

/**
 * Execução principal
 */
async function main() {
    console.clear();
    console.log('╔════════════════════════════════════════════════════════════════════════╗');
    console.log('║        ANÁLISE DE PADRÕES - LOTOFÁCIL                                 ║');
    console.log('╚════════════════════════════════════════════════════════════════════════╝\n');
    
    try {
        // Buscar último concurso
        console.log('🔍 Buscando último concurso disponível...');
        const ultimo = await buscarConcurso('');
        if (!ultimo) {
            console.error('❌ Não foi possível buscar o último concurso');
            return;
        }
        
        const numeroUltimo = ultimo.numero;
        console.log(`✅ Último concurso: ${numeroUltimo}\n`);
        
        // Buscar concursos
        const inicio = Math.max(1, numeroUltimo - TOTAL_CONCURSOS + 1);
        const concursos = await buscarConcursos(inicio, numeroUltimo);
        
        if (concursos.length === 0) {
            console.error('❌ Nenhum concurso foi carregado');
            return;
        }
        
        // Executar análises
        analisarDiasDaSemana(concursos);
        analisarPadroesMensais(concursos);
        analisarFrequenciaPorPeriodo(concursos);
        detectarPadroesRepeticao(concursos);
        analisarPadroesEspeciais(concursos);
        
        console.log('\n\n╔════════════════════════════════════════════════════════════════════════╗');
        console.log('║                    ANÁLISE CONCLUÍDA COM SUCESSO                       ║');
        console.log('╚════════════════════════════════════════════════════════════════════════╝\n');
        
    } catch (error) {
        console.error('❌ Erro durante análise:', error);
        process.exit(1);
    }
}

// Executar
main();
