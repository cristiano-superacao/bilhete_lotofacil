/**
 * API Endpoint: /api/sorteios/:concurso
 * 
 * Retorna um sorteio específico pelo número do concurso
 * 
 * Exemplo: /api/sorteios/3200
 */

import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Responder OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        return new Response('', { status: 200, headers });
    }

    try {
        // Extrair número do concurso da URL
        const numeroConcurso = parseInt(context.params.concurso);

        if (isNaN(numeroConcurso)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Número de concurso inválido'
            }), {
                status: 400,
                headers
            });
        }

        // Conectar ao banco
        const sql = neon(process.env.DATABASE_URL);

        // Buscar sorteio específico
        const sorteios = await sql`
            SELECT 
                concurso,
                data_sorteio,
                TO_CHAR(data_sorteio, 'DD/MM/YYYY') as data_formatada,
                dezenas,
                dia_semana,
                mes,
                ano
            FROM sorteios
            WHERE concurso = ${numeroConcurso}
        `;

        if (sorteios.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Concurso não encontrado'
            }), {
                status: 404,
                headers
            });
        }

        return new Response(JSON.stringify({
            success: true,
            data: sorteios[0]
        }), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Erro ao buscar concurso:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao buscar concurso',
            message: error.message
        }), {
            status: 500,
            headers
        });
    }
};

export const config = {
    path: "/api/sorteios/:concurso"
};
