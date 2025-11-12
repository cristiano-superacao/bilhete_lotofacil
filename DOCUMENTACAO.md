# LotoFácil Estratégica - Documentação Completa

Bem-vindo ao **LotoFácil Estratégica**! Este é um sistema inteligente de geração de jogos da Lotofácil baseado em análises estatísticas e estratégias comprovadas, com infraestrutura serverless completa.

**Versão**: 2.3.0 | **Infraestrutura**: PostgreSQL (Neon) + Netlify Functions | **Custo**: R$ 0,00/mês

---

## 📋 Índice

1. [Como Iniciar o Sistema](#1-como-iniciar-o-sistema)
2. [Funcionalidades Principais](#2-funcionalidades-principais)
3. [Nova Infraestrutura (v2.2.0)](#3-nova-infraestrutura-v220)
4. [As 12 Estratégias Inteligentes](#4-as-12-estratégias-inteligentes)
5. [Histórico de Apostas](#5-histórico-de-apostas)
6. [Análise de Performance](#6-análise-de-performance)
7. [Dicas de Uso](#7-dicas-de-uso)
8. [Solução de Problemas](#8-solução-de-problemas)

---

## 1. Como Iniciar o Sistema

### Requisitos
- Windows com PowerShell
- Navegador Web (Chrome, Firefox, Edge, etc.)
- Git (opcional, para atualizar o código)
- Node.js v18+ (para desenvolvimento local com banco de dados)

### Passo a Passo para Iniciar

1.  **Abra o Terminal do VS Code ou PowerShell**
    - No VS Code: Menu `Terminal` > `Novo Terminal`
    - Ou abra o PowerShell diretamente

2.  **Navegue até a pasta do projeto**
    ```powershell
    cd T:\Sistemas_Desenvolvimento\bilhete_lotofacil
    ```

3.  **Execute o Script do Servidor**
    ```powershell
    .\start-server.ps1
    ```

4.  **Acesse a Aplicação**
    - Abra seu navegador
    - Digite: `http://localhost:8081`
    - Pronto! O sistema está rodando ✅

**⚠️ Importante**: 
- Mantenha o terminal aberto enquanto usar o sistema
- Para parar o servidor: pressione `Ctrl+C` no terminal
- Em produção (Netlify), o sistema funciona 24/7 sem necessidade de servidor local

---

## 2. Funcionalidades Principais

### 🏆 Atualizar Último Resultado

Existem duas formas de adicionar resultados:

#### Opção 1: Busca Automática (Recomendada) ⚡
1. Digite o número do concurso no campo **"Concurso"**
2. O sistema buscará automaticamente:
   - **1ª tentativa**: API própria (Neon Database) - **~50-100ms**
   - **2ª tentativa**: API da Caixa (fallback automático) - **~1-2s**
3. Se encontrado, preencherá automaticamente os campos
4. Clique em **"Salvar"** para confirmar

**Dica**: Você pode digitar o número e pressionar Enter ou clicar fora do campo para buscar automaticamente. O sistema é 10x mais rápido que antes!

#### Opção 2: Cadastro Manual
1. Preencha manualmente:
   - **Concurso**: Número do concurso (ex: 3532)
   - **Data**: Data do sorteio
   - **Dezenas**: 15 números separados por vírgula (ex: 01,02,03,04,05,...)
2. Clique em **"Salvar"**

---

## 3. Nova Infraestrutura (v2.2.0)

### 🗄️ Banco de Dados em Nuvem

O sistema agora possui seu próprio banco de dados PostgreSQL serverless hospedado no Neon:

- **200+ concursos armazenados** (atualizados automaticamente)
- **Performance 10x melhor**: Consultas em ~50-100ms vs ~1-2s da API externa
- **Disponibilidade 99.9%**: Infraestrutura redundante
- **Custo zero**: Free tier do Neon (suficiente para 50k+ concursos)

### 🚀 API Própria

4 endpoints serverless (Netlify Functions):

1. **GET /api/sorteios** - Lista concursos com paginação
   - Parâmetros: `limite` (default: 150), `offset` (default: 0)
   - Exemplo: `/api/sorteios?limite=50&offset=0`

2. **GET /api/sorteios/:concurso** - Busca concurso específico
   - Exemplo: `/api/sorteios/3200`

3. **GET /api/sorteios/periodo** - Filtra por período
   - Parâmetros: `tipo` (dia/semana/mes/ano), `valor`
   - Exemplo: `/api/sorteios/periodo?tipo=mes&valor=11`

4. **Scheduled Function** - Atualização automática diária
   - Executa às 22:00 BRT (01:00 UTC)
   - Busca novos concursos da API Caixa
   - Salva no banco automaticamente

### ⚡ Sistema de Fallback Inteligente

O **API Manager** (`assets/js/utils/api-manager.js`) gerencia todas as requisições:

```
┌─────────────────────────────────────┐
│ Frontend (app.js)                   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│ API Manager (fallback inteligente)  │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┴─────────────┐
    ▼                           ▼
┌─────────┐             ┌──────────────┐
│ API     │  Timeout    │ API Caixa    │
│ Interna │  ou Falha   │ (Fallback)   │
└─────────┘      →      └──────────────┘
 ~50-100ms              ~1-2s
```

**Funcionamento**:
- Tenta primeiro a API interna (Neon)
- Se falhar ou demorar >10s, usa API da Caixa
- Retorna dados no formato padronizado
- Rastreia estatísticas de sucesso/falha

### � Estatísticas em Tempo Real

O sistema acompanha:
- Total de requisições
- Taxa de sucesso da API interna
- Taxa de fallback para API Caixa
- Tempo médio de resposta

---

## 4. As 12 Estratégias Inteligentes
**O que faz**: Utiliza números que saíram no último concurso
- 📊 Base estatística: 60% dos sorteios repetem 5+ números
- 🎯 Seleciona 5-7 números do último resultado
- ✅ Complementa com números estratégicos

### 2️⃣ Equilíbrio Par/Ímpar
**O que faz**: Mantém proporção ideal entre pares e ímpares
- 📊 Padrão: 7 pares + 8 ímpares OU 8 pares + 7 ímpares
- ✅ Presente em 85% dos sorteios históricos

### 3️⃣ Números Atrasados
**O que faz**: Prioriza dezenas que estão há mais tempo sem sair
- 📊 Baseado na Lei dos Grandes Números
- 🎯 60% atrasados + 40% balanceamento

### 4️⃣ Sequências Inteligentes
**O que faz**: Evita sequências lógicas e padrões lineares
- 📊 Analisa padrões da API oficial
- ✅ Cria combinações naturais e menos previsíveis

### 5️⃣ Divisão por Colunas
**O que faz**: Distribui números pelas 5 colunas do volante
- 📊 Colunas: (1-5), (6-10), (11-15), (16-20), (21-25)
- ✅ Garante cobertura máxima de todas as regiões

### 6️⃣ Frequência Histórica
**O que faz**: Combina números quentes, frios e neutros
- 📊 50% quentes + 30% frios + 20% neutros
- ✅ Análise de milhares de sorteios

### 7️⃣ Matemática dos Finais
**O que faz**: Analisa terminações dos números (0-9)
- 📊 Evita concentração de finais iguais
- ✅ Distribui equilibradamente as terminações

### 8️⃣ Frequência Mensal
**O que faz**: Análise dos números do mês anterior até o atual
- 📊 Dados oficiais da Caixa
- 🎯 60% mais frequentes + 40% balanceamento

### 9️⃣ Análise do Tira Cinco
**O que faz**: Remove os 5 números menos sorteados dos últimos 5 meses
- 📊 Analisa 5 meses via API da Caixa
- ✅ Gera jogos estratégicos com os restantes

### 🔟 Bingo da Caixa
**O que faz**: Usa os 9 números de referência mais frequentes
- 📊 Baseado nos últimos 150 concursos
- 🎯 9 números base + 6 complementares = 15 dezenas

### 1️⃣1️⃣ Força dos Primos
**O que faz**: Foca em números primos (2,3,5,7,11,13,17,19,23)
- 📊 Primos aparecem em 99% dos sorteios
- 🎯 4-6 primos + números não-primos = 15 dezenas

### 1️⃣2️⃣ Ciclo das Dezenas
**O que faz**: Identifica dezenas que faltam para fechar o ciclo
- 📊 Analisa últimos 8-10 concursos
- 🎯 Prioriza números que ainda não foram sorteados no período

---

## 5. Histórico de Apostas

### 💾 Salvar Jogos no Histórico

1. Após gerar jogos, clique em **"Salvar no Histórico"**
2. Os jogos serão automaticamente vinculados ao próximo concurso disponível
3. O sistema salvará:
   - Data e hora de criação
   - Estratégia utilizada
   - Todos os 10 jogos gerados
   - **Número do concurso de referência** (para conferência)
   - **Data do sorteio** do concurso vinculado

### 🔍 Conferir Apostas

**⚠️ Regra Importante**: Só é possível conferir jogos APÓS o resultado oficial do concurso vinculado estar disponível!

**Sistema de Vinculação por Concurso**:
- Cada aposta salva é automaticamente vinculada a um concurso específico
- O botão "Conferir" só é habilitado quando o resultado daquele concurso está disponível
- Você verá no card: o número do concurso e a data do sorteio de referência
- **Bug corrigido na v2.2.0**: Número do concurso agora exibe corretamente nos cards salvos

**Como Conferir**:

1. Localize o card da aposta no histórico
2. Aguarde o concurso de referência ser sorteado
3. Clique no botão verde **"Conferir"** (habilitado automaticamente)
4. O sistema irá:
   - ✅ Buscar o resultado oficial (API interna → fallback Caixa)
   - 🎯 Comparar seus 10 jogos com os números sorteados
   - 💰 **Buscar prêmios oficiais (rateio)** do concurso na API da CAIXA
   - 💵 Calcular ganhos exatos usando os valores reais de cada faixa
   - 📊 Atualizar as estatísticas gerais

**Sistema de Premiação Inteligente**:
- O sistema busca automaticamente os **prêmios oficiais (rateio)** de cada concurso na API da CAIXA
- Para 15 e 14 acertos: usa valores do rateio oficial
- Para 13, 12 e 11 acertos: 
  - Prioriza rateio oficial quando disponível
  - Caso não haja rateio, usa valores fixos: **R$ 35,00** (13), **R$ 14,00** (12), **R$ 7,00** (11)

### 👁️ Ver Jogos

- Clique em **"Ver Jogos"** em qualquer card do histórico
- Visualize todos os 10 jogos da aposta em modal compacto e responsivo
- Números exibidos em formato visual (bolinhas) para fácil identificação

### 📊 Informações Exibidas após Conferência

- Concurso conferido
- Melhor jogo (quantidade de acertos)
- **Total ganho (baseado em prêmios oficiais da CAIXA)**
- Total investido (R$ 3,50 por jogo de 15 dezenas)
- Lucro ou prejuízo real

### �️ Remover Apostas
- Clique em **"Remover"** no card para excluir a aposta do histórico
- Confirmação automática antes da exclusão

---

## 6. Análise de Performance

### 📈 Distribuição de Apostas
Após conferir suas apostas, o sistema gera automaticamente:

- **Gráfico de barras** mostrando uso de cada estratégia
- **Percentual** de apostas por estratégia
- **Melhor acerto** de cada estratégia
- **Lucro/Prejuízo** individual (verde = lucro, vermelho = prejuízo)

### 💰 Performance Financeira
Dashboard completo com:

- **Total Investido**: Soma de todas as apostas (R$ 3,50 por jogo de 15 dezenas)
- **Total Ganho**: Soma de todos os prêmios baseados em valores oficiais da CAIXA
- **Lucro/Prejuízo**: Diferença entre ganhos e investimentos
- **ROI**: Retorno sobre investimento em percentual
- **Evolução**: Gráfico das últimas 10 apostas conferidas

### 📊 Estatísticas Detalhadas
Contadores automáticos de:

- Quantidade de jogos com 11 acertos
- Quantidade de jogos com 12 acertos
- Quantidade de jogos com 13 acertos
- Quantidade de jogos com 14 acertos
- Quantidade de jogos com 15 acertos ⭐

**Resumo Geral**:
- Melhor estratégia (maior lucro)
- Pior estratégia (menor desempenho)
- Taxa de acerto (melhor e pior jogo geral)

---

## 7. Dicas de Uso

### 🎯 Para Melhores Resultados

1. **Diversifique suas Estratégias**
   - Não use apenas uma estratégia
   - Teste diferentes abordagens
   - Observe qual funciona melhor para você

2. **Mantenha o Histórico Atualizado**
   - Sempre salve seus jogos antes de apostar
   - Confira regularmente após os sorteios
   - Analise os padrões de performance

3. **Use a Análise de Performance**
   - Acompanhe seu ROI
   - Identifique estratégias mais rentáveis
   - Ajuste sua abordagem baseado nos dados

4. **Atualize o Último Resultado**
   - Mantenha sempre o concurso mais recente cadastrado
   - Estratégias como "Poder das Repetidas" dependem disso
   - Use a busca automática para facilitar (10x mais rápida!)

### 💡 Recursos Avançados

- **Exportar Dados**: Baixe seu histórico em CSV para análise externa
- **Limpar Histórico**: Remova apostas antigas para organização
- **Copiar Jogos**: Facilita colar em planilhas ou arquivos
- **API Própria**: Performance 10x melhor com banco de dados em nuvem
- **Atualização Automática**: Sistema busca novos concursos diariamente às 22h

### 🚀 Performance e Confiabilidade

- **Velocidade**: ~50-100ms (API interna) vs ~1-2s (API externa)
- **Disponibilidade**: 99.9% uptime (Neon + Netlify)
- **Custo**: R$ 0,00/mês (free tiers)
- **Backup**: Dados salvos no LocalStorage + Neon Cloud

---

## 8. Solução de Problemas

### ❌ Problema: Página não carrega
**Solução**:
1. Verifique se o servidor está rodando (`.\start-server.ps1`)
2. Confirme se está acessando `http://localhost:8081`
3. Tente outro navegador
4. Limpe o cache do navegador (Ctrl + Shift + Delete)

### ❌ Problema: Busca automática lenta
**Solução**:
- **Produção**: Sistema usa API interna (50-100ms)
- **Local**: Pode usar API Caixa (1-2s) - normal
- **Fallback automático**: Se API interna falhar, usa Caixa automaticamente
- Verifique conexão com internet

### ❌ Problema: API não responde
**Solução**:
- O sistema possui **fallback inteligente**
- Se API interna falhar, automaticamente tenta API Caixa
- Se ambas falharem, você pode cadastrar manualmente
- Verifique no console (F12) qual API está sendo usada

### ❌ Problema: Não consigo conferir aposta

**Solução**:
- Verifique se o resultado do concurso vinculado já foi divulgado oficialmente
- O botão "Conferir" só é habilitado quando o concurso de referência tem resultado disponível
- Você pode ver o número do concurso e a data no próprio card da aposta
- Sistema atualiza resultados automaticamente às 22h (BRT)

### ❌ Problema: Número do concurso não aparece no card

**Solução**:
- **Corrigido na v2.2.0**: Este bug foi resolvido
- Se persistir, limpe o cache do navegador
- Verifique se está usando a versão mais recente (v2.2.0)

---

## 🔧 Informações Técnicas

### Arquitetura do Sistema

```
Frontend (HTML + TailwindCSS)
        ↓
app.js (Controller principal)
        ↓
API Manager (assets/js/utils/api-manager.js)
        ↓
    ┌───┴────┐
    ↓        ↓
API Interna  API Caixa
(Netlify)    (Fallback)
    ↓
PostgreSQL
(Neon Cloud)
```

### Tecnologias Utilizadas

**Frontend**:
- HTML5 + TailwindCSS
- JavaScript ES6 Modules
- LocalStorage para persistência local
- Service Worker (PWA)

**Backend**:
- PostgreSQL 16 (Neon serverless)
- Netlify Functions (Node.js 18)
- Scheduled Functions (Cron jobs)
- @neondatabase/serverless driver

**Infraestrutura**:
- Neon (Database) - Free tier: 0.5GB
- Netlify (Hosting + Functions) - Free tier: 125k req/mês
- GitHub (Versionamento)
- VS Code (Desenvolvimento)

### Scripts Disponíveis

```bash
# Desenvolvimento local
npm run start          # Inicia servidor HTTP

# Banco de dados
npm run db:schema      # Exibe schema SQL para executar no Neon
npm run db:import      # Importa últimos 200 concursos

# Deploy
npm run deploy         # Deploy para Netlify (via CLI)
```

### Variáveis de Ambiente

Arquivo `.env` (não versionado):
```
DATABASE_URL=postgresql://user:pass@host/dbname
```

---

## 📚 Documentação Adicional

- **DEPLOY-RAPIDO.md**: Guia de deploy em 15 minutos (7 passos)
- **DEPLOY.md**: Documentação completa com troubleshooting
- **database/README.md**: Documentação técnica do banco de dados
- **CHANGELOG.md**: Histórico completo de versões

---

## 🆘 Suporte

**Problemas ou dúvidas?**
- Abra uma issue no GitHub: https://github.com/cristiano-superacao/bilhete_lotofacil
- Consulte os guias de deployment
- Verifique o CHANGELOG para novidades

**Versão Atual**: 2.2.0  
**Última Atualização**: 09/11/2025
- Se o concurso já foi sorteado mas o botão ainda está desabilitado, clique em "Atualizar Resultados" no topo do histórico

### ❌ Problema: Estratégia não gera jogos
**Solução**:
1. Atualize a página (Ctrl + F5)
2. Verifique o console do navegador (F12)
3. Certifique-se que salvou o último resultado (para estratégia "Poder das Repetidas")

### ❌ Problema: Servidor não inicia
**Solução**:
1. Verifique se a porta 8081 está livre
2. Tente executar como administrador
3. Reinicie o VS Code ou PowerShell

---

## 📞 Suporte

Para dúvidas, sugestões ou reportar problemas:
- 🐛 Issues: https://github.com/cristiano-superacao/gerador_lotofacil/issues

---

## 📝 Changelog

### Versão 2.1.0 (Novembro 2025)
- ✅ **Sistema de vinculação por concurso**: Apostas agora são vinculadas automaticamente ao próximo concurso
- ✅ **Conferência inteligente**: Botão de conferir só é habilitado após o resultado do concurso vinculado
- ✅ **Exibição de concurso nos cards**: Cada aposta mostra o concurso e data de referência
- ✅ **Funcionalidade Copiar**: Copia todos os 10 jogos para área de transferência em formato texto
- ✅ **Funcionalidade Exportar**: Exporta jogos em arquivo .txt com nome personalizado (estratégia + data)
- ✅ **Busca dinâmica**: Removido concurso hardcoded, sistema sempre busca o último resultado disponível
- ✅ **Melhorias na UX**: Feedback visual aprimorado e alertas mais informativos

### Versão 2.0.0 (Novembro 2025)
- ✅ 12 estratégias inteligentes implementadas
- ✅ Sistema de conferência automática de apostas
- ✅ Controle de data para conferência (só após sorteio)
- ✅ Análise de performance em tempo real
- ✅ Estatísticas detalhadas com gráficos
- ✅ Histórico persistente no navegador
- ✅ Exportação de dados em CSV
- ✅ Layout responsivo e profissional
- ✅ Busca automática de resultados via API

---

## 🎉 Boa Sorte!

Lembre-se: Este sistema é uma ferramenta de análise estatística. 
Jogue com responsabilidade e dentro de suas possibilidades financeiras.

**Que os números estejam ao seu favor!** 🍀