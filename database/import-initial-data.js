/**
 * Script de Importação Inicial - Lotofácil
 * 
 * Busca os últimos 200 sorteios da API da Caixa e popula o banco de dados.
 * 
 * Uso: node database/import-initial-data.js
 */

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

// Configuração
const TOTAL_SORTEIOS_IMPORTAR = 200;
const API_BASE_URL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil';
const DELAY_ENTRE_REQUESTS = 500; // ms

/**
 * Busca um concurso específico da API da Caixa
 */
async function buscarConcurso(numeroConcurso) {
    try {
        const response = await fetch(`${API_BASE_URL}/${numeroConcurso}`);
        
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`HTTP ${response.status}`);
        }
        
        const dados = await response.json();
        return dados;
    } catch (error) {
        console.error(`❌ Erro ao buscar concurso ${numeroConcurso}:`, error.message);
        return null;
    }
}

/**
 * Busca o último concurso disponível
 */
async function buscarUltimoConcurso() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const dados = await response.json();
        return dados;
    } catch (error) {
        console.error('❌ Erro ao buscar último concurso:', error.message);
        return null;
    }
}

/**
 * Salva um sorteio no banco de dados
 */
async function salvarSorteio(dados) {
    try {
        // Converter data do formato dd/MM/yyyy para yyyy-MM-dd
        const [dia, mes, ano] = dados.dataApuracao.split('/');
        const dataFormatada = `${ano}-${mes}-${dia}`;
        
        // Array com as 15 dezenas
        const dezenas = [
            dados.dezenas[0], dados.dezenas[1], dados.dezenas[2], dados.dezenas[3], dados.dezenas[4],
            dados.dezenas[5], dados.dezenas[6], dados.dezenas[7], dados.dezenas[8], dados.dezenas[9],
            dados.dezenas[10], dados.dezenas[11], dados.dezenas[12], dados.dezenas[13], dados.dezenas[14]
        ].map(d => parseInt(d));
        
        // Determinar dia da semana
        const dataObj = new Date(dataFormatada);
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const diaSemana = diasSemana[dataObj.getDay()];
        
        // Inserir no banco (ON CONFLICT ignora duplicatas)
        const result = await sql`
            INSERT INTO sorteios (
                concurso, 
                data_sorteio, 
                dezenas, 
                dia_semana, 
                mes, 
                ano
            ) VALUES (
                ${dados.numero},
                ${dataFormatada},
                ${dezenas},
                ${diaSemana},
                ${parseInt(mes)},
                ${parseInt(ano)}
            )
            ON CONFLICT (concurso) DO NOTHING
            RETURNING id
        `;
        
        return result.length > 0 ? result[0].id : null;
    } catch (error) {
        console.error(`❌ Erro ao salvar concurso ${dados.numero}:`, error.message);
        throw error;
    }
}

/**
 * Aguarda um tempo (delay)
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Função principal
 */
async function main() {
    console.log('🚀 Iniciando importação dos últimos 200 sorteios...\n');
    
    // 1. Buscar o último concurso
    console.log('📡 Buscando último concurso disponível...');
    const ultimoConcurso = await buscarUltimoConcurso();
    
    if (!ultimoConcurso) {
        console.error('❌ Não foi possível buscar o último concurso. Abortando.');
        process.exit(1);
    }
    
    const numeroConcursoAtual = ultimoConcurso.numero;
    console.log(`✅ Último concurso: ${numeroConcursoAtual}\n`);
    
    // 2. Calcular range de concursos
    const concursoInicial = numeroConcursoAtual - TOTAL_SORTEIOS_IMPORTAR + 1;
    const concursoFinal = numeroConcursoAtual;
    
    console.log(`📊 Importando concursos de ${concursoInicial} a ${concursoFinal}...`);
    console.log(`⏱️  Isso pode levar alguns minutos...\n`);
    
    // 3. Importar concursos
    let importados = 0;
    let erros = 0;
    let duplicados = 0;
    
    for (let concurso = concursoInicial; concurso <= concursoFinal; concurso++) {
        process.stdout.write(`\r🔄 Processando concurso ${concurso}/${concursoFinal}...`);
        
        const dados = await buscarConcurso(concurso);
        
        if (!dados) {
            erros++;
            await sleep(DELAY_ENTRE_REQUESTS);
            continue;
        }
        
        try {
            const id = await salvarSorteio(dados);
            if (id) {
                importados++;
            } else {
                duplicados++;
            }
        } catch (error) {
            erros++;
        }
        
        await sleep(DELAY_ENTRE_REQUESTS);
    }
    
    // 4. Estatísticas finais
    console.log('\n\n' + '='.repeat(50));
    console.log('📈 RESULTADO DA IMPORTAÇÃO');
    console.log('='.repeat(50));
    console.log(`✅ Importados com sucesso: ${importados}`);
    console.log(`⚠️  Duplicados (já existiam): ${duplicados}`);
    console.log(`❌ Erros: ${erros}`);
    console.log('='.repeat(50));
    
    // 5. Verificar total no banco
    const total = await sql`SELECT COUNT(*) as total FROM sorteios`;
    console.log(`\n💾 Total de sorteios no banco: ${total[0].total}\n`);
    
    // 6. Mostrar amostra dos últimos 5
    console.log('📋 Últimos 5 sorteios salvos:');
    const ultimos = await sql`
        SELECT concurso, data_sorteio, dezenas 
        FROM sorteios 
        ORDER BY concurso DESC 
        LIMIT 5
    `;
    
    ultimos.forEach(s => {
        console.log(`   Concurso ${s.concurso} (${s.data_sorteio}): ${s.dezenas.join(', ')}`);
    });
    
    console.log('\n✅ Importação concluída!\n');
}

// Executar
main().catch(error => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
});
