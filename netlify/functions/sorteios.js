/**
 * API Endpoint: /api/sorteios
 * 
 * Retorna sorteios da Lotofácil do banco de dados interno
 * 
 * Parâmetros:
 * - limite: número de sorteios a retornar (padrão: 50, máx: 200)
 * - offset: para paginação (padrão: 0)
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
        // Obter parâmetros da query
        const url = new URL(req.url);
        const limite = Math.min(parseInt(url.searchParams.get('limite') || '50'), 200);
        const offset = parseInt(url.searchParams.get('offset') || '0');

        // Conectar ao banco
        const sql = neon(process.env.DATABASE_URL);

        // Buscar sorteios
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
            ORDER BY concurso DESC
            LIMIT ${limite}
            OFFSET ${offset}
        `;

        // Contar total
        const [{ total }] = await sql`SELECT COUNT(*) as total FROM sorteios`;

        return new Response(JSON.stringify({
            success: true,
            data: sorteios,
            meta: {
                total: parseInt(total),
                limite,
                offset,
                proximo: offset + limite < total ? offset + limite : null
            }
        }), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Erro ao buscar sorteios:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: 'Erro ao buscar sorteios',
            message: error.message
        }), {
            status: 500,
            headers
        });
    }
};

export const config = {
    path: "/api/sorteios"
};
