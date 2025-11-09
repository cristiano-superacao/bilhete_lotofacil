// Service Worker para LotoFácil Estratégica
// Versão: 2.1.1 - Sistema automático de cache-busting

const APP_VERSION = '2.1.1';
const CACHE_NAME = `lotofacil-estrategica-v${APP_VERSION}`;
const STATIC_CACHE = `static-v${APP_VERSION}`;
const API_CACHE = `api-v${APP_VERSION}`;

// Arquivos essenciais para cache
const ESSENTIAL_FILES = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/app.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// URLs da API para cache
const API_URLS = [
    'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        Promise.all([
            // Cache de arquivos estáticos
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Cacheando arquivos essenciais');
                return cache.addAll(ESSENTIAL_FILES);
            }),
            
            // Preparar cache da API
            caches.open(API_CACHE)
        ]).then(() => {
            console.log('Service Worker: Instalação concluída');
            // Forçar ativação imediata
            return self.skipWaiting();
        }).catch(error => {
            console.error('Service Worker: Erro na instalação:', error);
        })
    );
});

// Ativar Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        // Limpar caches antigos
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
                        console.log('Service Worker: Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Ativação concluída');
            // Assumir controle de todas as páginas
            return self.clients.claim();
        })
    );
});

// Interceptar requisições
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    
    // Estratégia para diferentes tipos de requisição
    if (isStaticAsset(event.request.url)) {
        // Cache First para recursos estáticos
        event.respondWith(cacheFirst(event.request));
    } else if (isAPIRequest(event.request.url)) {
        // Network First com fallback para API
        event.respondWith(networkFirst(event.request));
    } else {
        // Stale While Revalidate para páginas
        event.respondWith(staleWhileRevalidate(event.request));
    }
});

// Verificar se é um recurso estático
function isStaticAsset(url) {
    return url.includes('.css') || 
           url.includes('.js') || 
           url.includes('.png') || 
           url.includes('.jpg') || 
           url.includes('.ico') ||
           url.includes('tailwindcss.com') ||
           url.includes('cdnjs.cloudflare.com') ||
           url.includes('chart.js');
}

// Verificar se é uma requisição da API
function isAPIRequest(url) {
    return API_URLS.some(apiUrl => url.includes(apiUrl));
}

// Estratégia Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Cache da resposta se foi bem-sucedida
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('Service Worker: Cache First falhou para:', request.url);
        // Retornar página offline ou recurso placeholder se disponível
        return new Response('Recurso não disponível offline', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Estratégia Network First
async function networkFirst(request) {
    const cache = await caches.open(API_CACHE);
    
    try {
        // Tentar rede primeiro
        const networkResponse = await fetch(request, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (networkResponse.ok) {
            // Cache apenas por 5 minutos para dados da API
            const responseToCache = networkResponse.clone();
            const headers = new Headers(responseToCache.headers);
            headers.set('sw-cached-at', Date.now().toString());
            
            const cachedResponse = new Response(responseToCache.body, {
                status: responseToCache.status,
                statusText: responseToCache.statusText,
                headers: headers
            });
            
            cache.put(request, cachedResponse);
        }
        
        return networkResponse;
    } catch (error) {
        console.warn('Service Worker: Rede falhou, tentando cache para:', request.url);
        
        // Tentar cache como fallback
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            // Verificar se cache não está muito antigo (5 minutos)
            const cachedAt = cachedResponse.headers.get('sw-cached-at');
            if (cachedAt) {
                const cacheAge = Date.now() - parseInt(cachedAt);
                if (cacheAge < 5 * 60 * 1000) { // 5 minutos
                    console.log('Service Worker: Usando dados em cache para API');
                    return cachedResponse;
                }
            }
        }
        
        // Se não há cache válido, retornar erro
        return new Response(JSON.stringify({
            error: 'API indisponível',
            message: 'Não foi possível conectar com a API da Caixa'
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Fetch da rede em paralelo
    const networkResponsePromise = fetch(request).then(response => {
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(error => {
        console.warn('Service Worker: Rede falhou para:', request.url);
        return null;
    });
    
    // Retornar cache imediatamente se disponível, senão aguardar rede
    return cachedResponse || networkResponsePromise || new Response('Página não disponível', {
        status: 404,
        statusText: 'Not Found'
    });
}

// Escutar mensagens do cliente
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_CACHE_STATUS') {
        caches.keys().then(cacheNames => {
            event.ports[0].postMessage({
                caches: cacheNames,
                version: CACHE_NAME
            });
        });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Sincronização em background (para atualizações futuras)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Tentar atualizar dados da API quando conexão for restaurada
        console.log('Service Worker: Executando sincronização em background');
        
        for (const apiUrl of API_URLS) {
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const cache = await caches.open(API_CACHE);
                    cache.put(apiUrl, response.clone());
                }
            } catch (error) {
                console.warn('Service Worker: Erro na sincronização para:', apiUrl);
            }
        }
    } catch (error) {
        console.error('Service Worker: Erro na sincronização em background:', error);
    }
}

// Log de instalação para debugging
console.log('Service Worker: Script carregado');