import { neon } from '@neondatabase/serverless';

// Configuração do banco de dados Neon
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@host:port/database';

// Inicializar conexão com Neon
const sql = neon(DATABASE_URL);

// Exemplo de função para salvar jogos no banco
export async function salvarJogo(jogos, estrategia, usuario_id = null) {
  try {
    const resultado = await sql`
      INSERT INTO jogos_gerados (
        jogos, 
        estrategia, 
        usuario_id, 
        data_geracao
      ) VALUES (
        ${JSON.stringify(jogos)}, 
        ${estrategia}, 
        ${usuario_id}, 
        NOW()
      ) RETURNING id
    `;
    
    console.log('Jogo salvo com ID:', resultado[0].id);
    return resultado[0].id;
  } catch (error) {
    console.error('Erro ao salvar jogo:', error);
    throw error;
  }
}

// Exemplo de função para buscar histórico
export async function buscarHistorico(usuario_id = null, limite = 50) {
  try {
    const historico = await sql`
      SELECT 
        id,
        jogos,
        estrategia,
        data_geracao,
        resultado_conferencia
      FROM jogos_gerados 
      WHERE usuario_id = ${usuario_id} OR ${usuario_id} IS NULL
      ORDER BY data_geracao DESC 
      LIMIT ${limite}
    `;
    
    return historico;
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
}

// Exemplo de função para criar tabelas
export async function criarTabelas() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS jogos_gerados (
        id SERIAL PRIMARY KEY,
        jogos JSONB NOT NULL,
        estrategia VARCHAR(100) NOT NULL,
        usuario_id VARCHAR(100),
        data_geracao TIMESTAMP DEFAULT NOW(),
        resultado_conferencia JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS resultados_oficiais (
        id SERIAL PRIMARY KEY,
        concurso INTEGER UNIQUE NOT NULL,
        data_sorteio DATE NOT NULL,
        dezenas INTEGER[] NOT NULL,
        premiacoes JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
    throw error;
  }
}

// Exportar instância do SQL para uso direto
export { sql };