// 🔥 Configuração Firebase - LotoFácil Estratégica v2.1.0
// Para ativar o Firebase, substitua as credenciais abaixo pelas suas

const FIREBASE_CONFIG = {
    // 🔧 Configurações do seu projeto Firebase
    apiKey: "sua-api-key-aqui",
    authDomain: "seu-projeto.firebaseapp.com", 
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// 🎯 Como configurar Firebase:
// 1. Acesse https://console.firebase.google.com/
// 2. Crie um novo projeto ou use um existente
// 3. Ative o Firestore Database
// 4. No menu "Configurações do projeto", encontre "Configuração do SDK"
// 5. Copie os valores e substitua acima
// 6. Configure as regras de segurança do Firestore:

/*
Regras recomendadas para Firestore:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso aos dados do LotoFácil
    match /jogos_gerados/{document} {
      allow read, write: if true; // Para testes - use autenticação em produção
    }
    
    match /historico/{document} {
      allow read, write: if true; // Para testes - use autenticação em produção
    }
    
    match /resultados/{document} {
      allow read, write: if true; // Para testes - use autenticação em produção
    }
    
    match /analises/{document} {
      allow read, write: if true; // Para testes - use autenticação em produção
    }
    
    match /configuracoes/{document} {
      allow read, write: if true; // Para testes - use autenticação em produção
    }
  }
}
*/

// 🌐 Exportar configuração
window.FIREBASE_CONFIG = FIREBASE_CONFIG;