// ================================================================
// TESTE COMPLETO DO SISTEMA LOTOFÁCIL - APÓS LIMPEZA
// Cole este código no Console do Navegador (F12)
// ================================================================

console.clear();
console.log('🧪 INICIANDO TESTE COMPLETO DO SISTEMA LOTOFÁCIL\n');
console.log('=' .repeat(70));

// ================================================================
// FASE 1: VERIFICAÇÃO DA INFRAESTRUTURA
// ================================================================

console.log('\n📋 FASE 1: VERIFICAÇÃO DA INFRAESTRUTURA\n');

const resultados = {
    infraestrutura: {},
    estrategias: {},
    validacoes: {},
    erros: []
};

// 1.1 Verificar instância global
if (window.lotofacil) {
    console.log('✅ window.lotofacil está disponível');
    resultados.infraestrutura.lotofacil = true;
} else {
    console.log('❌ window.lotofacil NÃO está disponível');
    resultados.infraestrutura.lotofacil = false;
    resultados.erros.push('Instância lotofacil não encontrada');
}

// 1.2 Verificar estratégias carregadas
if (window.lotofacil && window.lotofacil.analises) {
    const total = window.lotofacil.analises.length;
    console.log(`✅ ${total} estratégias carregadas`);
    resultados.infraestrutura.estrategias = total;
    
    if (total === 12) {
        console.log('✅ Quantidade correta (12 estratégias)');
    } else {
        console.log(`⚠️ Esperado: 12, Encontrado: ${total}`);
        resultados.erros.push(`Quantidade incorreta de estratégias: ${total}`);
    }
} else {
    console.log('❌ Estratégias não carregadas');
    resultados.infraestrutura.estrategias = 0;
    resultados.erros.push('Estratégias não carregadas');
}

// 1.3 Listar estratégias
console.log('\n📊 ESTRATÉGIAS DISPONÍVEIS:\n');
if (window.lotofacil && window.lotofacil.analises) {
    window.lotofacil.analises.forEach((a, idx) => {
        console.log(`   ${idx + 1}. [ID ${a.id}] ${a.titulo}`);
    });
}

// ================================================================
// FASE 2: TESTE DAS 12 ESTRATÉGIAS
// ================================================================

console.log('\n' + '='.repeat(70));
console.log('\n🎯 FASE 2: TESTE DAS 12 ESTRATÉGIAS\n');

const estrategiasParaTestar = [
    { id: 1, nome: 'Poder das Repetidas' },
    { id: 2, nome: 'Par e Ímpar Equilibrado' },
    { id: 3, nome: 'Distribuição Garantida' },
    { id: 4, nome: 'Sequências Inteligentes' },
    { id: 5, nome: 'Divisão em Colunas' },
    { id: 6, nome: 'Frequência Histórica' },
    { id: 7, nome: 'Matemática dos Finais' },
    { id: 8, nome: 'Frequência Mensal' },
    { id: 9, nome: 'Zona Quente' },
    { id: 10, nome: 'Híbrida Otimizada' },
    { id: 11, nome: 'Fechamento Matemático' },
    { id: 12, nome: 'Repetição Inteligente' }
];

// Função de validação de jogo
function validarJogo(jogo, idEstrategia) {
    const validacao = {
        valido: true,
        erros: [],
        avisos: [],
        stats: {}
    };
    
    // 1. Quantidade
    if (jogo.length !== 15) {
        validacao.valido = false;
        validacao.erros.push(`Quantidade: ${jogo.length} (esperado: 15)`);
    }
    validacao.stats.quantidade = jogo.length;
    
    // 2. Range
    const foraRange = jogo.filter(n => n < 1 || n > 25);
    if (foraRange.length > 0) {
        validacao.valido = false;
        validacao.erros.push(`Números fora do range: ${foraRange.join(', ')}`);
    }
    
    // 3. Duplicatas
    const duplicatas = jogo.filter((n, i) => jogo.indexOf(n) !== i);
    if (duplicatas.length > 0) {
        validacao.valido = false;
        validacao.erros.push(`Duplicatas: ${duplicatas.join(', ')}`);
    }
    
    // 4. Par/Ímpar
    const pares = jogo.filter(n => n % 2 === 0).length;
    const impares = jogo.length - pares;
    validacao.stats.pares = pares;
    validacao.stats.impares = impares;
    
    if (!((pares === 7 && impares === 8) || (pares === 8 && impares === 7))) {
        validacao.avisos.push(`Par/Ímpar: ${pares}/${impares} (ideal: 7-8 ou 8-7)`);
    }
    
    // 5. Soma
    const soma = jogo.reduce((acc, n) => acc + n, 0);
    validacao.stats.soma = soma;
    
    if (soma < 185 || soma > 205) {
        validacao.avisos.push(`Soma: ${soma} (ideal: 185-205)`);
    }
    
    // 6. Colunas
    const colunas = [
        jogo.some(n => n >= 1 && n <= 5),
        jogo.some(n => n >= 6 && n <= 10),
        jogo.some(n => n >= 11 && n <= 15),
        jogo.some(n => n >= 16 && n <= 20),
        jogo.some(n => n >= 21 && n <= 25)
    ];
    const colunasCobertas = colunas.filter(Boolean).length;
    validacao.stats.colunas = colunasCobertas;
    
    if (colunasCobertas < 5) {
        validacao.avisos.push(`Colunas: ${colunasCobertas}/5`);
    }
    
    // 7. Sequências
    const jogoOrdenado = [...jogo].sort((a, b) => a - b);
    let maxSequencia = 1;
    let sequenciaAtual = 1;
    
    for (let i = 1; i < jogoOrdenado.length; i++) {
        if (jogoOrdenado[i] === jogoOrdenado[i-1] + 1) {
            sequenciaAtual++;
            maxSequencia = Math.max(maxSequencia, sequenciaAtual);
        } else {
            sequenciaAtual = 1;
        }
    }
    validacao.stats.maxSequencia = maxSequencia;
    
    if (maxSequencia > 4) {
        validacao.avisos.push(`Sequência longa: ${maxSequencia} consecutivos`);
    }
    
    return validacao;
}

