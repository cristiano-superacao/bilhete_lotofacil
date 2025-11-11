// IMPORTAÇÃO DOS MÓDULOS DE ESTRATÉGIAS E UTILITÁRIOS
import { apiManager } from './utils/api-manager.js';
import { pegarAleatorios } from './utils/pegarAleatorios.js';
import { 
    calcularFrequenciasGlobais, 
    calcularNumerosAtrasados, 
    calcularDezenasCiclo, 
    gerarJogoAleatorio,
    calcularFrequenciasMensal,
    calcularNumerosMenosFrequentes,
    exibirJogosGerados
} from './utils/helpers.js';
import { estrategiaRepetidas } from './estrategias/estrategiaRepetidas.js';
import { estrategiaParImpar } from './estrategias/estrategiaParImpar.js';
import { estrategiaAtrasados } from './estrategias/estrategiaAtrasados.js';
import { estrategiaSequenciasInteligentes } from './estrategias/estrategiaSequenciasInteligentes.js';
import { estrategiaDivisaoColunas } from './estrategias/estrategiaDivisaoColunas.js';
import { estrategiaFrequenciaHistorica } from './estrategias/estrategiaFrequenciaHistorica.js';
import { estrategiaMatematicaFinais } from './estrategias/estrategiaMatematicaFinais.js';
import { estrategiaFrequenciaMensal } from './estrategias/estrategiaFrequenciaMensal.js';
import { estrategiaTiraCinco } from './estrategias/estrategiaTiraCinco.js';
import { estrategiaBingoDaCaixa } from './estrategias/estrategiaBingoDaCaixa.js';
import { estrategiaForcaPrimos } from './estrategias/estrategiaForcaPrimos.js';
import { estrategiaCicloDezenas } from './estrategias/estrategiaCicloDezenas.js';

// LotoFácil Estratégica - JavaScript Principal
// Autor: Sistema Inteligente de Análise Lotofácil

class LotofacilEstrategica {
    constructor() {
        this.ultimoResultado = null;
        this.jogosGerados = [];
        this.estrategiaAtual = '';
        this.graficoAcertos = null; // Adiciona a propriedade para o gráfico de acertos
        this.graficoFinanceiro = null; // Adiciona a propriedade para o gráfico financeiro

        this.init();
    }

    // Atualiza o histórico marcando jogos cuja data de geração é anterior ou igual à data do concurso carregado.
    habilitarConferenciaApostas(dataConcursoCarregado) {
        if (!dataConcursoCarregado) return;

        // Normaliza a data para um objeto Date para comparação segura.
        // A data pode vir como 'YYYY-MM-DD' ou 'DD/MM/YYYY'.
        let dataReferencia;
        if (String(dataConcursoCarregado).includes('/')) {
            const [dia, mes, ano] = dataConcursoCarregado.split('/');
            dataReferencia = new Date(`${ano}-${mes}-${dia}T23:59:59`); // Considera o final do dia do sorteio.
        } else {
            dataReferencia = new Date(`${dataConcursoCarregado}T23:59:59`); // Assume 'YYYY-MM-DD'.
        }

        if (isNaN(dataReferencia.getTime())) {
            console.error('Data de referência para conferência é inválida:', dataConcursoCarregado);
            return;
        }

        let historico = this.carregarHistorico();
        let jogosHabilitados = 0;

        historico.forEach(aposta => {
            // Se a aposta já foi conferida, não faz nada.
            if (aposta.status === 'conferido') return;

            const dataGeracaoAposta = new Date(aposta.dataGeracao);

            // Habilita se a data de geração da aposta for anterior ou no mesmo dia do sorteio.
            if (dataGeracaoAposta <= dataReferencia && !aposta.conferivel) {
                aposta.conferivel = true;
                jogosHabilitados++;
            }
        });

        if (jogosHabilitados > 0) {
            this.salvarHistorico(historico);
            this.atualizarExibicaoHistorico();
            this.mostrarAlerta(`✅ ${jogosHabilitados} aposta(s) habilitada(s) para conferência!`, 'success');
        }
    }

    jogoJaExiste(jogo, listaJogos) {
        return listaJogos.some(j => JSON.stringify(j) === JSON.stringify(jogo));
    }
    
