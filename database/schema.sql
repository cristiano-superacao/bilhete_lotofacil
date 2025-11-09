-- =============================================
-- SCHEMA: LotoFácil Estratégica Database
-- Versão: 1.0.0
-- Data: 09/11/2025
-- =============================================

-- Tabela de sorteios da Lotofácil
CREATE TABLE IF NOT EXISTS sorteios (
    id SERIAL PRIMARY KEY,
    concurso INTEGER NOT NULL UNIQUE,
    data_sorteio DATE NOT NULL,
    dezenas INTEGER[] NOT NULL,
    dia_semana VARCHAR(20),
    mes INTEGER,
    ano INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para otimizar consultas
CREATE INDEX IF NOT EXISTS idx_sorteios_concurso ON sorteios(concurso);
CREATE INDEX IF NOT EXISTS idx_sorteios_data ON sorteios(data_sorteio DESC);
CREATE INDEX IF NOT EXISTS idx_sorteios_mes_ano ON sorteios(mes, ano);
CREATE INDEX IF NOT EXISTS idx_sorteios_ano ON sorteios(ano DESC);

-- Tabela para estatísticas pré-calculadas (cache)
CREATE TABLE IF NOT EXISTS estatisticas_cache (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- 'frequencia', 'atrasados', 'mensal', etc
    periodo VARCHAR(50), -- 'ultimos_200', '2025', 'novembro_2025', etc
    dados JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_stats_tipo_periodo ON estatisticas_cache(tipo, periodo);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sorteios_updated_at BEFORE UPDATE
    ON sorteios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View para consultas rápidas de estatísticas
CREATE OR REPLACE VIEW ultimos_sorteios AS
SELECT 
    concurso,
    data_sorteio,
    dezenas,
    dia_semana,
    EXTRACT(MONTH FROM data_sorteio) as mes,
    EXTRACT(YEAR FROM data_sorteio) as ano
FROM sorteios
ORDER BY concurso DESC
LIMIT 200;

-- Comentários para documentação
COMMENT ON TABLE sorteios IS 'Armazena todos os sorteios da Lotofácil';
COMMENT ON COLUMN sorteios.concurso IS 'Número único do concurso';
COMMENT ON COLUMN sorteios.dezenas IS 'Array com as 15 dezenas sorteadas';
COMMENT ON COLUMN sorteios.dia_semana IS 'Segunda, Terça, Quarta, etc';
COMMENT ON TABLE estatisticas_cache IS 'Cache de estatísticas pré-calculadas para performance';
