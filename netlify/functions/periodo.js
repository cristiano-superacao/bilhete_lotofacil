/**
 * API Endpoint: /api/sorteios/periodo
 * 
 * Retorna sorteios filtrados por período
 * 
 * Parâmetros:
 * - tipo: 'dia', 'semana', 'mes', 'ano'
 * - data: data no formato YYYY-MM-DD (para dia)
 * - mes: número do mês 1-12 (para mes)
 * - ano: ano YYYY (para mes e ano)
 * - semana: número da semana ISO (para semana)
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
        const url = new URL(req.url);
        const tipo = url.searchParams.get('tipo');
        const data = url.searchParams.get('data');
        const mes = url.searchParams.get('mes');
        const ano = url.searchParams.get('ano');

        // Conectar ao banco
        const sql = neon(process.env.DATABASE_URL);

        let sorteios;

        switch (tipo) {
            case 'dia':
                if (!data) throw new Error('Parâmetro "data" obrigatório para tipo "dia"');
                sorteios = await sql`
                    SELECT * FROM sorteios
                    WHERE data_sorteio = ${data}
                    ORDER BY concurso DESC
                `;
                break;

            case 'semana':
                // Últimos 7 dias
                sorteios = await sql`
                    SELECT * FROM sorteios
                    WHERE data_sorteio >= CURRENT_DATE - INTERVAL '7 days'
                    ORDER BY concurso DESC
                `;
                break;

            case 'mes':
                if (!mes || !ano) throw new Error('Parâmetros "mes" e "ano" obrigatórios');
                sorteios = await sql`
                    SELECT * FROM sorteios
                    WHERE mes = ${parseInt(mes)} AND ano = ${parseInt(ano)}
                    ORDER BY concurso DESC
                `;
                break;

            case 'ano':
                if (!ano) throw new Error('Parâmetro "ano" obrigatório');
                sorteios = await sql`
                    SELECT * FROM sorteios
                    WHERE ano = ${parseInt(ano)}
                    ORDER BY concurso DESC
                `;
                break;

            default:
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Tipo de período inválido. Use: dia, semana, mes ou ano'
                }), {
                    status: 400,
                    headers
                });
        }

        // Formatar resposta
        const dadosFormatados = sorteios.map(s => ({
            concurso: s.concurso,
            data_sorteio: s.data_sorteio,
            data_formatada: new Date(s.data_sorteio).toLocaleDateString('pt-BR'),
            dezenas: s.dezenas,
            dia_semana: s.dia_semana,
            mes: s.mes,
            ano: s.ano
        }));

        return new Response(JSON.stringify({
            success: true,
            data: dadosFormatados,
            filtro: { tipo, data, mes, ano },
            total: dadosFormatados.length
        }), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Erro ao buscar período:', error);
        
        return new Response(JSON.stringify({
            success: false,
            error: error.message
        }), {
            status: 400,
            headers
        });
    }
};

export const config = {
    path: "/api/sorteios/periodo"
};
