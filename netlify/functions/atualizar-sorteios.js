/**
 * Netlify Scheduled Function
 * 
 * Executa diariamente para buscar novos sorteios e alimentar o banco
 * 
 * Configurar em netlify.toml:
 * [[functions]]
 *   name = "atualizar-sorteios"
 *   schedule = "0 22 * * *"  # Todos os dias às 22h (horário após os sorteios)
 */

import { neon } from '@neondatabase/serverless';
import { schedule } from '@netlify/functions';

const API_BASE_URL = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil';

/**
 * Busca o último concurso da API da Caixa
 */
async function buscarUltimoConcurso() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar último concurso:', error);
        return null;
    }
}

/**
 * Salva um sorteio no banco
 */
async function salvarSorteio(sql, dados) {
    try {
        const [dia, mes, ano] = dados.dataApuracao.split('/');
        const dataFormatada = `${ano}-${mes}-${dia}`;
        
        const dezenas = [
            dados.dezenas[0], dados.dezenas[1], dados.dezenas[2], dados.dezenas[3], dados.dezenas[4],
            dados.dezenas[5], dados.dezenas[6], dados.dezenas[7], dados.dezenas[8], dados.dezenas[9],
            dados.dezenas[10], dados.dezenas[11], dados.dezenas[12], dados.dezenas[13], dados.dezenas[14]
        ].map(d => parseInt(d));
        
        const dataObj = new Date(dataFormatada);
        const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const diaSemana = diasSemana[dataObj.getDay()];
        
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
            ON CONFLICT (concurso) DO UPDATE SET
                data_sorteio = EXCLUDED.data_sorteio,
                dezenas = EXCLUDED.dezenas,
                updated_at = NOW()
            RETURNING id
        `;
        
        return result[0];
    } catch (error) {
        console.error('Erro ao salvar sorteio:', error);
        throw error;
    }
}

/**
 * Handler da função agendada
 */
const handler = async (event, context) => {
    console.log('🚀 Iniciando atualização automática de sorteios...');
    
    try {
        // Conectar ao banco
        const sql = neon(process.env.DATABASE_URL);
        
        // Buscar último concurso da API da Caixa
        const ultimoConcurso = await buscarUltimoConcurso();
        
        if (!ultimoConcurso) {
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Não foi possível buscar o último concurso' 
                })
            };
        }
        
        // Verificar se já existe no banco
        const existe = await sql`
            SELECT concurso FROM sorteios 
            WHERE concurso = ${ultimoConcurso.numero}
        `;
        
        if (existe.length > 0) {
            console.log(`ℹ️  Concurso ${ultimoConcurso.numero} já existe no banco`);
            return {
                statusCode: 200,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'Nenhum novo concurso encontrado',
                    concurso: ultimoConcurso.numero
                })
            };
        }
        
        // Salvar novo concurso
        const resultado = await salvarSorteio(sql, ultimoConcurso);
        
        console.log(`✅ Concurso ${ultimoConcurso.numero} salvo com sucesso!`);
        
        // Limpar cache de estatísticas (se implementado)
        await sql`DELETE FROM estatisticas_cache WHERE expires_at < NOW()`;
        
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Novo concurso importado com sucesso',
                concurso: ultimoConcurso.numero,
                data: ultimoConcurso.dataApuracao,
                id: resultado.id
            })
        };
        
    } catch (error) {
        console.error('❌ Erro na atualização:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                error: error.message 
            })
        };
    }
};

// Agendar para executar todos os dias às 22h (UTC-3 = 01:00 UTC)
export default schedule("0 1 * * *", handler);
