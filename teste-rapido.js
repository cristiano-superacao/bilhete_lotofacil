// TESTE RÁPIDO - Cole no Console do Navegador (F12)
// Após abrir http://localhost:8080

console.log('🧪 INICIANDO TESTE RÁPIDO DAS ESTRATÉGIAS\n');

// 1. Verificar se a instância está disponível
console.log('1. Verificando instância global...');
if (window.lotofacil) {
    console.log('✅ window.lotofacil está disponível');
} else {
    console.log('❌ window.lotofacil NÃO está disponível');
}

if (window.app) {
    console.log('✅ window.app está disponível');
} else {
    console.log('❌ window.app NÃO está disponível');
}

// 2. Verificar estratégias carregadas
console.log('\n2. Verificando estratégias...');
if (window.lotofacil && window.lotofacil.analises) {
    console.log(`✅ ${window.lotofacil.analises.length} estratégias carregadas`);
    window.lotofacil.analises.forEach(a => {
        console.log(`   #${a.id}: ${a.titulo}`);
    });
} else {
    console.log('❌ Estratégias não carregadas');
}

// 3. Testar uma estratégia (Distribuição Garantida - ID 3)
console.log('\n3. Testando Estratégia #3 (Distribuição Garantida)...');

// Simular clique no botão
setTimeout(() => {
    try {
        window.lotofacil.gerarJogos(3);
        
        // Aguardar 1 segundo e verificar resultado
        setTimeout(() => {
            if (window.lotofacil.jogosGerados && window.lotofacil.jogosGerados.length > 0) {
                console.log(`✅ Gerados: ${window.lotofacil.jogosGerados.length} jogos`);
                console.log('   Jogo 1:', window.lotofacil.jogosGerados[0].join(', '));
                
                // Validar primeiro jogo
                const jogo = window.lotofacil.jogosGerados[0];
                const pares = jogo.filter(n => n % 2 === 0).length;
                const soma = jogo.reduce((a,b) => a+b, 0);
                
                console.log('   Estatísticas:');
                console.log(`   - Par/Ímpar: ${pares}/${15-pares}`);
                console.log(`   - Soma: ${soma}`);
                console.log(`   - Range: ${Math.min(...jogo)} - ${Math.max(...jogo)}`);
                
                if (jogo.length === 15 && (pares === 7 || pares === 8) && soma >= 185 && soma <= 205) {
                    console.log('   ✅ JOGO VÁLIDO!');
                } else {
                    console.log('   ⚠️ Jogo precisa de ajustes');
                }
            } else {
                console.log('❌ Nenhum jogo gerado');
            }
        }, 1500);
        
    } catch (erro) {
        console.error('❌ Erro ao gerar jogos:', erro);
    }
}, 1000);

// 4. Testar todas as 5 novas estratégias
console.log('\n4. Aguardando para testar todas as 5 novas estratégias...');

const estrategiasNovas = [
    { id: 3, nome: 'Distribuição Garantida' },
    { id: 9, nome: 'Zona Quente' },
    { id: 10, nome: 'Híbrida Otimizada' },
    { id: 11, nome: 'Fechamento Matemático' },
    { id: 12, nome: 'Repetição Inteligente' }
];

setTimeout(() => {
    console.log('\n🎯 TESTANDO TODAS AS 5 NOVAS ESTRATÉGIAS...\n');
    
    let testeAtual = 0;
    const intervalo = setInterval(() => {
        if (testeAtual >= estrategiasNovas.length) {
            clearInterval(intervalo);
            console.log('\n✅ TODOS OS TESTES CONCLUÍDOS!');
            return;
        }
        
        const estrategia = estrategiasNovas[testeAtual];
        console.log(`\n🔍 Testando #${estrategia.id}: ${estrategia.nome}...`);
        
        try {
            window.lotofacil.gerarJogos(estrategia.id);
            
            setTimeout(() => {
                if (window.lotofacil.jogosGerados && window.lotofacil.jogosGerados.length > 0) {
                    const jogo = window.lotofacil.jogosGerados[0];
                    const pares = jogo.filter(n => n % 2 === 0).length;
                    const soma = jogo.reduce((a,b) => a+b, 0);
                    
                    console.log(`   ✅ ${window.lotofacil.jogosGerados.length} jogos | Par/Ímpar: ${pares}/${15-pares} | Soma: ${soma}`);
                } else {
                    console.log('   ❌ Falhou ao gerar');
                }
            }, 500);
            
        } catch (erro) {
            console.error(`   ❌ Erro: ${erro.message}`);
        }
        
        testeAtual++;
    }, 2000); // 2 segundos entre cada teste
    
}, 4000); // Aguarda 4 segundos antes de iniciar os testes

console.log('\n⏳ Testes iniciados... Aguarde os resultados...');
