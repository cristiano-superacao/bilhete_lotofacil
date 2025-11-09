/**
 * API Manager - LotoFácil Estratégica
 * 
 * Gerencia as chamadas para APIs de sorteios com sistema de fallback:
 * 1. Tenta API interna (Netlify Functions + Neon DB) - RÁPIDO
 * 2. Se falhar, usa API da Caixa como backup - CONFIÁVEL
 * 
 * Totalmente transparente para o usuário.
 */

class APIManager {
    constructor() {
        // Detectar se está em produção (Netlify) ou desenvolvimento (localhost)
        this.isProduction = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1';
        
        // URLs base
        this.internalAPI = this.isProduction 
            ? '/api' 
            : 'http://localhost:8888/api'; // Netlify Dev
        
        this.caixaAPI = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil';
        
        // Configurações
        this.timeout = 10000; // 10 segundos
        this.useInternalFirst = true; // Prioridade para API interna
        
        // Estatísticas (para debug)
        this.stats = {
            internalSuccess: 0,
            internalFail: 0,
            caixaSuccess: 0,
            caixaFail: 0
        };
    }

    /**
     * Busca o último concurso disponível
     */
    async buscarUltimoConcurso() {
        console.log('🔍 Buscando último concurso...');
        
        if (this.useInternalFirst) {
            try {
                const resultado = await this._buscarUltimoInternoComTimeout();
                if (resultado) {
                    console.log('✅ Último concurso obtido da API interna');
                    this.stats.internalSuccess++;
                    return this._formatarParaPadraoApp(resultado);
                }
            } catch (error) {
                console.warn('⚠️ API interna falhou, tentando API da Caixa...', error.message);
                this.stats.internalFail++;
            }
        }
        
        // Fallback: API da Caixa
        return await this._buscarUltimoCaixa();
    }

    /**
     * Busca um concurso específico pelo número
     */
    async buscarConcursoEspecifico(numeroConcurso) {
        console.log(`🔍 Buscando concurso ${numeroConcurso}...`);
        
        if (this.useInternalFirst) {
            try {
                const resultado = await this._buscarConcursoInternoComTimeout(numeroConcurso);
                if (resultado) {
                    console.log(`✅ Concurso ${numeroConcurso} obtido da API interna`);
                    this.stats.internalSuccess++;
                    return this._formatarParaPadraoApp(resultado);
                }
            } catch (error) {
                console.warn(`⚠️ API interna falhou para concurso ${numeroConcurso}, tentando Caixa...`);
                this.stats.internalFail++;
            }
        }
        
        // Fallback: API da Caixa
        return await this._buscarConcursoCaixa(numeroConcurso);
    }

    /**
     * Busca múltiplos concursos (para estatísticas)
     */
    async buscarUltimosConcursos(quantidade = 50) {
        console.log(`🔍 Buscando últimos ${quantidade} concursos...`);
        
        if (this.useInternalFirst) {
            try {
                const url = `${this.internalAPI}/sorteios?limite=${quantidade}`;
                const response = await this._fetchComTimeout(url);
                
                if (response.ok) {
                    const json = await response.json();
                    if (json.success && json.data) {
                        console.log(`✅ ${json.data.length} concursos obtidos da API interna`);
                        this.stats.internalSuccess++;
                        return json.data.map(s => this._formatarParaPadraoApp(s));
                    }
                }
            } catch (error) {
                console.warn('⚠️ API interna falhou para múltiplos concursos');
                this.stats.internalFail++;
            }
        }
        
        // Fallback: buscar um por um da Caixa (mais lento)
        console.log('⚠️ Fallback: buscando da API da Caixa (pode ser lento)...');
        return await this._buscarMultiplosCaixa(quantidade);
    }

    /**
     * Busca concursos por período
     */
    async buscarPorPeriodo(tipo, params = {}) {
        console.log(`🔍 Buscando concursos por período: ${tipo}`);
        
        if (this.useInternalFirst) {
            try {
                let url = `${this.internalAPI}/sorteios/periodo?tipo=${tipo}`;
                
                if (params.mes) url += `&mes=${params.mes}`;
                if (params.ano) url += `&ano=${params.ano}`;
                if (params.data) url += `&data=${params.data}`;
                
                const response = await this._fetchComTimeout(url);
                
                if (response.ok) {
                    const json = await response.json();
                    if (json.success && json.data) {
                        console.log(`✅ ${json.data.length} concursos obtidos (período: ${tipo})`);
                        this.stats.internalSuccess++;
                        return json.data.map(s => this._formatarParaPadraoApp(s));
                    }
                }
            } catch (error) {
                console.warn(`⚠️ API interna falhou para período ${tipo}`);
                this.stats.internalFail++;
            }
        }
        
        // Para período, não tem fallback direto na API da Caixa
        console.warn('⚠️ Filtro por período só disponível com API interna');
        return [];
    }