    init() {
        this.carregarAnalises();
        this.configurarEventos();
        this.definirDataAtual();
        this.recuperarUltimoResultado();
        this.inicializarNumerosReferencia();
        this.atualizarExibicaoHistorico(); // Para carregar o histórico ao iniciar
        this.buscarUltimoConcurso(true); // Inicia com a busca automática
        this.atualizarAnalisePerformance(); // Adicionado para carregar a análise ao iniciar
    }

    // Funções de formatação de data que estavam faltando
    formatarDataBrasil(dataStr) {
        if (!dataStr) return 'Data indisponível';
        // Trata formatos 'yyyy-mm-dd' ou 'dd/mm/yyyy'
        if (dataStr.includes('-')) {
            const [ano, mes, dia] = dataStr.split('T')[0].split('-');
            return `${dia}/${mes}/${ano}`;
        }
        return dataStr; // Assume que já está em dd/mm/yyyy
    }

    converterDataParaInput(dataStr) {
        if (!dataStr) return '';
        // Trata formatos 'dd/mm/yyyy' ou 'yyyy-mm-dd'
        if (dataStr.includes('/')) {
            const [dia, mes, ano] = dataStr.split('/');
            return `${ano}-${mes}-${dia}`;
        }
        return dataStr.split('T')[0]; // Assume que já está em yyyy-mm-dd
    }

    calcularDataAnterior(dataBase, diasAtras) {
        const data = new Date(dataBase);
        data.setDate(data.getDate() - diasAtras);
        return data.toISOString();
    }
    
    recuperarUltimoResultado() {
        try {
            const ultimoSalvo = localStorage.getItem('ultimo_resultado_manual');
            if (ultimoSalvo) {
                this.ultimoResultado = JSON.parse(ultimoSalvo);
                this.preencherFormularioUltimoResultado();
                this.exibirUltimoResultado();
                console.log('Último resultado recuperado do cache');
            }
        } catch (error) {
            console.warn('Erro ao recuperar último resultado:', error);
        }
    }
    
    preencherFormularioUltimoResultado() {
        if (!this.ultimoResultado) return;
        
        document.getElementById('concurso').value = this.ultimoResultado.concurso;
        const dataFormatada = this.ultimoResultado.data.split('/').reverse().join('-');
        document.getElementById('dataConcurso').value = dataFormatada;
        document.getElementById('dezenasUltimoResultado').value = this.ultimoResultado.dezenas.join(',');
    }
    
    async inicializarServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('✅ Service Worker registrado com sucesso:', registration);
                