// Teste assíncrono de cada estratégia
async function testarEstrategia(estrategia, index) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`\n${'─'.repeat(70)}`);
            console.log(`🔍 [${index + 1}/12] Testando: ${estrategia.nome} (ID ${estrategia.id})`);
            console.log('─'.repeat(70));
            
            try {
                // Gerar jogos
                window.lotofacil.gerarJogos(estrategia.id);
                
                setTimeout(() => {
                    const jogos = window.lotofacil.jogosGerados;
                    
                    if (!jogos || jogos.length === 0) {
                        console.log('❌ FALHA: Nenhum jogo gerado');
                        resultados.estrategias[estrategia.id] = {
                            nome: estrategia.nome,
                            sucesso: false,
                            erro: 'Nenhum jogo gerado'
                        };
                        resultados.erros.push(`Estratégia ${estrategia.id}: Não gerou jogos`);
                        resolve();
                        return;
                    }
                    
                    console.log(`✅ Gerados: ${jogos.length} jogos`);
                    
                    // Validar todos os jogos
                    let jogosValidos = 0;
                    let jogosComAvisos = 0;
                    
                    jogos.forEach((jogo, idx) => {
                        const validacao = validarJogo(jogo, estrategia.id);
                        
                        if (validacao.valido && validacao.avisos.length === 0) {
                            jogosValidos++;
                        } else if (validacao.valido) {
                            jogosValidos++;
                            jogosComAvisos++;
                        }
                        
                        // Mostrar apenas jogo 1 com detalhes
                        if (idx === 0) {
                            console.log(`\n   📊 Jogo 1: ${jogo.join(', ')}`);
                            console.log(`   Stats: Par/Ímpar ${validacao.stats.pares}/${validacao.stats.impares} | Soma ${validacao.stats.soma} | Colunas ${validacao.stats.colunas}/5 | Seq.Max ${validacao.stats.maxSequencia}`);
                            
                            if (validacao.erros.length > 0) {
                                validacao.erros.forEach(e => console.log(`   ❌ ${e}`));
                            }
                            if (validacao.avisos.length > 0) {
                                validacao.avisos.forEach(a => console.log(`   ⚠️ ${a}`));
                            }
                        }
                    });
                    
                    const taxa = (jogosValidos / jogos.length * 100).toFixed(1);
                    console.log(`\n   ✅ Jogos válidos: ${jogosValidos}/${jogos.length} (${taxa}%)`);
                    
                    if (jogosComAvisos > 0) {
                        console.log(`   ⚠️ Jogos com avisos: ${jogosComAvisos}`);
                    }
                    
                    // Classificação
                    let classificacao;
                    if (taxa >= 90 && jogosComAvisos === 0) {
                        classificacao = '🏆 EXCELENTE';
                        console.log(`\n   ${classificacao}`);
                    } else if (taxa >= 80) {
                        classificacao = '✅ BOM';
                        console.log(`\n   ${classificacao}`);
                    } else if (taxa >= 70) {
                        classificacao = '⚠️ ACEITÁVEL';
                        console.log(`\n   ${classificacao}`);
                    } else {
                        classificacao = '❌ PRECISA AJUSTES';
                        console.log(`\n   ${classificacao}`);
                    }
                    
                    resultados.estrategias[estrategia.id] = {
                        nome: estrategia.nome,
                        sucesso: true,
                        jogosGerados: jogos.length,
                        jogosValidos: jogosValidos,
                        taxa: parseFloat(taxa),
                        classificacao: classificacao
                    };
                    
                    resolve();
                }, 800);
                
            } catch (erro) {
                console.log(`❌ ERRO: ${erro.message}`);
                resultados.estrategias[estrategia.id] = {
                    nome: estrategia.nome,
                    sucesso: false,
                    erro: erro.message
                };
                resultados.erros.push(`Estratégia ${estrategia.id}: ${erro.message}`);
                resolve();
            }
        }, index * 2000); // 2 segundos entre cada teste
    });
}

