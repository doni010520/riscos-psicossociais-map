# 🚀 SETUP RÁPIDO - Riscos Psicossociais MAP

## 1️⃣ EXECUTAR NO SUPABASE (SQL Editor)

Abra o SQL Editor no Supabase e execute todo o conteúdo de:
```
supabase-schema.sql
```

Isso irá criar:
- ✅ Tabelas (responses, admin_users, access_log)
- ✅ Índices otimizados
- ✅ Views para relatórios
- ✅ Functions para análise
- ✅ Row Level Security (RLS)
- ✅ Admin inicial (email: admin@map.com.br, senha: Admin@123)

## 2️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

As credenciais do Supabase JÁ ESTÃO configuradas no `.env.example`!

## 3️⃣ SUBIR NO GITHUB

```bash
git init
git add .
git commit -m "Initial commit: Riscos Psicossociais MAP"
git remote add origin https://github.com/SEU-USUARIO/riscos-psicossociais-map.git
git push -u origin main
```

## 4️⃣ DEPLOY NO EASYPANEL

1. No Easypanel, clique em "New Service"
2. Escolha "Deploy from Git Repository"
3. Conecte seu repositório GitHub
4. O Easypanel detecta automaticamente o `docker-compose.yml`
5. Configure as variáveis de ambiente (copie do .env)
6. Deploy!

## 5️⃣ ACESSAR A APLICAÇÃO

### Formulário (Público):
```
https://seu-dominio.com/formulario
```

### Dashboard Admin:
```
https://seu-dominio.com/admin/dashboard
```

**Credenciais iniciais:**
- Email: admin@map.com.br
- Senha: Admin@123
- ⚠️ TROCAR NO PRIMEIRO ACESSO!

## 📦 ESTRUTURA CRIADA

```
riscos-psicossociais-map/
├── frontend/              ✅ Next.js 15
│   ├── src/
│   │   ├── app/          
│   │   ├── components/   
│   │   ├── lib/          
│   │   └── types/        
│   ├── Dockerfile        ✅
│   └── package.json      ✅
│
├── backend/              ✅ FastAPI
│   ├── app/
│   │   └── main.py       ✅
│   ├── Dockerfile        ✅
│   └── requirements.txt  ✅
│
├── supabase-schema.sql   ✅ Schema completo
├── docker-compose.yml    ✅ Configuração Docker
├── .env.example          ✅ Variáveis configuradas
└── README.md             ✅ Documentação completa
```

## 🔧 PRÓXIMOS PASSOS PARA DESENVOLVER

### Frontend (precisa completar):
1. Componentes do formulário (35 perguntas)
2. Página de agradecimento
3. Dashboard administrativo
4. Autenticação admin

### Backend (precisa completar):
1. Endpoints da API (form, admin, reports)
2. Middleware de IP detection
3. Sistema de autenticação JWT
4. Exportação de dados

## 💡 DICA

Os tipos TypeScript, schema SQL e estrutura básica estão COMPLETOS!
O que falta é implementar os componentes React e os endpoints da API.

Quer que eu continue desenvolvendo alguma parte específica?
