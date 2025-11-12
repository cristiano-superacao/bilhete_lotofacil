# 🎯 LotoFácil Estratégica

<div align="center">

![Status](https://img.shields.io/badge/Status-Ativo-green)
![Versão](https://img.shields.io/badge/Versão-2.3.0-blue)
![Licença](https://img.shields.io/badge/Licença-MIT-yellow)

**Ferramenta inteligente de análise e geração de jogos para a Lotofácil baseada em estatísticas reais com infraestrutura serverless.**

[🚀 Demonstração](#-como-executar-localmente) • [✨ Funcionalidades](#-principais-funcionalidades) • [📖 Como Usar](#-passo-a-passo-de-utilização) • [🎲 Estratégias](#-as-12-estratégias)

</div>

---

## 📖 Sobre o Projeto

O **LotoFácil Estratégica** é uma aplicação web completa que oferece 12 estratégias avançadas para geração de jogos da Lotofácil, análise estatística baseada nos últimos 150 concursos, histórico de apostas com conferência automática e muito mais.

### 🎯 Objetivo

Fornecer uma ferramenta profissional e gratuita para apostadores que desejam utilizar dados estatísticos e padrões históricos reais para otimizar suas escolhas, em vez de depender apenas da sorte.

### 🌟 Novidades da Versão 2.3.0

- **🗄️ Banco de Dados em Nuvem**: PostgreSQL serverless (Neon) com 200+ concursos armazenados
- **🚀 API Própria**: 4 endpoints serverless (Netlify Functions) para consulta otimizada
- **🤖 Atualização Automática**: Scheduled function busca novos sorteios diariamente às 22h
- **⚡ Performance 10x Melhor**: API Manager com fallback inteligente (API interna → Caixa)
- **📊 Histórico de Apostas Completo**: Salve seus jogos gerados, acompanhe estatísticas financeiras (total investido, ganhos e saldo) e confira resultados automaticamente
- **✅ Conferência Inteligente com Rateio Oficial**: Sistema busca prêmios reais de cada concurso (API CAIXA) e calcula ganhos exatos por faixa de acertos
- **👁️ Botão "Ver Jogos"**: Visualize todos os jogos de uma aposta salva em modal compacto e responsivo
- **🎯 Agendamento Automático**: Apostas salvas são automaticamente vinculadas ao próximo concurso (ex: 3537)
- **💰 Preços Oficiais CAIXA**: Valor do bilhete R$ 3,50 e prêmios fixos atualizados (11=R$7, 12=R$14, 13=R$35)
- **🔄 Integração com API da Caixa**: Busque resultados por número do concurso ou atualize apostas salvas com um clique
- **🎨 Interface Redesenhada**: Layout responsivo e profissional em grid 4x3 para as estratégias e cards organizados para o histórico
- **💾 Exportação de Dados**: Exporte seu histórico de apostas para arquivo JSON ou CSV
- **📱 PWA (Progressive Web App)**: Instale a aplicação no seu dispositivo para acesso offline

---

## ✨ Principais Funcionalidades

- ✅ **12 Estratégias Estatísticas**: Cada uma gera 10 jogos únicos baseados em critérios específicos
- ✅ **Números de Referência**: Utiliza os 9 números mais frequentes dos últimos 150 concursos como base
- ✅ **API Própria + Fallback**: Sistema inteligente com API interna (10x mais rápida) e fallback para API da Caixa
- ✅ **Banco de Dados em Nuvem**: PostgreSQL serverless (Neon) com 200+ concursos históricos
- ✅ **Atualização Automática**: Scheduled function busca novos sorteios diariamente às 22h (BRT)
- ✅ **Histórico Completo**: Salve, visualize e confira suas apostas com número do concurso
- ✅ **Análise de Performance**: Acompanhe total de apostas, ganhos, investimentos e saldo geral
- ✅ **Exportação e Cópia**: Exporte jogos para arquivo TXT ou copie para a área de transferência
- ✅ **Design Responsivo**: Funciona perfeitamente em desktops, tablets e smartphones
- ✅ **Custo Zero**: Infraestrutura 100% gratuita (Neon + Netlify free tiers)

---

## 🚀 Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (v18+ recomendado)
- Conta [Neon](https://neon.tech) (para banco de dados - free tier suficiente)
- Conta [Netlify](https://www.netlify.com/) (para deploy - free tier suficiente)

### Passo a Passo

1. **Clone o Repositório:**
   ```bash
   git clone https://github.com/cristiano-superacao/bilhete_lotofacil.git
   cd bilhete_lotofacil
   ```

2. **Configure o Banco de Dados:**
   ```bash
   # Edite .env com sua connection string do Neon
   # Depois execute o schema e importe os dados
   npm install
   npm run db:schema  # Cole o SQL no Neon Console
   npm run db:import  # Importa últimos 200 concursos
   ```

3. **Desenvolvimento Local:**
   ```bash
   http-server
   ```
   Ou, se estiver no Windows, execute:
   ```powershell
   .\start-server.ps1
   ```

4. **Deploy para Produção:**
   - Conecte o repositório ao Netlify
   - Configure a variável de ambiente `DATABASE_URL` no Netlify
   - Deploy automático ativado!

📚 **Guias Detalhados:**
- [DEPLOY-RAPIDO.md](DEPLOY-RAPIDO.md) - Setup em 15 minutos
- [DEPLOY.md](DEPLOY.md) - Guia completo com troubleshooting
- [database/README.md](database/README.md) - Documentação técnica do banco

---

## 📖 Passo a Passo de Utilização

### 1️⃣ **Informe o Último Resultado**

Na seção **"Último Resultado"**:
- Preencha o **número do concurso**, a **data** e as **15 dezenas sorteadas** (separadas por vírgula).
- Clique em **Salvar**.
- O resultado será exibido e usado como base para algumas estratégias (como "Poder das Repetidas").
- **Dica**: Você pode digitar apenas o número do concurso e pressionar Enter — o sistema tentará buscar automaticamente na API da Caixa!

### 2️⃣ **Escolha uma Estratégia**

Na seção **"Estratégias Inteligentes"**:
- Navegue pelos **12 cards de estratégias**.
- Clique em **"Saiba mais"** para entender como cada uma funciona.
- Quando decidir, clique em **"Gerar 10 Jogos"**.

### 3️⃣ **Visualize e Salve seus Jogos**

Na seção **"Seus Jogos Gerados"**:
- Os **10 jogos únicos** serão exibidos com as 15 dezenas de cada um.
- **Copie** um jogo específico ou **Exporte** todos para um arquivo TXT.
- Clique em **"Salvar no Histórico"** para armazenar a aposta.

### 4️⃣ **Acompanhe no Histórico de Apostas**

Na seção **"Histórico de Apostas"**:
- Visualize todas as suas apostas salvas em **cards organizados**.
- Cada card mostra:
  - Nome da estratégia utilizada
  - Data e hora de geração
  - Número total de jogos
  - **Número do concurso** (ex: "Agendado para o concurso 3537")
  - Botões: **"Ver Jogos"** e **"Conferir"**
  - Status: **"Aguardando"** ou **"Conferido"**

### 5️⃣ **Visualize seus Jogos Salvos**

- Clique no botão **"Ver Jogos"** em qualquer card do histórico
- Veja todos os 10 jogos da aposta em um modal compacto e responsivo
- Números exibidos em formato visual (bolinhas) para fácil visualização

### 6️⃣ **Atualize e Confira os Resultados**

Quando o resultado oficial for divulgado:
1. Clique no botão **"Atualizar Resultados"** na seção de histórico.
2. O sistema buscará automaticamente os resultados oficiais da CAIXA (incluindo **rateios/prêmios reais**).
3. Apostas com concursos sorteados ficam disponíveis para conferência (botão **"Conferir"** fica verde).
4. Clique em **"Conferir"** para ver:
   - Quantos acertos você fez em cada jogo
   - Valor ganho por faixa (usando **prêmios oficiais** do rateio da CAIXA)
   - Se não houver rateio disponível, usa valores fixos (11=R$7, 12=R$14, 13=R$35)

### 7️⃣ **Acompanhe suas Estatísticas**

No topo do histórico, você verá:
- **Total de Apostas**: Quantidade de apostas salvas
- **Total em Ganhos**: Soma dos prêmios baseada em valores oficiais da CAIXA
- **Total Investido**: Valor gasto (R$ 3,50 por jogo de 15 dezenas)
- **Saldo Geral**: Ganhos menos investimentos (negativo em vermelho, positivo em verde)

---

## 🎲 As 12 Estratégias

### 1. **Poder das Repetidas** 🔄
- **Como funciona**: Utiliza 5 a 7 números do último concurso e complementa com números estratégicos.
- **Base estatística**: ~60% dos sorteios repetem pelo menos 5 números do concurso anterior.
- **Ideal para**: Quem acredita em padrões de continuidade.

### 2. **Equilíbrio Par/Ímpar** ⚖️
- **Como funciona**: Garante a proporção de 7 pares + 8 ímpares (ou vice-versa).
- **Base estatística**: ~85% dos sorteios seguem essa distribuição.
- **Ideal para**: Apostadores que buscam equilíbrio matemático.

### 3. **Números Atrasados** ⏰
- **Como funciona**: Prioriza dezenas que não saem há mais tempo (60% atrasados + 40% normais).
- **Base estatística**: Lei dos Grandes Números — números tendem a se equilibrar ao longo do tempo.
- **Ideal para**: Quem acredita que "a hora vai chegar".

### 4. **Sequências Inteligentes** 🔗
- **Como funciona**: Evita sequências óbvias (1,2,3... ou 5,10,15...) e cria combinações naturais.
- **Base estatística**: Padrões lineares raramente aparecem nos sorteios reais.
- **Ideal para**: Apostadores que buscam combinações menos previsíveis.

### 5. **Divisão por Colunas** 📊
- **Como funciona**: Distribui os números pelas 5 colunas do volante: (1-5), (6-10), (11-15), (16-20), (21-25).
- **Base estatística**: Garante cobertura máxima de todas as regiões do volante.
- **Ideal para**: Quem deseja uma distribuição geográfica no volante.

### 6. **Frequência Histórica** 📈
- **Como funciona**: Combina 50% números quentes (mais sorteados) + 30% frios + 20% neutros.
- **Base estatística**: Análise de milhares de sorteios históricos.
- **Ideal para**: Apostadores que confiam em estatísticas de longo prazo.

### 7. **Matemática dos Finais** 🔢
- **Como funciona**: Analisa as terminações (0,1,2...9) e evita concentrações de finais iguais.
- **Base estatística**: Distribuição equilibrada das terminações é mais natural.
- **Ideal para**: Quem gosta de análises numéricas detalhadas.

### 8. **Frequência Mensal** 📅
- **Como funciona**: Foca nos números mais sorteados no mês anterior (60% frequentes + 40% balanceamento).
- **Base estatística**: Dados recentes da API oficial da Caixa.
- **Ideal para**: Quem acredita em "ondas" de números.

### 9. **Análise do Tira Cinco** ➖
- **Como funciona**: Remove os 5 números menos sorteados dos últimos 5 meses e gera jogos com os restantes.
- **Base estatística**: Elimina dezenas "frias" para focar nas mais ativas.
- **Ideal para**: Apostadores agressivos que excluem números fracos.

### 10. **Bingo da Caixa** 🏆
- **Como funciona**: Usa os 9 números de referência (mais frequentes nos últimos 150 concursos) + 6 complementares.
- **Base estatística**: Maximiza as chances usando a base estatística mais sólida.
- **Ideal para**: Quem busca a estratégia mais "segura" estatisticamente.

### 11. **Força dos Primos** ⚛️
- **Como funciona**: Usa de 4 a 6 números primos (2,3,5,7,11,13,17,19,23) e complementa com não-primos.
- **Base estatística**: ~99% dos sorteios contêm números primos.
- **Ideal para**: Quem acredita no poder matemático dos números primos.

### 12. **Ciclo das Dezenas** 🔄
- **Como funciona**: Identifica números que ainda não fecharam o ciclo (todas as 25 dezenas sorteadas) nos últimos concursos e os prioriza.
- **Base estatística**: Análise dos últimos 8-10 concursos para encontrar dezenas "devendo" aparecer.
- **Ideal para**: Apostadores que buscam completar padrões cíclicos.

---

## 📊 Recursos Avançados

### 🔍 Filtros e Análises
- **Filtro por Período**: Visualize apostas de períodos específicos (em breve).
- **Filtro por Estratégia**: Veja apenas apostas de uma estratégia específica (em breve).
- **Filtro por Status**: Separe apostas "Aguardando" de "Conferidas".

### 💾 Exportação de Dados
- **Exportar Histórico**: Baixe todas as suas apostas em formato JSON para backup.
- **Exportar Jogos**: Salve os jogos gerados em arquivo TXT para imprimir ou compartilhar.

### 📱 Progressive Web App (PWA)
- **Instalação**: Instale a aplicação no seu dispositivo como se fosse um app nativo.
- **Uso Offline**: Acesse suas apostas salvas mesmo sem internet (após a primeira visita).
- **Notificações**: Receba alertas quando houver novos resultados (em breve).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3 / Tailwind CSS**: Design moderno e responsivo
- **JavaScript (ES6+)**: Lógica de geração e análise
- **Arquitetura Modular**: Código organizado em módulos reutilizáveis
- **API da Caixa**: Integração com dados oficiais
- **LocalStorage**: Persistência de dados no navegador
- **PWA**: Service Workers para funcionalidade offline

---

## 📝 Estrutura do Projeto

```
bilhete_lotofacil/
├── index.html                 # Página principal
├── manifest.json              # Configuração PWA
├── sw.js                      # Service Worker
├── start-server.ps1           # Script para iniciar servidor (Windows)
├── assets/
│   ├── css/
│   │   └── style.css          # Estilos customizados
│   ├── js/
│   │   ├── app.js             # Lógica principal
│   │   ├── estrategias/       # Módulos de estratégias
│   │   │   ├── estrategiaRepetidas.js
│   │   │   ├── estrategiaParImpar.js
│   │   │   ├── estrategiaAtrasados.js
│   │   │   ├── estrategiaSequenciasInteligentes.js
│   │   │   ├── estrategiaDivisaoColunas.js
│   │   │   ├── estrategiaFrequenciaHistorica.js
│   │   │   ├── estrategiaMatematicaFinais.js
│   │   │   ├── estrategiaFrequenciaMensal.js
│   │   │   ├── estrategiaTiraCinco.js
│   │   │   ├── estrategiaBingoDaCaixa.js
│   │   │   ├── estrategiaForcaPrimos.js
│   │   │   └── estrategiaCicloDezenas.js
│   │   └── utils/             # Utilitários
│   │       ├── helpers.js
│   │       └── pegarAleatorios.js
│   └── images/                # Ícones e imagens
└── README.md                  # Documentação
```
```bash
# Com o servidor customizado
node server.js [porta]      # Default: 3000

# Ou instale uma dependência global
npm install -g http-server
http-server . -p 3000
```

**Usando Live Server (VS Code):**
1. Instale a extensão "Live Server"
2. Clique direito no `index.html`
3. Selecione "Open with Live Server"

#### **Método 3: Abrir Diretamente no Navegador**
```bash
# Simplesmente abra o arquivo no navegador
# Funciona, mas pode ter limitações com alguns recursos
```

### 🌐 **Hospedagem Web**

#### **GitHub Pages (Gratuito)**
1. **Push para GitHub:**
   ```bash
   git add .
   git commit -m "Deploy LotoFácil Estratégica"
   git push origin main
   ```

2. **Configurar GitHub Pages:**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - O site estará em: `https://seu-usuario.github.io/lotofacil-estrategica/`

3. **Deploy Automático:**
   - O workflow `.github/workflows/deploy.yml` já está configurado
   - Deploy automático a cada push na branch main

#### **Netlify (Gratuito)**
1. **Deploy via Git:**
   ```bash
   # Conecte seu repositório GitHub no Netlify
   # Deploy automático configurado com netlify.toml
   ```

2. **Deploy Manual:**
   ```bash
   # Instale o Netlify CLI
   npm install -g netlify-cli
   
   # Login e deploy
   netlify login
   netlify deploy --prod
   ```

3. **Deploy via Drag & Drop:**
   - Acesse [netlify.com](https://netlify.com)
   - Arraste a pasta do projeto para a área de deploy

#### **Vercel (Gratuito)**
1. **Deploy via Git:**
   ```bash
   # Conecte seu repositório GitHub no Vercel
   # Deploy automático configurado com vercel.json
   ```

2. **Deploy via CLI:**
   ```bash
   # Instale o Vercel CLI
   npm install -g vercel
   
   # Login e deploy
   vercel login
   vercel --prod
   ```

#### **Outras Opções de Hospedagem**
- **Firebase Hosting**: `firebase deploy`
- **Surge.sh**: `surge . seu-dominio.surge.sh`
- **GitHub Codespaces**: Para desenvolvimento online
- **Heroku**: Com buildpack estático

### 📱 **Testando o Projeto**

1. **Acesse via navegador:**
   - Local: `http://localhost:3000` ou `http://localhost:8000`
   - Web: URL do seu deploy

2. **Teste as funcionalidades:**
   - Inserir último resultado da Lotofácil
   - Gerar jogos com diferentes estratégias
   - Copiar e exportar jogos
   - Testar responsividade (mobile/desktop)

3. **Validar arquivos:**
   ```bash
   npm run validate
   ```

---

## 🧠 Estratégias Implementadas

### 1. 🔄 **Poder das Repetidas**
- **Conceito**: Utiliza números que saíram no último concurso
- **Base Estatística**: 60% dos concursos repetem ao menos 5 números
- **Como Funciona**: Seleciona 5-7 números do último resultado + números complementares
- **Jogos Gerados**: 7

### 2. ⚖️ **Equilíbrio Par/Ímpar**
- **Conceito**: Mantém proporção ideal entre pares e ímpares
- **Padrão**: 7 pares + 8 ímpares OU 8 pares + 7 ímpares
- **Justificativa**: 85% dos sorteios seguem essa distribuição
- **Jogos Gerados**: 7

### 3. ⏰ **Números Atrasados**
- **Conceito**: Prioriza dezenas que estão há mais tempo sem sair
- **Princípio**: Lei dos grandes números
- **Método**: 60% números atrasados + 40% números normais
- **Jogos Gerados**: 7

### 4. 🔗 **Sequências Inteligentes**
- **Conceito**: Evita sequências óbvias e padrões lineares
- **Estratégia**: Analisa padrões que raramente saem juntos
- **Resultado**: Combinações mais naturais e menos previsíveis
- **Jogos Gerados**: 7

### 5. 📋 **Divisão por Colunas**
- **Conceito**: Distribui números pelas 5 colunas do volante
- **Colunas**: (1-5), (6-10), (11-15), (16-20), (21-25)
- **Benefício**: Cobertura máxima de todas as regiões
- **Jogos Gerados**: 7

### 6. 📊 **Frequência Histórica**
- **Conceito**: Combina números quentes e frios
- **Proporção**: 50% quentes + 30% frios + 20% neutros
- **Base**: Análise de milhares de sorteios históricos
- **Jogos Gerados**: 7

### 7. 🔢 **Matemática dos Finais**
- **Conceito**: Analisa terminações dos números (0,1,2...9)
- **Objetivo**: Distribuição equilibrada das terminações
- **Evita**: Concentrações incomuns de finais iguais
- **Jogos Gerados**: 7

### 8. 📅 **Frequência Mensal** ⭐ **NOVA!**
- **Conceito**: Analisa números do mês anterior até o atual
- **Integração**: API oficial da Caixa Econômica Federal
- **Método**: Busca resultados recentes e calcula frequência real
- **Algoritmo**: 60% números mais frequentes + 40% balanceamento
- **Diferencial**: Usa dados oficiais ao invés de simulações
- **Jogos Gerados**: 10 *(única estratégia com mais jogos)*
- **API Endpoint**: `https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/`

### 9. ⚛️ **Força dos Primos** ⭐ **NOVA!**
- **Conceito**: Foca em números primos (2, 3, 5, 7, 11, 13, 17, 19, 23).
- **Base Estatística**: 99% dos sorteios contêm entre 4 e 6 números primos.
- **Como Funciona**: Seleciona de 4 a 6 números primos e completa com dezenas não-primas.
- **Jogos Gerados**: 10

### 10. 🔄 **Ciclo das Dezenas** ⭐ **NOVA!**
- **Conceito**: Identifica as dezenas que faltam para fechar o ciclo de sorteios.
- **Como Funciona**: Analisa os últimos 8 a 10 concursos para encontrar os números que ainda não foram sorteados e os utiliza como base para os novos jogos.
- **Benefício**: Aumenta a chance de acertar dezenas que estão estatisticamente "atrasadas" no ciclo.
- **Jogos Gerados**: 10

> ⭐ **DESTAQUE**: A estratégia "Frequência Mensal" é a mais avançada, sendo a única que se conecta com dados oficiais em tempo real da Caixa e gera 10 jogos únicos ao invés de 7!

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Estilos personalizados + Tailwind CSS
- **JavaScript ES6+**: Lógica da aplicação e estratégias
- **Tailwind CSS**: Framework CSS para design responsivo
- **Font Awesome**: Ícones profissionais

### Bibliotecas
- **Chart.js**: Para gráficos futuros de estatísticas
- **Tailwind CSS CDN**: Design system completo

### Características Técnicas
- **Hybrid Architecture**: Client-side + API integration
- **Async Operations**: Operações assíncronas com async/await
- **Responsivo**: Mobile-first design
- **Error Handling**: Tratamento robusto de erros e timeouts
- **Fallback System**: Sistema de backup automático
- **Performance**: Otimizado para carregamento rápido
- **API Integration**: Conexão com dados oficiais da Caixa

---

## 📁 Estrutura do Projeto

```
lotofacil-estrategica/
│
├── 📄 index.html              # Página principal
├── � README.md               # Documentação principal
├── 📄 CHANGELOG.md            # Histórico de mudanças
├── 📄 HISTORICO-MANUAL.md     # Manual do sistema de histórico
├── �📁 assets/                 # Assets organizados
│   ├── 📁 css/
│   │   └── style.css          # Estilos customizados
│   ├── 📁 js/
│   │   └── app.js             # Lógica JavaScript (8 estratégias otimizadas)
│   └── 📁 images/             # Imagens e ícones
│
├── 🧪 Testes:
│   ├── teste-estrategias.html      # Validação automática de todas estratégias
│   ├── teste-nova-estrategia.html  # Teste da estratégia Frequência Mensal
│   ├── test-complete.html          # Testes completos do sistema
│   └── test-functionality.html     # Testes de funcionalidade
│
├── 🔧 Configuração Web:
│   ├── netlify.toml           # Config Netlify
│   ├── vercel.json            # Config Vercel
│   └── .github/workflows/
│       └── deploy.yml         # GitHub Actions
│
├── 🖥️ Desenvolvimento Local:
│   ├── server.js              # Servidor Node.js
│   ├── server.py              # Servidor Python
│   ├── run.bat                # Script Windows
│   └── run.sh                 # Script Linux/Mac
│
├── 📦 Gerenciamento:
│   ├── package.json           # Dependências e scripts
│   ├── .gitignore            # Arquivos ignorados
│   └── README.md              # Documentação
│
└── 📋 projeto loto facil.txt  # Conceito original
```

### Arquitetura do JavaScript

```javascript
LotofacilEstrategica/          # Classe principal
├── 🏗️ Constructor & Init:
│   ├── constructor()          # Inicialização
│   ├── init()                # Configuração inicial  
│   └── analises[]            # 12 estratégias definidas
│
├── 🧠 Estratégias:
│   ├── estrategiaRepetidas()
│   ├── estrategiaParImpar()
│   ├── estrategiaAtrasados()
│   ├── estrategiaNumerosPrimos()
│   ├── estrategiaCicloDezenas()
│   ├── ... (e outras 7)
│
├── 🎨 Interface:
│   ├── carregarAnalises()     # Renderizar cards
│   ├── exibirJogosGerados()   # Mostrar resultados
│   ├── mostrarAlerta()        # Notificações
│   └── mostrarLoading()       # Indicadores
│
└── 🔧 Utilitários:
    ├── embaralharArray()      # Randomização
    ├── copiarJogos()         # Clipboard
    └── exportarJogos()       # Download CSV
```

---

## 🔮 Melhorias Futuras

### Versão 2.0 (Planejada)
- [ ] **API da Caixa**: Busca automática dos resultados
- [ ] **Histórico Completo**: Base de dados com todos os sorteios
- [ ] **Gráficos Estatísticos**: Visualizações interativas
- [ ] **Personalização**: Ajustar parâmetros das estratégias
- [ ] **Sistema de Login**: Salvar jogos favoritos

### Versão 3.0 (Futuro)
- [ ] **IA Preditiva**: Machine Learning para padrões
- [ ] **App Mobile**: Versão nativa para iOS/Android
- [ ] **Análise Social**: Comparar estratégias com outros usuários
- [ ] **Notificações**: Alertas de novos sorteios

---

## 📈 Histórico de Versões

### **v2.1.0** - *17/10/2025* ⭐ **ATUAL**
- 🔧 **Código Otimizado**: Removidas duplicações e código redundante
- ✅ **Validação Melhorada**: Sistema robusto de validação de jogos e dados
- 🎯 **10 Jogos Garantidos**: Todas as estratégias agora geram exatamente 10 jogos únicos
- 📊 **Números de Referência Otimizados**: Cálculo aprimorado dos 9 números mais frequentes
- 🛡️ **Tratamento de Erros Avançado**: Melhor handling de APIs e fallbacks inteligentes
- ⚡ **Performance Melhorada**: Funções auxiliares otimizadas e cache inteligente

### **v3.0.0** - *08/11/2025* ⭐ **ATUAL**
- 📊 **Histórico de Apostas Completo**: Salve jogos, acompanhe estatísticas financeiras e confira resultados
- ✅ **Conferência Inteligente**: Sistema habilita conferência apenas para datas coincidentes com sorteios
- 🔄 **Atualização Automática**: Busca de resultados por número de concurso e atualização de apostas
- 🎨 **Interface Redesenhada**: Layout responsivo em grid 4x3 e cards profissionais
- 💾 **Exportação de Dados**: Histórico exportável em JSON
- 📱 **PWA**: Aplicação instalável para uso offline
- 🎲 **12 Estratégias**: Todas geram 10 jogos únicos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você tem ideias para novas estratégias ou melhorias:

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/NovaEstrategia`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova estratégia X'`)
4. **Push** para a branch (`git push origin feature/NovaEstrategia`)
5. Abra um **Pull Request**

---

## 📧 Contato

**Desenvolvedor**: Cristiano Santos  
**WhatsApp**: (71) 9 9337-2960  
**GitHub**: [@cristiano-superacao](https://github.com/cristiano-superacao)  
**Repositório**: [bilhete_lotofacil](https://github.com/cristiano-superacao/bilhete_lotofacil)

---

## ⚠️ Aviso Legal

> **IMPORTANTE**: Este projeto é uma ferramenta de apoio estatístico e educacional. Não garantimos resultados em sorteios reais. A Lotofácil é um jogo de probabilidade e os resultados são aleatórios.
>
> - Jogue com responsabilidade
> - Apenas maiores de 18 anos
> - Não gaste mais do que pode perder
> - Procure ajuda se identificar sinais de vício em jogos

---

## 📜 Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**⭐ Se este projeto foi útil para você, deixe uma estrela no repositório!**

Desenvolvido com 💜 por [Cristiano Santos](https://github.com/cristiano-superacao)

[🔝 Voltar ao topo](#-lotofácil-estratégica)

</div>