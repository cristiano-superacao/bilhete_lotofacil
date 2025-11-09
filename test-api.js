// Teste rápido da API da Caixa para verificar concurso 3531
(async function testarAPI() {
    console.log('🔍 Testando API da Caixa...');
    
    try {
        // Testar API geral primeiro
        console.log('1. Testando API geral...');
        const responseGeral = await fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/');
        if (responseGeral.ok) {
            const dataGeral = await responseGeral.json();
            console.log('✅ Último concurso disponível:', dataGeral.numero);
            console.log('📅 Data do último concurso:', dataGeral.dataApuracao);
        } else {
            console.log('❌ API geral falhou:', responseGeral.status);
        }
        
        // Testar API específica para 3531
        console.log('2. Testando API específica para concurso 3531...');
        const response3531 = await fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/3531');
        if (response3531.ok) {
            const data3531 = await response3531.json();
            console.log('✅ Concurso 3531 encontrado:', data3531);
        } else {
            console.log('❌ Concurso 3531 não encontrado, status:', response3531.status);
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
})();