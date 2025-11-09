# LotoFácil Estratégica - Documentação Completa

Bem-vindo ao **LotoFácil Estratégica**! Este é um sistema inteligente de geração de jogos da Lotofácil baseado em análises estatísticas e estratégias comprovadas.

---

## 📋 Índice

1. [Como Iniciar o Sistema](#1-como-iniciar-o-sistema)
2. [Funcionalidades Principais](#2-funcionalidades-principais)
3. [As 12 Estratégias Inteligentes](#3-as-12-estratégias-inteligentes)
4. [Histórico de Apostas](#4-histórico-de-apostas)
5. [Análise de Performance](#5-análise-de-performance)
6. [Dicas de Uso](#6-dicas-de-uso)
7. [Solução de Problemas](#7-solução-de-problemas)

---

## 1. Como Iniciar o Sistema

### Requisitos
- Windows com PowerShell
- Navegador Web (Chrome, Firefox, Edge, etc.)
- Git (opcional, para atualizar o código)

### Passo a Passo para Iniciar

1.  **Abra o Terminal do VS Code ou PowerShell**
    - No VS Code: Menu `Terminal` > `Novo Terminal`
    - Ou abra o PowerShell diretamente

2.  **Navegue até a pasta do projeto**
    ```powershell
    cd T:\gerador_lotofacil
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

---

## 2. Funcionalidades Principais

### 🏆 Atualizar Último Resultado

Existem duas formas de adicionar resultados:

#### Opção 1: Busca Automática (Recomendada)
1. Digite o número do concurso no campo **"Concurso"**
2. O sistema buscará automaticamente na API da Caixa
3. Se encontrado, preencherá automaticamente os campos
4. Clique em **"Salvar"** para confirmar

**Dica**: Você pode digitar o número e pressionar Enter ou clicar fora do campo para buscar automaticamente.

#### Opção 2: Cadastro Manual
1. Preencha manualmente:
   - **Concurso**: Número do concurso (ex: 3532)
   - **Data**: Data do sorteio
   - **Dezenas**: 15 números separados por vírgula (ex: 01,02,03,04,05,...)
2. Clique em **"Salvar"**

### 🎲 Gerar Jogos Inteligentes

1. **Escolha uma Estratégia**
   - Role até a seção "Estratégias Inteligentes"
   - Você verá 12 cards, cada um com uma estratégia diferente

2. **Clique em "Gerar 10 Jogos"**
   - O sistema gerará automaticamente 10 jogos únicos
   - Baseados nos critérios da estratégia escolhida
   - Sempre com 15 dezenas válidas cada

3. **Visualize os Resultados**
   - Os jogos aparecerão na seção "Resultados"
   - Cada jogo em um card separado
   - Com as dezenas ordenadas e formatadas

4. **Opções Disponíveis**
   - 📋 **Copiar**: Copia todos os jogos para a área de transferência
   - 💾 **Exportar**: Baixa os jogos em formato de texto
   - 🔄 **Gerar Novos**: Gera novos jogos com a mesma estratégia
   - 💿 **Salvar no Histórico**: Salva os jogos para conferência futura

---

## 3. As 12 Estratégias Inteligentes

### 1️⃣ Poder das Repetidas
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

## 4. Histórico de Apostas

### 💾 Salvar Jogos no Histórico

1. Após gerar jogos, clique em **"Salvar no Histórico"**
2. Os jogos serão salvos com:
   - Data e hora de criação
   - Estratégia utilizada
   - Todos os 10 jogos gerados

### 🔍 Conferir Apostas

**⚠️ Regra Importante**: Só é possível conferir jogos APÓS o sorteio ter acontecido!

1. Localize o card da aposta no histórico
2. Clique no botão verde **"Conferir"**
3. O sistema irá:
   - ✅ Verificar se já houve sorteio após a geração
   - 📡 Buscar o resultado mais recente da API da Caixa
   - 🎯 Comparar seus jogos com os números sorteados
   - 💰 Calcular acertos e prêmios automaticamente

**Tabela de Premiação**:
- 15 acertos: R$ 398.110,55
- 14 acertos: R$ 1.703,57
- 13 acertos: R$ 35,00
- 12 acertos: R$ 14,00
- 11 acertos: R$ 7,00

### 📊 Informações Exibidas após Conferência

- Concurso conferido
- Melhor jogo (quantidade de acertos)
- Total ganho
- Total investido (R$ 3,00 por jogo)
- Lucro ou prejuízo

### 👁️ Ver Detalhes
- Clique em **"Ver Todos"** para visualizar os 10 jogos completos
- Clique em **"Remover"** para excluir do histórico

---

## 5. Análise de Performance

### 📈 Distribuição de Apostas
Após conferir suas apostas, o sistema gera automaticamente:

- **Gráfico de barras** mostrando uso de cada estratégia
- **Percentual** de apostas por estratégia
- **Melhor acerto** de cada estratégia
- **Lucro/Prejuízo** individual (verde = lucro, vermelho = prejuízo)

### 💰 Performance Financeira
Dashboard completo com:

- **Total Investido**: Soma de todas as apostas (R$ 3,00 cada jogo)
- **Total Ganho**: Soma de todos os prêmios
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

## 6. Dicas de Uso

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
   - Use a busca automática para facilitar

### 💡 Recursos Avançados

- **Exportar Dados**: Baixe seu histórico em CSV para análise externa
- **Limpar Histórico**: Remova apostas antigas para organização
- **Copiar Jogos**: Facilita colar em planilhas ou arquivos
- **Filtros**: (Em breve) Filtre por período, estratégia ou status

---

## 7. Solução de Problemas

### ❌ Problema: Página não carrega
**Solução**:
1. Verifique se o servidor está rodando (`.\start-server.ps1`)
2. Confirme se está acessando `http://localhost:8081`
3. Tente outro navegador
4. Limpe o cache do navegador (Ctrl + Shift + Delete)

### ❌ Problema: Busca automática não funciona
**Solução**:
- A API da Caixa pode estar bloqueada (CORS)
- O sistema usará dados simulados automaticamente
- Você pode cadastrar manualmente sem problemas

### ❌ Problema: Não consigo conferir aposta
**Solução**:
- Verifique se já houve sorteio após a geração dos jogos
- O sistema só permite conferir após o resultado oficial
- Aguarde o próximo concurso e tente novamente

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