                // Verificar se há atualizações
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nova versão disponível
                            this.mostrarAlerta('Nova versão disponível! Recarregue a página para atualizar.', 'info');
                        }
                    });
                });
                
                // Verificar se já há um service worker ativo
                if (registration.waiting) {
                    this.mostrarAlerta('Nova versão disponível! Recarregue a página para atualizar.', 'info');
                }
                
                // Inicializar prompt de instalação PWA
                this.inicializarPWAInstall();
                
            } catch (error) {
                console.warn('⚠️ Service Worker registration failed:', error);
            }
        }
    }
    
    // === PWA INSTALL PROMPT ===
    
    inicializarPWAInstall() {
        let deferredPrompt;
        
        // Capturar o evento beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 PWA pode ser instalado');
            // Prevenir o prompt padrão
            e.preventDefault();
            // Guardar o evento para usar depois
            deferredPrompt = e;
            
            // Mostrar banner de instalação personalizado
            this.mostrarBannerInstalacao(deferredPrompt);
        });
        
        // Detectar quando o app foi instalado
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA instalado com sucesso!');
            this.mostrarAlerta('📱 App instalado com sucesso! Acesse pelo ícone na tela inicial', 'success');
            deferredPrompt = null;
        });
        
        // Verificar se já está instalado
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ App já está instalado e rodando em modo standalone');
        }
    }
    
    mostrarBannerInstalacao(deferredPrompt) {
        // Verificar se o usuário já rejeitou o banner antes
        const bannerRejeitado = localStorage.getItem('pwa_install_rejected');
        if (bannerRejeitado) {
            const rejectedTime = parseInt(bannerRejeitado);
            const daysSinceRejection = (Date.now() - rejectedTime) / (1000 * 60 * 60 * 24);
            if (daysSinceRejection < 7) {
                console.log('⏳ Banner de instalação rejeitado recentemente');
                return;
            }
        }
        
        // Criar banner personalizado
        const banner = document.createElement('div');
        banner.id = 'pwa-install-banner';
        banner.className = 'fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-2xl z-50 transform translate-y-full transition-transform duration-500';
        banner.innerHTML = `
            <div class="container mx-auto flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center space-x-3">
                    <div class="bg-white text-purple-600 rounded-full p-2">
                        <i class="fas fa-mobile-alt text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg">Instalar LotoFácil Estratégica</h3>
                        <p class="text-sm text-purple-100">Use offline e acesse direto da tela inicial!</p>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button id="pwa-install-btn" class="bg-white text-purple-600 px-6 py-2 rounded-lg font-bold hover:bg-purple-50 transition-colors">
                        <i class="fas fa-download mr-2"></i>
                        Instalar
                    </button>
                    <button id="pwa-dismiss-btn" class="text-white hover:text-purple-200 px-4">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Animar entrada
        setTimeout(() => {
            banner.classList.remove('translate-y-full');
        }, 500);
        
        // Botão de instalação
        document.getElementById('pwa-install-btn').addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            // Mostrar o prompt de instalação
            deferredPrompt.prompt();
            
            // Aguardar resposta do usuário
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`👤 Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} instalar o PWA`);
            
            if (outcome === 'dismissed') {
                localStorage.setItem('pwa_install_rejected', Date.now().toString());
            }
            
            // Remover banner
            banner.classList.add('translate-y-full');
            setTimeout(() => banner.remove(), 500);
            
            deferredPrompt = null;
        });
        
        // Botão de fechar
        document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
            localStorage.setItem('pwa_install_rejected', Date.now().toString());
            banner.classList.add('translate-y-full');
            setTimeout(() => banner.remove(), 500);
        });
    }
    
    // === NOVA FUNCIONALIDADE: NÚMEROS DE REFERÊNCIA ===
    
    async inicializarNumerosReferencia() {
        try {
            this.mostrarLoading(true, 'Analisando últimos 150 concursos...');
            
            // Buscar os últimos 150 resultados
            this.ultimos150Resultados = await this.buscarUltimos150Resultados();
            
            // Calcular os 9 números mais repetidos
            this.numerosReferencia = this.calcular9NumerosMaisRepetidos();
            
            // Validação dos números de referência
            if (!this.numerosReferencia || this.numerosReferencia.length !== 9) {
                throw new Error('Números de referência inválidos');
            }
            
            // Verificar se todos os números estão no range correto
            const numerosValidos = this.numerosReferencia.every(num => 
                typeof num === 'number' && num >= 1 && num <= 25
            );
            
            if (!numerosValidos) {
                throw new Error('Números de referência fora do range válido');
            }
            
            console.log('Números de referência inicializados com sucesso:', this.numerosReferencia);
            
            // Atualizar interface se existir
            this.atualizarInterfaceNumerosReferencia();
            
        } catch (error) {
            console.warn('Erro ao inicializar números de referência:', error);
            // Usar números de referência padrão baseados em estatísticas históricas (em ordem crescente)
            this.numerosReferencia = [1, 2, 4, 5, 7, 10, 11, 13, 14]; // Números historicamente mais frequentes
            console.log('Usando números de referência padrão:', this.numerosReferencia);
        } finally {
            this.mostrarLoading(false);
        }
    }
    
    async buscarUltimos150Resultados() {
        try {
            console.log('📊 Buscando últimos 150 resultados...');
            
            // Tentar buscar da API interna primeiro (muito mais rápido!)
            const resultados = await apiManager.buscarUltimosConcursos(150);
            
            if (resultados && resultados.length > 0) {
                console.log(`✅ ${resultados.length} resultados obtidos com sucesso`);
                
                // Formatar para o padrão esperado pelo app
                return resultados.map(r => ({
                    concurso: r.numero,
                    dezenas: r.dezenas || r.listaDezenas?.map(n => parseInt(n)) || [],
                    data: r.dataApuracao
                }));
            }
            
            // Se não conseguiu dados da API, usar fallback
            console.warn('⚠️ Usando dados simulados como fallback');
            return this.gerarResultadosSimuladosRealistas(150);
            
        } catch (error) {
            console.warn('Erro ao buscar últimos 150 resultados:', error);
            return this.gerarResultadosSimuladosRealistas(150);
        }
    }
    
    simularResultadoRealista() {
        // Números com maior probabilidade baseados em estatísticas reais da Lotofácil
        const numerosFrequentes = [1, 2, 4, 5, 7, 10, 11, 13, 14, 16, 18, 20, 23, 24, 25];
        const numerosMenosFrequentes = [3, 6, 8, 9, 12, 15, 17, 19, 21, 22];
        
        const dezenas = [];
        
        // 60% de números frequentes, 40% de menos frequentes (padrão real da Lotofácil)
        const embaralhados1 = [...numerosFrequentes].sort(() => 0.5 - Math.random());
        const embaralhados2 = [...numerosMenosFrequentes].sort(() => 0.5 - Math.random());
        
        // Pegar 9 dos frequentes e 6 dos menos frequentes
        dezenas.push(...embaralhados1.slice(0, 9));
        dezenas.push(...embaralhados2.slice(0, 6));
        
        return dezenas.sort((a, b) => a - b);
    }
    
    gerarResultadosSimuladosRealistas(quantidade) {
        const resultados = [];
        for (let i = 0; i < quantidade; i++) {
            resultados.push({
                concurso: 3200 - i,
                dezenas: this.simularResultadoRealista(),
                data: this.calcularDataAnterior(new Date().toISOString(), i * 2)
            });
        }
        return resultados;
    }
    
    calcular9NumerosMaisRepetidos() {
        const frequencia = {};
        
        // Inicializar contadores para todos os números de 1 a 25
        for (let i = 1; i <= 25; i++) {
            frequencia[i] = 0;
        }
        
        // Contar frequência nos últimos 150 resultados com validação
        if (this.ultimos150Resultados && this.ultimos150Resultados.length > 0) {
            this.ultimos150Resultados.forEach(resultado => {
                if (resultado && resultado.dezenas && Array.isArray(resultado.dezenas)) {
                    resultado.dezenas.forEach(numero => {
                        const num = parseInt(numero);
                        if (num >= 1 && num <= 25) {
                            frequencia[num]++;
                        }
                    });
                }
            });
        } else {
            console.warn('Últimos 150 resultados não disponíveis, usando padrão estatístico');
            // Usar padrão baseado em estatísticas históricas reais da Lotofácil
            const numerosMaisFrequentes = [1, 2, 4, 5, 7, 10, 11, 13, 14, 16, 18, 20, 23, 24, 25];
            numerosMaisFrequentes.forEach((num, index) => {
                frequencia[num] = 100 - index; // Dar peso decrescente
            });
        }
        
        // Ordenar por frequência (maior para menor) e pegar os 9 primeiros
        const numerosOrdenados = Object.entries(frequencia)
            .map(([numero, freq]) => ({ numero: parseInt(numero), frequencia: freq }))
            .sort((a, b) => {
                // Se frequências iguais, priorizar números menores (mais comuns na Lotofácil)
                if (b.frequencia === a.frequencia) {
                    return a.numero - b.numero;
                }
                return b.frequencia - a.frequencia;
            })
            .slice(0, 9)
            .map(item => item.numero)
            .sort((a, b) => a - b); // Ordenar em ordem crescente final

        console.log('Números de referência calculados:', numerosOrdenados, 'de', this.ultimos150Resultados.length, 'resultados');
        
        return numerosOrdenados;
    }
    
    atualizarInterfaceNumerosReferencia() {
        // Atualizar interface para mostrar números de referência se houver elemento
        const container = document.getElementById('numerosReferencia');
        if (container) {
            container.innerHTML = `
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-center">
                    <h3 class="text-lg font-bold text-blue-800 mb-2 flex items-center justify-center">
                        <i class="fas fa-star mr-2"></i>
                        Números de Referência (Últimos 150 Concursos)
                    </h3>
                    <p class="text-blue-600 text-sm mb-4 mx-auto max-w-2xl">
                        Os 9 números mais repetidos nos últimos 150 concursos - usados em todas as estratégias:
                    </p>
                    <div class="flex flex-wrap justify-center gap-2">
                        ${this.numerosReferencia.map(num => 
                            `<div class="number-ball bg-blue-500 text-white font-bold">${num.toString().padStart(2, '0')}</div>`
                        ).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    definirDataAtual() {
        const hoje = new Date();
        document.getElementById('dataConcurso').value = hoje.toISOString().split('T')[0];
    }
    
    carregarAnalises() {
        const container = document.getElementById('cardsAnalises');
        if (!container) {
            console.error('Elemento #cardsAnalises não encontrado no DOM.');
            return;
        }
        container.innerHTML = '';
        
        this.analises.forEach(analise => {
            const card = this.criarCardAnalise(analise);
            container.appendChild(card);
        });
    }
    
    criarCardAnalise(analise) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg card-shadow p-6 cursor-pointer transform transition-all duration-300 hover:scale-105';
        
        // Definir número de jogos: 10 para todas as estratégias
        const numeroJogos = 10;
        
        card.innerHTML = `
            <div class="text-center mb-4">
                <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${analise.cor} flex items-center justify-center text-white text-2xl mb-3">
                    <i class="${analise.icon}"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${analise.titulo}</h3>
                <p class="text-gray-600 text-sm mb-4">${analise.descricao}</p>
            </div>
            
            <div class="space-y-3">
                <button class="w-full bg-gradient-to-r ${analise.cor} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity" 
                        onclick="lotofacil.gerarJogos(${analise.id})">
                    <i class="fas fa-magic mr-2"></i>
                    Gerar ${numeroJogos} Jogos
                </button>
                
                <button class="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        onclick="lotofacil.mostrarDetalhes(${analise.id})">
                    <i class="fas fa-info-circle mr-2"></i>
                    Saiba mais
                </button>
            </div>
        `;
        
        return card;
    }
    
    mostrarDetalhes(idEstrategia) {
        const estrategia = this.analises.find(a => a.id === idEstrategia);
        if (!estrategia) return;
        
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-2xl font-bold text-gray-800">${estrategia.titulo}</h3>
                    <button class="text-gray-500 hover:text-gray-700 text-2xl" onclick="this.closest('.fixed').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="mb-4">
                    <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${estrategia.cor} flex items-center justify-center text-white text-3xl mb-4">
                        <i class="${estrategia.icon}"></i>
                    </div>
                </div>
                <div class="space-y-4">
                    <div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-700">Descrição:</h4>
                        <p class="text-gray-600">${estrategia.descricao}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-lg mb-2 text-gray-700">Como funciona:</h4>
                        <p class="text-gray-600">${estrategia.detalhes}</p>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-sm text-blue-800">
                            <i class="fas fa-info-circle mr-2"></i>
                            Esta estratégia gera 10 jogos únicos baseados em padrões estatísticos reais.
                        </p>
                    </div>
                </div>
                <div class="mt-6 flex gap-3">
                    <button class="flex-1 bg-gradient-to-r ${estrategia.cor} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity" 
                            onclick="this.closest('.fixed').remove(); lotofacil.gerarJogos(${idEstrategia})">
                        <i class="fas fa-magic mr-2"></i>
                        Gerar 10 Jogos
                    </button>
                    <button class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
                            onclick="this.closest('.fixed').remove()">
                        Fechar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    configurarEventos() {
        // Último resultado
        document.getElementById('salvarResultado').addEventListener('click', () => {
            this.salvarUltimoResultado();
        });
        
        // O botão de atualização agora busca o último concurso dinamicamente.
        
        // NOVA FUNCIONALIDADE: Busca automática por número do concurso
        const campoConcurso = document.getElementById('concurso');
        
        if (campoConcurso) {
            console.log('📝 Configurando eventos para campo concurso...');
            
            // Buscar quando sair do campo (blur)
            campoConcurso.addEventListener('blur', (e) => {
                const valor = e.target.value.trim();
                if (valor) {
                    console.log('🎯 Campo blur - Buscando concurso:', valor);
                    this.buscarConcursoEspecifico(valor);
                }
            });
            
            // Buscar quando pressionar Enter
            campoConcurso.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const valor = e.target.value.trim();
                    if (valor) {
                        console.log('⌨️ Enter pressionado - Buscando concurso:', valor);
                        this.buscarConcursoEspecifico(valor);
                    }
                }
            });
            
            // Buscar após o usuário parar de digitar (debounce)
            let timeoutBusca;
            campoConcurso.addEventListener('input', (e) => {
                clearTimeout(timeoutBusca);
                const valor = e.target.value.trim();
                
                if (valor && valor.length >= 3) { // Apenas se tiver 3+ dígitos
                    timeoutBusca = setTimeout(() => {
                        console.log('⏱️ Debounce - Buscando concurso:', valor);
                        this.buscarConcursoEspecifico(valor);
                    }, 1500); // Esperar 1.5 segundos após parar de digitar
                }
            });
            
            console.log('✅ Eventos configurados com sucesso!');
        } else {
            console.error('❌ Campo concurso não encontrado!');
        }
        
        // Botões da seção de resultados
        document.getElementById('copiarJogos')?.addEventListener('click', () => {
            this.copiarJogos();
        });
        
        document.getElementById('exportarJogos')?.addEventListener('click', () => {
            this.exportarJogos();
        });
        
        document.getElementById('gerarNovos')?.addEventListener('click', () => {
            if (this.estrategiaAtual) {
                this.gerarJogos(this.estrategiaAtual);
            }
        });

    // Histórico de apostas
        document.getElementById('salvarJogosHistorico')?.addEventListener('click', () => {
            this.salvarJogosNoHistorico();
        });
        
        document.getElementById('limparHistorico')?.addEventListener('click', () => this.limparHistorico());
        document.getElementById('exportarDados')?.addEventListener('click', () => this.exportarDados());
        document.getElementById('atualizarResultados')?.addEventListener('click', () => this.atualizarResultadosConcursos());
    }

    /**
   * Atualiza a seção de Análise de Performance com gráficos e estatísticas.
   */
    atualizarAnalisePerformance() {
        const historico = this.obterHistoricoFiltrado();
        const container = document.getElementById('analise-performance-container');
        if (!container) return;

        const apostasConferidas = historico.filter(aposta => aposta.status === 'conferido');

        if (apostasConferidas.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-hourglass-half text-6xl text-gray-300 mb-4"></i>
                    <p class="text-xl text-gray-500 mb-2">Aguardando conferência...</p>
                    <p class="text-sm text-gray-400">Confira suas apostas para ver a análise de performance aqui.</p>
                </div>
            `;
            return;
        }

        // Prepara o container para os gráficos
        container.innerHTML = `
            <div class="bg-white rounded-lg card-shadow p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Distribuição de Acertos</h3>
                <canvas id="graficoAcertos"></canvas>
            </div>
            <div class="bg-white rounded-lg card-shadow p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Performance Financeira (Últimas 10 Apostas)</h3>
                <canvas id="graficoFinanceiro"></canvas>
            </div>
        `;

        // Calcula dados para os gráficos
        const contagemAcertos = { '11': 0, '12': 0, '13': 0, '14': 0, '15': 0 };
        const performanceFinanceira = {
            labels: [],
            investimentos: [],
            ganhos: []
        };

        apostasConferidas.forEach(aposta => {
            if (aposta.resultados && aposta.resultados.acertos) {
                aposta.resultados.acertos.forEach(acerto => {
                    if (contagemAcertos.hasOwnProperty(acerto.pontos)) {
                        contagemAcertos[acerto.pontos]++;
                    }
                });
            }
        });
        
        // Pegar as últimas 10 apostas para o gráfico financeiro
        const ultimas10Apostas = apostasConferidas.slice(-10);
        ultimas10Apostas.forEach(aposta => {
            performanceFinanceira.labels.push(`Concurso ${aposta.concurso}`);
            performanceFinanceira.investimentos.push(aposta.jogos.length * 3.50);
            performanceFinanceira.ganhos.push(aposta.ganhoTotal || 0);
        });


        this.renderizarGraficos(contagemAcertos, performanceFinanceira);
    }

    /**
     * Renderiza os gráficos de performance usando Chart.js.
     * @param {object} contagemAcertos - Dados para o gráfico de distribuição de acertos.
     * @param {object} performanceFinanceira - Dados para o gráfico de performance financeira.
     */
    renderizarGraficos(contagemAcertos, performanceFinanceira) {
        // Gráfico de Distribuição de Acertos
        const ctxAcertos = document.getElementById('graficoAcertos')?.getContext('2d');
        if (ctxAcertos) {
            if (this.graficoAcertos) {
                this.graficoAcertos.destroy();
            }
            this.graficoAcertos = new Chart(ctxAcertos, {
                type: 'bar',
                data: {
                    labels: ['11', '12', '13', '14', '15 Acertos'],
                    datasets: [{
                        label: 'Quantidade de Prêmios',
                        data: Object.values(contagemAcertos),
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(153, 102, 255, 0.6)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        // Gráfico de Performance Financeira
        const ctxFinanceiro = document.getElementById('graficoFinanceiro')?.getContext('2d');
        if (ctxFinanceiro) {
            if (this.graficoFinanceiro) {
                this.graficoFinanceiro.destroy();
            }
            this.graficoFinanceiro = new Chart(ctxFinanceiro, {
                type: 'line',
                data: {
                    labels: performanceFinanceira.labels,
                    datasets: [
                        {
                            label: 'Investimento (R$)',
                            data: performanceFinanceira.investimentos,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: true,
                            tension: 0.1
                        },
                        {
                            label: 'Ganhos (R$)',
                            data: performanceFinanceira.ganhos,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: true,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'R$ ' + value.toFixed(2);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // === NOVAS FUNCIONALIDADES: RESULTADOS E CONFERÊNCIA ===
    
    async buscarUltimoResultadoAutomatico() {
        try {
            console.log('🔄 Buscando último resultado automaticamente...');
            
            // Tenta buscar o último concurso salvo
            const ultimoSalvo = localStorage.getItem('ultimo_resultado_manual');
            if (ultimoSalvo) {
                const dadosUltimoSalvo = JSON.parse(ultimoSalvo);
                const hoje = new Date();
                const dataUltimoSalvo = new Date(dadosUltimoSalvo.data);
                
                // Se o último resultado salvo é de hoje, não precisa buscar novamente
                if (dataUltimoSalvo.toDateString() === hoje.toDateString()) {
                    console.log('✅ Último resultado já está atualizado:', dadosUltimoSalvo);
                    this.ultimoResultado = dadosUltimoSalvo;
                    this.exibirUltimoResultado();
                    return;
                }
            }
            
            // Se não há último salvo ou é de dias anteriores, busca o último concurso
            await this.buscarUltimoConcurso();
        } catch (error) {
            console.error('Erro ao buscar último resultado automático:', error);
        }
    }
    
    conferirAposta(apostaId) {
        const aposta = this.historico.find(a => a.id === apostaId);
        if (!aposta) return;

        const dezenasSorteadas = this.resultadosConcursos[aposta.concurso];
        if (!dezenasSorteadas) {
          this.exibirNotificacao('Resultado do concurso não encontrado para conferência.', 'erro');
          return;
        }

        const premiacao = {
            11: 7.00,
            12: 14.00,
            13: 35.00,
            14: 1703.57, // Valor médio, pode variar
            15: 1800000.00 // Valor médio, pode variar
        };

        let ganhoTotalAposta = 0;
        const acertosPorJogo = [];

        aposta.jogos.forEach(jogo => {
            const acertos = jogo.filter(num => dezenasSorteadas.includes(num)).length;
            const ganho = premiacao[acertos] || 0;
            ganhoTotalAposta += ganho;
            
            acertosPorJogo.push({
                acertos,
                numerosAcertados: jogo.filter(num => dezenasSorteadas.includes(num))
            });
        });

        // Atualiza a aposta com os resultados da conferência
        aposta.resultados = {
            concurso: aposta.concurso,
            dezenasSorteadas,
            acertos: acertosPorJogo,
            ganhoTotal: ganhoTotalAposta
        };

        // Atualiza o status da aposta para 'conferido'
        aposta.status = 'conferido';

        this.salvarHistorico();
        this.atualizarExibicaoHistorico();

        // Exibir modal com o resultado da conferência
        this.exibirModalResultadoConferencia(aposta, dezenasSorteadas, acertosPorJogo, ganhoTotalAposta);
    }

    exibirModalResultadoConferencia(aposta, dezenasSorteadas, acertosPorJogo, ganhoTotalAposta) {
        const modal = document.getElementById('modal-conferencia');
        const conteudoModal = document.getElementById('modal-conferencia-conteudo');
        if (!modal || !conteudoModal) return;

        const premiacao = {
            11: 7.00,
            12: 14.00,
            13: 35.00,
            14: 1703.57, // Valor médio, pode variar
            15: 1800000.00 // Valor médio, pode variar
        };

        let detalhesJogosHTML = '';
        aposta.jogos.forEach((jogo, index) => {
            const { acertos, numerosAcertados } = acertosPorJogo[index];
            const ganhoJogo = premiacao[acertos] || 0;
            const corTexto = ganhoJogo > 0 ? 'text-green-600' : 'text-red-600';
            const corFundo = ganhoJogo > 0 ? 'bg-green-50' : 'bg-red-50';

            detalhesJogosHTML += `
                <div class="p-3 rounded-lg ${corFundo} border ${ganhoJogo > 0 ? 'border-green-200' : 'border-red-200'}">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">Jogo ${index + 1}: ${acertos} acertos</span>
                        <span class="font-bold ${corTexto}">Ganho: R$ ${ganhoJogo.toFixed(2)}</span>
                    </div>
                    <div class="text-xs text-gray-500 mt-1">
                        Números acertados: ${numerosAcertados.join(', ') || 'Nenhum'}
                    </div>
                </div>
            `;
        });

        conteudoModal.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800">Resultado da Conferência</h2>
                        <p class="text-sm text-gray-500">Concurso ${aposta.concurso} - Estratégia: ${aposta.estrategia}</p>
                    </div>
                    <button onclick="document.getElementById('modal-conferencia').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                <div class="bg-gray-100 p-4 rounded-lg mb-4">
                    <h3 class="font-semibold text-gray-700 mb-2">Dezenas Sorteadas</h3>
                    <div class="flex flex-wrap gap-2">
                        ${dezenasSorteadas.map(d => `<span class="numero-sorteado">${d}</span>`).join('')}
                    </div>
                </div>
                
                <div class="bg-purple-50 border border-purple-200 p-4 rounded-lg mb-6 text-center">
                    <p class="text-lg text-purple-800">Ganho Total na Aposta</p>
                    <p class="text-3xl font-bold text-purple-900">R$ ${ganhoTotalAposta.toFixed(2)}</p>
                </div>

                <details class="bg-gray-50 rounded-lg p-3">
                    <summary class="font-semibold text-gray-700 cursor-pointer">Ver detalhes por jogo</summary>
                    <div class="mt-4 space-y-3">
                        ${detalhesJogosHTML}
                    </div>
                </details>
            </div>
        `;

        modal.classList.remove('hidden');
    }

    limparHistorico() {
        if (confirm('Tem certeza que deseja limpar todo o histórico de apostas? Esta ação não pode ser desfeita.')) {
          this.historico = [];
          this.resultadosConcursos = {};
          this.salvarHistorico();
          this.salvarResultadosConcursos();
          this.atualizarExibicaoHistorico();
          this.exibirNotificacao('Histórico de apostas limpo com sucesso.', 'sucesso');
        }
      }
    
    exportarDados() {
        const dadosFiltrados = this.obterHistoricoFiltrado();
        
        if (dadosFiltrados.length === 0) {
            return this.mostrarAlerta('Nenhum dado encontrado para exportação.', 'info');
        }
        
        // Criar CSV
        const header = ['Concurso', 'Data', 'Estratégia', 'Números', 'Status'];
        const rows = dadosFiltrados.map(aposta => {
            return [
                aposta.concurso || 'N/A',
                aposta.data || 'N/A',
                aposta.estrategia || 'N/A',
                aposta.jogos.map(jogo => jogo.join('-')).join(' | ') || 'N/A',
                aposta.status === 'conferido' ? 'Conferido' : 'Pendente'
            ];
        });
        
        const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `historico_lotofacil_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
    }

}

// Instancia a classe principal e inicia a aplicação
const lotofacil = new LotofacilEstrategica();
document.addEventListener('DOMContentLoaded', () => {
  // O init já é chamado no construtor, então não precisa chamar de novo.
});