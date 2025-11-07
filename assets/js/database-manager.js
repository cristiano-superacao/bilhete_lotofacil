// 🗄️ Sistema Unificado de Banco de Dados - LotoFácil Estratégica v2.1.0
// Integra localStorage, Firebase/Firestore e validação completa

class DatabaseManager {
    constructor() {
        this.useFirebase = false;
        this.db = null;
        this.initFirebase();
    }

    // 🔥 Inicializar Firebase/Firestore
    async initFirebase() {
        try {
            // Verificar se a configuração está disponível
            const firebaseConfig = window.FIREBASE_CONFIG || {
                apiKey: "demo-key",
                authDomain: "demo.firebaseapp.com",
                projectId: "demo-project",
                storageBucket: "demo.appspot.com",
                messagingSenderId: "123456789",
                appId: "1:123456789:web:demo"
            };

            // Verificar se Firebase está disponível
            if (typeof firebase !== 'undefined') {
                firebase.initializeApp(firebaseConfig);
                this.db = firebase.firestore();
                this.useFirebase = true;
                console.log('✅ Firebase conectado com sucesso');
                console.log('🔗 Projeto:', firebaseConfig.projectId);
            } else {
                console.warn('⚠️ Firebase não disponível, usando apenas localStorage');
                console.log('💡 Para ativar Firebase, configure firebase-config.js');
            }
        } catch (error) {
            console.warn('⚠️ Erro ao conectar Firebase:', error.message);
            console.log('📱 Modo offline ativado - dados salvos apenas localmente');
            this.useFirebase = false;
        }
    }

    // 💾 Salvar dados (Firebase + localStorage backup)
    async salvar(collection, id, dados) {
        try {
            // Sempre salvar no localStorage como backup
            const chave = `${collection}_${id}`;
            localStorage.setItem(chave, JSON.stringify({
                ...dados,
                timestamp: Date.now(),
                source: 'local'
            }));

            // Tentar salvar no Firebase se disponível
            if (this.useFirebase && this.db) {
                await this.db.collection(collection).doc(id).set({
                    ...dados,
                    timestamp: Date.now(),
                    source: 'firebase'
                });
                console.log(`✅ Dados salvos: ${collection}/${id}`);
            }

            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar:', error);
            return false;
        }
    }

    // 📖 Carregar dados (Firebase primeiro, localStorage como fallback)
    async carregar(collection, id) {
        try {
            // Tentar carregar do Firebase primeiro
            if (this.useFirebase && this.db) {
                const doc = await this.db.collection(collection).doc(id).get();
                if (doc.exists) {
                    return doc.data();
                }
            }

            // Fallback para localStorage
            const chave = `${collection}_${id}`;
            const dados = localStorage.getItem(chave);
            return dados ? JSON.parse(dados) : null;

        } catch (error) {
            console.error('❌ Erro ao carregar:', error);
            
            // Fallback final para localStorage
            const chave = `${collection}_${id}`;
            const dados = localStorage.getItem(chave);
            return dados ? JSON.parse(dados) : null;
        }
    }

    // 📋 Listar todos os documentos de uma coleção
    async listar(collection) {
        try {
            const dados = [];

            // Tentar carregar do Firebase
            if (this.useFirebase && this.db) {
                const snapshot = await this.db.collection(collection).get();
                snapshot.forEach(doc => {
                    dados.push({ id: doc.id, ...doc.data() });
                });
                
                if (dados.length > 0) {
                    return dados;
                }
            }

            // Fallback para localStorage
            const chavesLocalStorage = Object.keys(localStorage);
            const dadosLocal = [];

            for (const chave of chavesLocalStorage) {
                if (chave.startsWith(`${collection}_`)) {
                    try {
                        const item = JSON.parse(localStorage.getItem(chave));
                        const id = chave.replace(`${collection}_`, '');
                        dadosLocal.push({ id, ...item });
                    } catch (e) {
                        console.warn(`Erro ao processar ${chave}:`, e);
                    }
                }
            }

            return dadosLocal;

        } catch (error) {
            console.error('❌ Erro ao listar:', error);
            return [];
        }
    }

    // 🗑️ Excluir dados
    async excluir(collection, id) {
        try {
            // Excluir do Firebase
            if (this.useFirebase && this.db) {
                await this.db.collection(collection).doc(id).delete();
            }

            // Excluir do localStorage
            const chave = `${collection}_${id}`;
            localStorage.removeItem(chave);

            console.log(`✅ Dados excluídos: ${collection}/${id}`);
            return true;

        } catch (error) {
            console.error('❌ Erro ao excluir:', error);
            return false;
        }
    }

