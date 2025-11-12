// Script de Teste para Validar as Novas Estratégias
// Executa no console do navegador

console.log('🧪 INICIANDO TESTES DAS ESTRATÉGIAS OTIMIZADAS\n');

// Função para validar critérios estatísticos
function validarJogo(jogo, nomeEstrategia) {
    const erros = [];
    
    // 1. Validar quantidade de números
    if (jogo.length !== 15) {
        erros.push(`❌ Quantidade incorreta: ${jogo.length} (esperado: 15)`);
    }
    
    // 2. Validar range (1-25)
    const foraRange = jogo.filter(n => n < 1 || n > 25);
    if (foraRange.length > 0) {
        erros.push(`❌ Números fora do range: ${foraRange.join(', ')}`);
    }
    
    // 3. Validar duplicatas
    const duplicatas = jogo.filter((n, i) => jogo.indexOf(n) !== i);
    if (duplicatas.length > 0) {
        erros.push(`❌ Números duplicados: ${duplicatas.join(', ')}`);
    }
    
    // 4. Validar par/ímpar (deve ser 7-8 ou 8-7)
    const pares = jogo.filter(n => n % 2 === 0).length;
    const impares = jogo.length - pares;
    if (!((pares === 7 && impares === 8) || (pares === 8 && impares === 7))) {
        erros.push(`⚠️ Par/Ímpar: ${pares}/${impares} (ideal: 7-8 ou 8-7)`);
    }
    
    // 5. Validar cobertura de colunas
    const colunas = [
        jogo.some(n => n >= 1 && n <= 5),
        jogo.some(n => n >= 6 && n <= 10),
        jogo.some(n => n >= 11 && n <= 15),
        jogo.some(n => n >= 16 && n <= 20),
        jogo.some(n => n >= 21 && n <= 25)
    ];
    const colunasCobertas = colunas.filter(Boolean).length;
    if (colunasCobertas < 5) {
        erros.push(`⚠️ Colunas cobertas: ${colunasCobertas}/5`);
    }
    
    // 6. Validar soma (ideal: 185-205)
    const soma = jogo.reduce((acc, n) => acc + n, 0);
    if (soma < 185 || soma > 205) {
        erros.push(`⚠️ Soma: ${soma} (ideal: 185-205)`);
    }
    
    // 7. Validar sequências (máximo 3 consecutivos)
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
    if (maxSequencia > 3) {
        erros.push(`⚠️ Sequência longa: ${maxSequencia} consecutivos (ideal: ≤3)`);
    }
    
    return {
        valido: erros.length === 0,
        erros: erros,
        stats: {
            pares: pares,
            impares: impares,
            soma: soma,
            colunas: colunasCobertas,
            maxSequencia: maxSequencia
        }
    };
}

// Teste das estratégias
async function testarEstrategias() {
    const estrategiasParaTestar = [
        { id: 3, nome: 'Distribuição Garantida' },
        { id: 9, nome: 'Zona Quente' },
        { id: 10, nome: 'Híbrida Otimizada' },
        { id: 11, nome: 'Fechamento Matemático' },
        { id: 12, nome: 'Repetição Inteligente' }
    ];
    
    console.log('📋 Testando 5 novas estratégias otimizadas...\n');
    
    for (const estrategia of estrategiasParaTestar) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`🎯 ESTRATÉGIA #${estrategia.id}: ${estrategia.nome}`);
        console.log('='.repeat(60));
        
        try {
            // Simular clique no botão da estratégia
            const botao = document.querySelector(`[onclick*="gerarJogos(${estrategia.id})"]`);
            if (!botao) {
                console.log(`❌ Botão não encontrado para estratégia #${estrategia.id}`);
                continue;
            }
            
            // Clicar e aguardar
            botao.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Verificar jogos gerados
            const app = window.app;
            if (!app || !app.jogosGerados || app.jogosGerados.length === 0) {
                console.log('❌ Nenhum jogo gerado');
                continue;
            }
            
            console.log(`✅ Gerados: ${app.jogosGerados.length} jogos`);
            
            // Validar cada jogo
            let jogosValidos = 0;
            app.jogosGerados.forEach((jogo, index) => {
                const resultado = validarJogo(jogo, estrategia.nome);
                
                if (resultado.valido) {
                    jogosValidos++;
                } else {
                    console.log(`\n   Jogo ${index + 1}: ${jogo.join(', ')}`);
                    resultado.erros.forEach(erro => console.log(`   ${erro}`));
                }
                
                // Mostrar estatísticas do primeiro jogo
                if (index === 0) {
                    console.log(`\n   📊 Estatísticas (Jogo 1):`);
                    console.log(`   Par/Ímpar: ${resultado.stats.pares}/${resultado.stats.impares}`);
                    console.log(`   Soma: ${resultado.stats.soma}`);
                    console.log(`   Colunas: ${resultado.stats.colunas}/5`);
                    console.log(`   Seq. Máxima: ${resultado.stats.maxSequencia}`);
                }
            });
            
            const taxa = (jogosValidos / app.jogosGerados.length * 100).toFixed(1);
            console.log(`\n   ✅ Taxa de validação: ${jogosValidos}/${app.jogosGerados.length} (${taxa}%)`);
            
            if (taxa >= 80) {
                console.log(`   🎉 ESTRATÉGIA APROVADA!`);
            } else {
                console.log(`   ⚠️ Estratégia precisa de ajustes`);
            }
            
        } catch (erro) {
            console.error(`❌ Erro ao testar: ${erro.message}`);
        }
    }
    
    console.log(`\n${'='.repeat(60)}`);
    console.log('✅ TESTES CONCLUÍDOS');
    console.log('='.repeat(60));
}

// Executar testes
console.log('⏳ Aguardando 2 segundos para garantir que a página carregou...\n');
setTimeout(testarEstrategias, 2000);