    // ========== MÉTODOS PRIVADOS - API INTERNA ==========

    async _buscarUltimoInternoComTimeout() {
        const url = `${this.internalAPI}/sorteios?limite=1`;
        const response = await this._fetchComTimeout(url);
        
        if (response.ok) {
            const json = await response.json();
            return json.success && json.data[0] ? json.data[0] : null;
        }
        
        throw new Error('API interna não retornou dados');
    }

    async _buscarConcursoInternoComTimeout(numero) {
        const url = `${this.internalAPI}/sorteios/${numero}`;
        const response = await this._fetchComTimeout(url);
        
        if (response.ok) {
            const json = await response.json();
            return json.success && json.data ? json.data : null;
        }
        
        throw new Error('Concurso não encontrado na API interna');
    }

    // ========== MÉTODOS PRIVADOS - API CAIXA ==========

    async _buscarUltimoCaixa() {
        try {
            const response = await fetch(this.caixaAPI);
            if (response.ok) {
                const dados = await response.json();
                console.log('✅ Último concurso obtido da API da Caixa');
                this.stats.caixaSuccess++;
                return dados;
            }
        } catch (error) {
            console.error('❌ Erro ao buscar da API da Caixa:', error);
            this.stats.caixaFail++;
        }
        
        return null;
    }

    async _buscarConcursoCaixa(numero) {
        try {
            const response = await fetch(`${this.caixaAPI}/${numero}`);
            if (response.ok) {
                const dados = await response.json();
                console.log(`✅ Concurso ${numero} obtido da API da Caixa`);
                this.stats.caixaSuccess++;
                return dados;
            }
        } catch (error) {
            console.error(`❌ Erro ao buscar concurso ${numero} da Caixa:`, error);
            this.stats.caixaFail++;
        }
        
        return null;
    }

    async _buscarMultiplosCaixa(quantidade) {
        const resultados = [];
        
        try {
            // Buscar o último para saber o número
            const ultimo = await this._buscarUltimoCaixa();
            if (!ultimo) return resultados;
            
            const numeroInicial = ultimo.numero - quantidade + 1;
            
            // Buscar um por um (limitado para não sobrecarregar)
            for (let i = 0; i < Math.min(quantidade, 20); i++) {
                const numero = numeroInicial + i;
                const concurso = await this._buscarConcursoCaixa(numero);
                if (concurso) resultados.push(concurso);
                
                // Pequeno delay para não sobrecarregar a API
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error('❌ Erro ao buscar múltiplos concursos da Caixa:', error);
        }
        
        return resultados;
    }

    // ========== UTILITÁRIOS ==========

    async _fetchComTimeout(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Timeout: API demorou demais para responder');
            }
            throw error;
        }
    }

    /**
     * Converte formato da API interna para o formato esperado pelo app
     */
    _formatarParaPadraoApp(sorteio) {
        // Se já está no formato da Caixa, retorna como está
        if (sorteio.numero) return sorteio;
        
        // Converter formato interno para formato Caixa
        return {
            numero: sorteio.concurso,
            dataApuracao: sorteio.data_formatada || sorteio.data_sorteio,
            dezenas: sorteio.dezenas,
            // Adicionar outros campos se necessário
        };
    }

    /**
     * Retorna estatísticas de uso das APIs
     */
    getStats() {
        const total = this.stats.internalSuccess + this.stats.internalFail + 
                     this.stats.caixaSuccess + this.stats.caixaFail;
        
        return {
            ...this.stats,
            total,
            internalRate: total > 0 ? (this.stats.internalSuccess / total * 100).toFixed(1) : 0,
            caixaRate: total > 0 ? (this.stats.caixaSuccess / total * 100).toFixed(1) : 0
        };
    }

    /**
     * Exibe estatísticas no console
     */
    mostrarStats() {
        const stats = this.getStats();
        console.log('📊 ESTATÍSTICAS DE API:');
        console.log(`   API Interna: ${stats.internalSuccess} ✅ | ${stats.internalFail} ❌ (${stats.internalRate}%)`);
        console.log(`   API Caixa:   ${stats.caixaSuccess} ✅ | ${stats.caixaFail} ❌ (${stats.caixaRate}%)`);
        console.log(`   Total de requisições: ${stats.total}`);
    }
}

// Exportar instância única (singleton)
export const apiManager = new APIManager();
