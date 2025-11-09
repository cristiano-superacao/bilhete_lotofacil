# 🗄️ Banco de Dados - LotoFácil Estratégica

## Visão Geral

Sistema de banco de dados PostgreSQL (Neon) para armazenar histórico completo de sorteios da Lotofácil com atualização automática diária.

## 📊 Estrutura

### Tabela: `sorteios`
```sql
- id (SERIAL PRIMARY KEY)
- concurso (INTEGER UNIQUE) - Número do concurso
- data_sorteio (DATE) - Data do sorteio
- dezenas (INTEGER[]) - Array com as 15 dezenas sorteadas
- dia_semana (VARCHAR) - Dia da semana do sorteio
- mes (INTEGER) - Mês do sorteio
- ano (INTEGER) - Ano do sorteio
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabela: `estatisticas_cache`
Cache de estatísticas pré-calculadas para otimizar performance.

## 🚀 Setup Inicial

### 1. Criar Conta no Neon
1. Acesse: https://neon.tech
2. Crie uma conta gratuita
3. Crie um novo projeto: "lotofacil-estrategica"
4. Copie a Connection String

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:
```bash
DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/lotofacil?sslmode=require
```

### 3. Executar Schema SQL

Opção A - Via Console Neon:
1. Acesse o Neon Console
2. Vá em "SQL Editor"
3. Cole todo o conteúdo de `database/schema.sql`
4. Execute

Opção B - Via CLI:
```bash
psql $DATABASE_URL < database/schema.sql
```

### 4. Importar Dados Iniciais

```bash
npm install
npm run db:import
```

Isso irá:
- Buscar os últimos 200 sorteios da API da Caixa
- Salvar no banco de dados
- Mostrar estatísticas da importação

**Tempo estimado**: 2-3 minutos

## 🔄 Atualização Automática

### Netlify Scheduled Function

A função `netlify/functions/atualizar-sorteios.js` executa automaticamente:
- **Frequência**: Diariamente às 22h (horário de Brasília)
- **Ação**: Busca novos sorteios e alimenta o banco
- **Logs**: Disponíveis no Netlify Dashboard

### Configuração no Netlify

1. Deploy o site no Netlify
2. Configure a variável de ambiente `DATABASE_URL` no dashboard
3. A função agendada será ativada automaticamente

## 📡 Endpoints da API

Todos os endpoints são serverless (Netlify Functions):

### 1. Listar Sorteios
```
GET /api/sorteios?limite=50&offset=0
```

### 2. Sorteio Específico
```
GET /api/sorteios/:concurso
Exemplo: /api/sorteios/3200
```

### 3. Filtrar por Período
```
GET /api/sorteios/periodo?tipo=mes&mes=11&ano=2025
GET /api/sorteios/periodo?tipo=semana
GET /api/sorteios/periodo?tipo=ano&ano=2025
```

## 🔧 Scripts Disponíveis

```bash
# Importar dados iniciais (últimos 200 sorteios)
npm run db:import

# Ver instruções do schema
npm run db:schema

# Testar localmente com Netlify Dev
npm run dev
```

## 📈 Monitoramento

### Verificar Total de Sorteios
```sql
SELECT COUNT(*) FROM sorteios;
```

### Ver Últimos 10 Sorteios
```sql
SELECT concurso, data_sorteio, dezenas 
FROM sorteios 
ORDER BY concurso DESC 
LIMIT 10;
```

### Estatísticas por Ano
```sql
SELECT ano, COUNT(*) as total
FROM sorteios
GROUP BY ano
ORDER BY ano DESC;
```

## 🛡️ Segurança

- ✅ Database URL em variável de ambiente
- ✅ Conexão SSL obrigatória
- ✅ Functions com CORS configurado
- ✅ API interna não exposta ao usuário final
- ✅ Rate limiting automático do Netlify

## 📝 Notas Importantes

1. **Fallback**: O app continua funcionando mesmo se a API interna falhar (usa API da Caixa como backup)
2. **Cache**: Estatísticas são cacheadas para performance
3. **Invisível**: Usuários não veem a troca de API (transparente)
4. **Gratuito**: Neon e Netlify têm tiers gratuitos suficientes

## 🔍 Troubleshooting

### Erro de Conexão
- Verifique se `DATABASE_URL` está correta
- Confirme que o IP está na whitelist do Neon (se aplicável)

### Importação Falha
- API da Caixa pode estar instável
- Execute novamente após alguns minutos
- Verifique logs: `console.log` mostrará detalhes

### Function não Executa
- Verifique Netlify Dashboard > Functions > Logs
- Confirme que scheduled function está ativa
- Teste manualmente chamando a URL da function

## 📞 Suporte

Para problemas relacionados ao banco de dados:
- Documentação Neon: https://neon.tech/docs
- Documentação Netlify Functions: https://docs.netlify.com/functions

---

**Última atualização**: 09/11/2025
**Versão**: 1.0.0
