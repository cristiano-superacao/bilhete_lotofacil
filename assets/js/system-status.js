// 📊 Painel de Status do Sistema - LotoFácil Estratégica v2.1.0
// Monitor de conexões e performance do banco de dados

class SystemStatusPanel {
    constructor(dbManager, strategyManager) {
        this.dbManager = dbManager;
        this.strategyManager = strategyManager;
        this.isVisible = false;
        this.updateInterval = null;
        this.createPanel();
    }

    // 🎨 Criar painel de status
    createPanel() {
        // Criar estrutura HTML do painel
        const panelHTML = `
            <div id="systemStatusPanel" class="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border-2 border-gray-200 p-4 max-w-sm z-50 transform translate-y-full transition-transform duration-300">
                <div class="flex items-center justify-between mb-3">
                    <h3 class="text-lg font-bold text-gray-800 flex items-center">
                        <i class="fas fa-database mr-2 text-blue-500"></i>
                        Status do Sistema
                    </h3>
                    <button id="closeStatusPanel" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <!-- Status da Conexão -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span class="text-sm font-medium text-gray-700">Firebase</span>
                        <div id="firebaseStatus" class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                            <span class="text-sm text-gray-600">Verificando...</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span class="text-sm font-medium text-gray-700">LocalStorage</span>
                        <div id="localStorageStatus" class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                            <span class="text-sm text-gray-600">Verificando...</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span class="text-sm font-medium text-gray-700">API Caixa</span>
                        <div id="apiStatus" class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                            <span class="text-sm text-gray-600">Verificando...</span>
                        </div>
                    </div>
                </div>
                
                <!-- Estatísticas -->
                <div class="mt-4 pt-3 border-t border-gray-200">
                    <h4 class="text-sm font-semibold text-gray-700 mb-2">Estatísticas</h4>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="text-center p-2 bg-blue-50 rounded">
                            <div id="totalJogos" class="font-bold text-blue-600">0</div>
                            <div class="text-gray-600">Jogos Salvos</div>
                        </div>
                        <div class="text-center p-2 bg-green-50 rounded">
                            <div id="ultimaSync" class="font-bold text-green-600">-</div>
                            <div class="text-gray-600">Última Sync</div>
                        </div>
                    </div>
                </div>
                
                <!-- Ações -->
                <div class="mt-4 pt-3 border-t border-gray-200">
                    <div class="grid grid-cols-2 gap-2">
                        <button id="forceSync" class="text-xs px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                            <i class="fas fa-sync mr-1"></i>
                            Sincronizar
                        </button>
                        <button id="clearCache" class="text-xs px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                            <i class="fas fa-trash mr-1"></i>
                            Limpar Cache
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Adicionar painel ao body
        document.body.insertAdjacentHTML('beforeend', panelHTML);

        // Configurar eventos
        this.setupEvents();
    }

    // 🎯 Configurar eventos do painel
    setupEvents() {
        // Botão de fechar
        document.getElementById('closeStatusPanel').addEventListener('click', () => {
            this.hide();
        });

        // Botão de sincronização forçada
        document.getElementById('forceSync').addEventListener('click', async () => {
            await this.forceSync();
        });

        // Botão de limpar cache
        document.getElementById('clearCache').addEventListener('click', () => {
            this.clearCache();
        });

        // Tecla de atalho (Ctrl + Shift + S)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    // 👁️ Mostrar painel
    show() {
        const panel = document.getElementById('systemStatusPanel');
        panel.classList.remove('translate-y-full');
        panel.classList.add('translate-y-0');
        this.isVisible = true;
        
        // Iniciar atualizações automáticas
        this.startAutoUpdate();
        
        // Atualizar imediatamente
        this.updateStatus();
    }

    // 🙈 Esconder painel
    hide() {
        const panel = document.getElementById('systemStatusPanel');
        panel.classList.remove('translate-y-0');
        panel.classList.add('translate-y-full');
        this.isVisible = false;
        
        // Parar atualizações automáticas
        this.stopAutoUpdate();
    }

    // 🔄 Alternar visibilidade
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    // 🔄 Atualizar status do sistema
    async updateStatus() {
        try {
            // Status do banco de dados
            const dbStatus = this.dbManager.getStatus();
            
            // Atualizar Firebase
            this.updateConnectionStatus('firebaseStatus', dbStatus.firebase);
            
            // Atualizar LocalStorage
            this.updateConnectionStatus('localStorageStatus', dbStatus.localStorage);
            
            // Testar API da Caixa
            await this.testApiCaixa();
            
            // Atualizar estatísticas
            await this.updateStatistics();
            
        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
        }
    }

    // 🔗 Atualizar status de conexão
    updateConnectionStatus(elementId, isConnected) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const indicator = element.querySelector('.w-3');
        const text = element.querySelector('span');

        if (isConnected) {
            indicator.className = 'w-3 h-3 rounded-full bg-green-500 mr-2';
            text.textContent = 'Conectado';
            text.className = 'text-sm text-green-600';
        } else {
            indicator.className = 'w-3 h-3 rounded-full bg-red-500 mr-2';
            text.textContent = 'Desconectado';
            text.className = 'text-sm text-red-600';
        }
    }

    // 🌐 Testar API da Caixa
    async testApiCaixa() {
        try {
            const response = await fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/');
            const isConnected = response.ok;
            this.updateConnectionStatus('apiStatus', isConnected);
        } catch (error) {
            this.updateConnectionStatus('apiStatus', false);
        }
    }

    // 📊 Atualizar estatísticas
    async updateStatistics() {
        try {
            const stats = await this.strategyManager.obterEstatisticas();
            
            // Total de jogos
            document.getElementById('totalJogos').textContent = stats.totalJogos || 0;
            
            // Última sincronização
            const ultimaSync = document.getElementById('ultimaSync');
            if (stats.ultimaAtividade) {
                const data = new Date(stats.ultimaAtividade);
                ultimaSync.textContent = data.toLocaleTimeString('pt-BR');
            } else {
                ultimaSync.textContent = '-';
            }
            
        } catch (error) {
            console.error('❌ Erro ao carregar estatísticas:', error);
        }
    }

    // 🔄 Sincronização forçada
    async forceSync() {
        const syncButton = document.getElementById('forceSync');
        const originalText = syncButton.innerHTML;
        
        try {
            syncButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i>Sincronizando...';
            syncButton.disabled = true;
            
            await this.dbManager.sincronizar();
            await this.updateStatus();
            
            // Feedback visual
            syncButton.innerHTML = '<i class="fas fa-check mr-1"></i>Concluído!';
            syncButton.className = 'text-xs px-3 py-2 bg-green-500 text-white rounded';
            
            setTimeout(() => {
                syncButton.innerHTML = originalText;
                syncButton.className = 'text-xs px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors';
                syncButton.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            syncButton.innerHTML = '<i class="fas fa-times mr-1"></i>Erro!';
            syncButton.className = 'text-xs px-3 py-2 bg-red-500 text-white rounded';
            
            setTimeout(() => {
                syncButton.innerHTML = originalText;
                syncButton.className = 'text-xs px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors';
                syncButton.disabled = false;
            }, 2000);
        }
    }

    // 🗑️ Limpar cache
    clearCache() {
        const clearButton = document.getElementById('clearCache');
        const originalText = clearButton.innerHTML;
        
        if (confirm('Tem certeza que deseja limpar todos os dados do cache local?')) {
            try {
                // Limpar apenas dados do sistema
                const keysToRemove = Object.keys(localStorage).filter(key => 
                    key.includes('lotofacil') || 
                    key.includes('estrategia') ||
                    key.includes('ultimo_resultado')
                );
                
                keysToRemove.forEach(key => localStorage.removeItem(key));
                
                clearButton.innerHTML = '<i class="fas fa-check mr-1"></i>Limpo!';
                clearButton.className = 'text-xs px-3 py-2 bg-green-500 text-white rounded';
                
                setTimeout(() => {
                    clearButton.innerHTML = originalText;
                    clearButton.className = 'text-xs px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors';
                    this.updateStatus();
                }, 2000);
                
            } catch (error) {
                console.error('❌ Erro ao limpar cache:', error);
            }
        }
    }

    // ⏰ Iniciar atualizações automáticas
    startAutoUpdate() {
        this.stopAutoUpdate(); // Evitar múltiplos intervalos
        this.updateInterval = setInterval(() => {
            this.updateStatus();
        }, 30000); // Atualizar a cada 30 segundos
    }

    // ⏹️ Parar atualizações automáticas
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// 🌐 Exportar para uso global
window.SystemStatusPanel = SystemStatusPanel;