    // 🔄 Sincronizar dados entre Firebase e localStorage
    async sincronizar() {
        if (!this.useFirebase || !this.db) {
            console.log('📱 Modo offline - dados apenas no localStorage');
            return;
        }

        try {
            console.log('🔄 Iniciando sincronização...');

            // Coleções para sincronizar
            const colecoes = ['historico', 'resultados', 'analises', 'configuracoes'];

            for (const colecao of colecoes) {
                await this.sincronizarColecao(colecao);
            }

            console.log('✅ Sincronização concluída');

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
        }
    }

    // 🔄 Sincronizar uma coleção específica
    async sincronizarColecao(collection) {
        try {
            // Dados do Firebase
            const snapshot = await this.db.collection(collection).get();
            const dadosFirebase = {};
            snapshot.forEach(doc => {
                dadosFirebase[doc.id] = doc.data();
            });

            // Dados do localStorage
            const chavesLocal = Object.keys(localStorage);
            const dadosLocal = {};

            for (const chave of chavesLocal) {
                if (chave.startsWith(`${collection}_`)) {
                    const id = chave.replace(`${collection}_`, '');
                    try {
                        dadosLocal[id] = JSON.parse(localStorage.getItem(chave));
                    } catch (e) {
                        console.warn(`Erro ao processar ${chave}:`, e);
                    }
                }
            }

            // Sincronizar diferenças
            for (const [id, dados] of Object.entries(dadosLocal)) {
                if (!dadosFirebase[id] || dadosLocal[id].timestamp > dadosFirebase[id].timestamp) {
                    await this.db.collection(collection).doc(id).set(dados);
                    console.log(`⬆️ Upload: ${collection}/${id}`);
                }
            }

            for (const [id, dados] of Object.entries(dadosFirebase)) {
                if (!dadosLocal[id] || dadosFirebase[id].timestamp > dadosLocal[id].timestamp) {
                    const chave = `${collection}_${id}`;
                    localStorage.setItem(chave, JSON.stringify(dados));
                    console.log(`⬇️ Download: ${collection}/${id}`);
                }
            }

        } catch (error) {
            console.error(`❌ Erro ao sincronizar ${collection}:`, error);
        }
    }

    // 🧹 Limpar dados antigos
    async limparDadosAntigos(diasVencimento = 30) {
        const agora = Date.now();
        const vencimento = diasVencimento * 24 * 60 * 60 * 1000;

        try {
            // Limpar localStorage
            const chaves = Object.keys(localStorage);
            for (const chave of chaves) {
                if (chave.includes('lotofacil') || chave.includes('estrategia')) {
                    try {
                        const dados = JSON.parse(localStorage.getItem(chave));
                        if (dados.timestamp && (agora - dados.timestamp) > vencimento) {
                            localStorage.removeItem(chave);
                            console.log(`🗑️ Removido localStorage: ${chave}`);
                        }
                    } catch (e) {
                        // Se não conseguir parsear, provavelmente é antigo
                        localStorage.removeItem(chave);
                    }
                }
            }

            console.log('✅ Limpeza concluída');

        } catch (error) {
            console.error('❌ Erro na limpeza:', error);
        }
    }

    // 📊 Status da conexão
    getStatus() {
        return {
            firebase: this.useFirebase,
            localStorage: typeof(Storage) !== "undefined",
            timestamp: Date.now()
        };
    }
}

// 🎯 Gerenciador de Estratégias Unificado
class StrategyManager {
    constructor(dbManager) {
        this.db = dbManager;
        this.cache = new Map();
    }

    // 💾 Salvar jogo gerado
    async salvarJogo(estrategiaId, jogos, metadados = {}) {
        const id = `${estrategiaId}_${Date.now()}`;
        const dados = {
            estrategiaId,
            jogos,
            metadados,
            timestamp: Date.now(),
            usuario: 'default'
        };

        return await this.db.salvar('jogos_gerados', id, dados);
    }

    // 📖 Carregar histórico de jogos
    async carregarHistorico(estrategiaId = null) {
        const jogos = await this.db.listar('jogos_gerados');
        
        if (estrategiaId) {
            return jogos.filter(jogo => jogo.estrategiaId === estrategiaId);
        }
        
        return jogos;
    }

    // 📊 Estatísticas de uso
    async obterEstatisticas() {
        const jogos = await this.db.listar('jogos_gerados');
        const estatisticas = {
            totalJogos: jogos.length,
            estrategiasMaisUsadas: {},
            ultimaAtividade: null
        };

        for (const jogo of jogos) {
            if (!estatisticas.estrategiasMaisUsadas[jogo.estrategiaId]) {
                estatisticas.estrategiasMaisUsadas[jogo.estrategiaId] = 0;
            }
            estatisticas.estrategiasMaisUsadas[jogo.estrategiaId]++;

            if (!estatisticas.ultimaAtividade || jogo.timestamp > estatisticas.ultimaAtividade) {
                estatisticas.ultimaAtividade = jogo.timestamp;
            }
        }

        return estatisticas;
    }
}

// 🌐 Exportar para uso global
window.DatabaseManager = DatabaseManager;
window.StrategyManager = StrategyManager;