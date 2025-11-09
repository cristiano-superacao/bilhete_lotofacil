# 🚀 Guia de Deploy - LotoFácil Estratégica

## Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta no Netlify (gratuita)
- [ ] Conta no Neon PostgreSQL (gratuita)

---

## PASSO 1: Configurar Banco de Dados (Neon)

### 1.1 Criar Projeto no Neon

1. Acesse: https://neon.tech
2. Faça login ou crie uma conta gratuita
3. Clique em **"New Project"**
4. Configure:
   - **Name**: `lotofacil-estrategica`
   - **Region**: Escolha o mais próximo (ex: US East)
   - **PostgreSQL Version**: 16 (padrão)
5. Clique em **"Create Project"**

### 1.2 Copiar Connection String

1. Na tela do projeto, localize **"Connection String"**
2. Selecione **"Pooled connection"**
3. Copie a string completa, exemplo:
   ```
   postgresql://user:password@ep-abc123.us-east-2.aws.neon.tech/lotofacil?sslmode=require
   ```
4. **GUARDE ESSA STRING** - você precisará dela!

### 1.3 Executar Schema SQL

1. No painel do Neon, vá em **"SQL Editor"**
2. Abra o arquivo `database/schema.sql` do projeto
3. Copie TODO o conteúdo
4. Cole no SQL Editor do Neon
5. Clique em **"Run"**
6. Aguarde a mensagem de sucesso ✅

---

## PASSO 2: Importar Dados Iniciais

### 2.1 Configurar Localmente

1. Clone o repositório (se ainda não fez):
   ```bash
   git clone https://github.com/cristiano-superacao/bilhete_lotofacil.git
   cd bilhete_lotofacil
   ```

2. Crie arquivo `.env` na raiz:
   ```bash
   echo DATABASE_URL=SUA_CONNECTION_STRING_AQUI > .env
   ```
   
   **Substitua** `SUA_CONNECTION_STRING_AQUI` pela string do Neon!

3. Instale dependências:
   ```bash
   npm install
   ```

### 2.2 Executar Importação

```bash
npm run db:import
```

**O que acontece**:
- Busca os últimos 200 sorteios da API da Caixa
- Salva no banco de dados Neon
- Mostra progresso e estatísticas
- **Duração**: ~2-3 minutos

**Resultado esperado**:
```
✅ Importados com sucesso: 200
💾 Total de sorteios no banco: 200
```

---

## PASSO 3: Deploy no Netlify

### 3.1 Conectar Repositório

1. Acesse: https://app.netlify.com
2. Faça login com GitHub
3. Clique em **"Add new site"** > **"Import an existing project"**
4. Escolha **"GitHub"**
5. Autorize o Netlify
6. Selecione o repositório: `bilhete_lotofacil`

### 3.2 Configurar Build

Na tela de configuração:
- **Branch to deploy**: `main`
- **Build command**: (deixe vazio)
- **Publish directory**: `.` (ponto)
- **Functions directory**: `netlify/functions`

Clique em **"Deploy site"**

### 3.3 Configurar Variável de Ambiente

1. Após o deploy, vá em **"Site settings"**
2. Menu lateral: **"Environment variables"**
3. Clique em **"Add a variable"**
4. Configure:
   - **Key**: `DATABASE_URL`
   - **Value**: Sua connection string do Neon (a mesma do .env)
   - **Scopes**: Marque todas (Functions, Deploys, etc)
5. Clique em **"Save"**

### 3.4 Redeploy

1. Vá em **"Deploys"**
2. Clique em **"Trigger deploy"** > **"Clear cache and deploy site"**
3. Aguarde o deploy completar

---

## PASSO 4: Verificar Funcionamento

### 4.1 Testar Site

1. Acesse a URL fornecida pelo Netlify (ex: `https://lotofacil-xyz.netlify.app`)
2. Verifique se o site carrega normalmente
3. Teste gerar jogos
4. Teste salvar no histórico

### 4.2 Testar API (Opcional)

Abra no navegador:

```
https://SEU-SITE.netlify.app/api/sorteios?limite=5
```

**Resultado esperado**: JSON com 5 últimos sorteios

### 4.3 Verificar Scheduled Function

1. No Netlify, vá em **"Functions"**
2. Localize **"atualizar-sorteios"**
3. Verifique se está marcada como **"Scheduled"**
4. Clique nela para ver configurações
5. Deve mostrar: **"0 1 * * *"** (diariamente às 22h BRT)

---

## PASSO 5: Manutenção

### Atualização Manual de Sorteios (Se Necessário)

Se precisar forçar atualização antes do horário programado:

1. No Netlify, vá em **"Functions"**
2. Clique em **"atualizar-sorteios"**
3. Na aba **"Function log"**, localize a URL de trigger
4. Acesse a URL no navegador para executar manualmente

### Verificar Logs

**Logs da Scheduled Function**:
1. Netlify Dashboard > Functions > atualizar-sorteios
2. Aba "Function log"
3. Verá logs diários de execução

**Logs do Banco**:
1. Neon Console > SQL Editor
2. Execute:
   ```sql
   SELECT COUNT(*) FROM sorteios;
   SELECT * FROM sorteios ORDER BY concurso DESC LIMIT 5;
   ```

---

## 🎉 Pronto!

Seu sistema está completo e rodando:

✅ Site no ar (Netlify)  
✅ Banco de dados (Neon PostgreSQL)  
✅ API interna funcionando  
✅ Atualização automática diária  
✅ Histórico de 200 sorteios  

### URLs Importantes

- **Site**: https://SEU-SITE.netlify.app
- **API Sorteios**: https://SEU-SITE.netlify.app/api/sorteios
- **Neon Console**: https://console.neon.tech
- **Netlify Dashboard**: https://app.netlify.com

---

## 🆘 Problemas Comuns

### "Failed to connect to database"
- Verifique se a variável `DATABASE_URL` está configurada no Netlify
- Confirme que a connection string está correta
- Tente redeploy

### "Function timeout"
- Primeiro deploy pode demorar mais
- Aguarde 2-3 minutos
- Se persistir, verifique logs no Netlify

### "Import falhou"
- API da Caixa pode estar instável
- Tente novamente em alguns minutos
- Execute em horários fora de pico (evite 20h-21h)

---

## 📞 Suporte

- GitHub Issues: https://github.com/cristiano-superacao/bilhete_lotofacil/issues
- Documentação Neon: https://neon.tech/docs
- Documentação Netlify: https://docs.netlify.com

**Última atualização**: 09/11/2025
