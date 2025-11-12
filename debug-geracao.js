// TESTE DE DEPURAÇÃO - Cole no Console do Navegador
console.clear();
console.log('🔍 DEPURAÇÃO: Por que não gera jogos?\n');

// 1. Verificar instância
console.log('1️⃣ Verificando instância...');
console.log('window.lotofacil:', window.lotofacil ? '✅ OK' : '❌ NÃO EXISTE');

if (!window.lotofacil) {
    console.log('❌ ERRO CRÍTICO: Instância não encontrada!');
    console.log('Solução: Recarregue a página (Ctrl+Shift+R)');
} else {
    // 2. Verificar estratégias
    console.log('\n2️⃣ Verificando estratégias...');
    console.log('Total estratégias:', window.lotofacil.analises?.length || 0);
    
    // 3. Verificar dados necessários
    console.log('\n3️⃣ Verificando dados necessários...');
    console.log('ultimoResultado:', window.lotofacil.ultimoResultado || '❌ NULL');
    console.log('ultimos150Resultados:', window.lotofacil.ultimos150Resultados?.length || 0);
    
    // 4. Testar geração manualmente (Estratégia 2 - mais simples)
    console.log('\n4️⃣ Testando Estratégia #2 (Par e Ímpar)...');
    console.log('Esta estratégia não precisa de dados externos.\n');
    
    try {
        // Chamar diretamente
        window.lotofacil.gerarJogos(2);
        
        // Aguardar 1 segundo
        setTimeout(() => {
            console.log('\n📊 RESULTADO:');
            console.log('Jogos gerados:', window.lotofacil.jogosGerados?.length || 0);
            
            if (window.lotofacil.jogosGerados && window.lotofacil.jogosGerados.length > 0) {
                console.log('✅ SUCESSO! Estratégia funcionou!');
                console.log('Jogo 1:', window.lotofacil.jogosGerados[0]);
                console.log('\n💡 O problema pode ser com os dados de outras estratégias.');
                console.log('Vou verificar cada estratégia individualmente...\n');
                
                // Testar cada estratégia
                testarTodasEstrategias();
            } else {
                console.log('❌ FALHA! Nenhum jogo foi gerado.');
                console.log('\n🔍 Investigando o problema...\n');
                
                // Verificar se o método existe
                console.log('Método gerarJogos existe?', typeof window.lotofacil.gerarJogos);
                console.log('Método exibirJogosGerados existe?', typeof window.lotofacil.exibirJogosGerados);
                
                // Verificar element
                const resultadosElement = document.getElementById('resultados');
                console.log('Elemento #resultados existe?', resultadosElement ? '✅ SIM' : '❌ NÃO');
                
                const jogosContainer = document.getElementById('jogosGerados');
                console.log('Elemento #jogosGerados existe?', jogosContainer ? '✅ SIM' : '❌ NÃO');
            }
        }, 1500);
        
    } catch (erro) {
        console.error('❌ ERRO AO GERAR:', erro);
        console.log('\n📋 Detalhes do erro:');
        console.log('Mensagem:', erro.message);
        console.log('Stack:', erro.stack);
    }
}

// Função para testar todas as estratégias
function testarTodasEstrategias() {
    const estrategias = [
        { id: 1, nome: 'Poder das Repetidas', precisaUltimoResultado: true },
        { id: 2, nome: 'Par e Ímpar' },
        { id: 3, nome: 'Distribuição Garantida' },
        { id: 4, nome: 'Sequências Inteligentes' },
        { id: 5, nome: 'Divisão em Colunas' },
        { id: 6, nome: 'Frequência Histórica' },
        { id: 7, nome: 'Matemática dos Finais' },
        { id: 8, nome: 'Frequência Mensal' },
        { id: 9, nome: 'Zona Quente' },
        { id: 10, nome: 'Híbrida Otimizada', precisaUltimoResultado: true },
        { id: 11, nome: 'Fechamento Matemático' },
        { id: 12, nome: 'Repetição Inteligente', precisaUltimoResultado: true }
    ];
    
    console.log('🔄 Testando todas as 12 estratégias...\n');
    
    let index = 0;
    const intervalo = setInterval(() => {
        if (index >= estrategias.length) {
            clearInterval(intervalo);
            console.log('\n✅ Teste completo finalizado!');
            return;
        }
        
        const est = estrategias[index];
        
        // Pular estratégias que precisam de último resultado se não tiver
        if (est.precisaUltimoResultado && !window.lotofacil.ultimoResultado) {
            console.log(`⏭️ #${est.id} ${est.nome} - PULADO (precisa último resultado)`);
            index++;
            return;
        }
        
        console.log(`\n🧪 Testando #${est.id}: ${est.nome}...`);
        
        try {
            window.lotofacil.gerarJogos(est.id);
            
            setTimeout(() => {
                const qtd = window.lotofacil.jogosGerados?.length || 0;
                if (qtd > 0) {
                    console.log(`   ✅ ${qtd} jogos gerados`);
                } else {
                    console.log(`   ❌ FALHOU - 0 jogos`);
                }
            }, 300);
            
        } catch (erro) {
            console.log(`   ❌ ERRO: ${erro.message}`);
        }
        
        index++;
    }, 2000);
}

console.log('\n⏳ Aguarde...\n');