// Executar todos os testes
async function executarTodosTestes() {
    for (let i = 0; i < estrategiasParaTestar.length; i++) {
        await testarEstrategia(estrategiasParaTestar[i], i);
    }
    
    // ================================================================
    // FASE 3: RELATÓRIO FINAL
    // ================================================================
    
    console.log('\n' + '='.repeat(70));
    console.log('\n📊 FASE 3: RELATÓRIO FINAL\n');
    console.log('='.repeat(70));
    
    const totalEstrategias = Object.keys(resultados.estrategias).length;
    const estrategiasSucesso = Object.values(resultados.estrategias).filter(e => e.sucesso).length;
    const estrategiasFalha = totalEstrategias - estrategiasSucesso;
    
    console.log(`\n✅ Estratégias testadas: ${totalEstrategias}/12`);
    console.log(`✅ Sucessos: ${estrategiasSucesso}`);
    if (estrategiasFalha > 0) {
        console.log(`❌ Falhas: ${estrategiasFalha}`);
    }
    
    // Estatísticas gerais
    const taxas = Object.values(resultados.estrategias)
        .filter(e => e.sucesso && e.taxa)
        .map(e => e.taxa);
    
    if (taxas.length > 0) {
        const taxaMedia = (taxas.reduce((a, b) => a + b, 0) / taxas.length).toFixed(1);
        const taxaMinima = Math.min(...taxas).toFixed(1);
        const taxaMaxima = Math.max(...taxas).toFixed(1);
        
        console.log(`\n📈 ESTATÍSTICAS DE VALIDAÇÃO:`);
        console.log(`   Média: ${taxaMedia}%`);
        console.log(`   Mínima: ${taxaMinima}%`);
        console.log(`   Máxima: ${taxaMaxima}%`);
    }
    
    // Classificação por desempenho
    console.log(`\n🏆 CLASSIFICAÇÃO POR DESEMPENHO:\n`);
    const estrategiasOrdenadas = Object.values(resultados.estrategias)
        .filter(e => e.sucesso && e.taxa)
        .sort((a, b) => b.taxa - a.taxa);
    
    estrategiasOrdenadas.forEach((e, idx) => {
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  ';
        console.log(`   ${medal} ${e.nome.padEnd(35)} ${e.taxa.toFixed(1)}% ${e.classificacao}`);
    });
    
    // Erros encontrados
    if (resultados.erros.length > 0) {
        console.log(`\n❌ ERROS ENCONTRADOS (${resultados.erros.length}):\n`);
        resultados.erros.forEach((erro, idx) => {
            console.log(`   ${idx + 1}. ${erro}`);
        });
    } else {
        console.log(`\n✅ NENHUM ERRO ENCONTRADO!`);
    }
    
    // Resumo final
    console.log('\n' + '='.repeat(70));
    
    const taxaGeral = estrategiasSucesso / totalEstrategias * 100;
    
    if (taxaGeral === 100 && resultados.erros.length === 0) {
        console.log('\n🎉 SISTEMA 100% FUNCIONAL! TODOS OS TESTES PASSARAM!');
    } else if (taxaGeral >= 90) {
        console.log('\n✅ SISTEMA OPERACIONAL! Alguns ajustes recomendados.');
    } else if (taxaGeral >= 75) {
        console.log('\n⚠️ SISTEMA FUNCIONAL COM RESSALVAS! Ajustes necessários.');
    } else {
        console.log('\n❌ SISTEMA PRECISA DE CORREÇÕES URGENTES!');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('\n✅ TESTE COMPLETO FINALIZADO!\n');
    
    return resultados;
}

// Iniciar testes após 2 segundos
console.log('\n⏳ Aguardando 2 segundos para iniciar os testes...\n');
setTimeout(() => {
    executarTodosTestes().then(resultados => {
        console.log('\n💾 Resultados salvos em: window.resultadosTeste');
        window.resultadosTeste = resultados;
    });
}, 2000);
