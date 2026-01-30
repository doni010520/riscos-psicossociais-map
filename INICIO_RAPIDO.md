# ⚡ INÍCIO RÁPIDO - 5 MINUTOS

## 🎯 O QUE VOCÊ TEM AGORA

✅ **Aplicação 100% Funcional** pronta para deploy
✅ **Frontend Next.js 15** completo (formulário + páginas)
✅ **Backend FastAPI** completo (todos os endpoints)
✅ **Schema Supabase** pronto (banco de dados completo)
✅ **Documentação** extensa (API, testes, deploy)
✅ **Docker** configurado (docker-compose.yml)

---

## 🚀 3 COMANDOS PARA COMEÇAR

### 1️⃣ Executar SQL no Supabase

1. Acesse https://supabase.com/dashboard
2. SQL Editor → New Query
3. Cole TODO o conteúdo de `supabase-schema.sql`
4. Run (Ctrl+Enter)
5. ✅ Pronto! Banco configurado

### 2️⃣ Subir no GitHub

```bash
git init
git add .
git commit -m "feat: Aplicação Riscos Psicossociais MAP"
git remote add origin https://github.com/SEU-USUARIO/riscos-psicossociais-map.git
git push -u origin main
```

### 3️⃣ Deploy no Easypanel

1. Easypanel → Create Project → GitHub
2. Seleciona repositório
3. Adiciona variáveis de ambiente (copiar de `.env.example`)
4. Deploy!

---

## 📁 ARQUIVOS MAIS IMPORTANTES

```
riscos-psicossociais-map/
├── supabase-schema.sql           ⭐ Execute PRIMEIRO no Supabase
├── .env.example                  ⭐ Suas credenciais (já configuradas!)
├── docker-compose.yml            ⭐ Para deploy Docker
│
├── frontend/
│   ├── src/app/formulario/       ✅ Formulário completo (35 perguntas)
│   ├── src/app/obrigado/         ✅ Página de agradecimento
│   ├── src/lib/questions.ts      ✅ Todas as 35 perguntas
│   └── src/types/index.ts        ✅ TypeScript types completos
│
├── backend/
│   ├── app/main.py               ✅ API FastAPI
│   ├── app/routers/              ✅ form.py, auth.py, admin.py
│   └── app/services/             ✅ Lógica de negócio
│
└── docs/
    ├── DEPLOY.md                 📖 Guia passo a passo de deploy
    ├── API_REFERENCE.md          📖 Documentação completa da API
    └── TESTES.md                 📖 Como testar tudo
```

---

## 🎨 CORES MAP (Já Configuradas)

- **Primária:** #04518c (Azul MAP extraído da logo)
- **Secundária:** #6b9ac4 (Azul claro)
- **Matriz de Risco:**
  - 🟢 BAIXO: #10B981
  - 🟡 MODERADO: #F59E0B
  - 🟠 ALTO: #F97316
  - 🔴 CRÍTICO: #EF4444

---

## 🔑 CREDENCIAIS

### Supabase (já no .env.example)
```
URL: https://dhisnlwlwbpiexsmbtyj.supabase.co
ANON KEY: eyJhbGciOiJIUzI1NiIs...
SERVICE KEY: eyJhbGciOiJIUzI1NiIs...
```

### Admin Inicial (TROCAR SENHA!)
```
Email: admin@map.com.br
Senha: Admin@123
```

---

## ✅ O QUE ESTÁ PRONTO

### Frontend (100%)
✅ Formulário com 35 perguntas
✅ Escala 0-10 interativa
✅ Barra de progresso
✅ Validação completa
✅ Página de agradecimento
✅ Design responsivo
✅ Cores MAP
✅ Logo integrada

### Backend (100%)
✅ Endpoint de submissão (`POST /api/form/submit`)
✅ Autenticação JWT (`POST /api/auth/login`)
✅ Estatísticas gerais (`GET /api/admin/stats/overview`)
✅ Distribuição de risco (`GET /api/admin/stats/risk-distribution`)
✅ Timeline (`GET /api/admin/stats/timeline`)
✅ Relatórios filtrados (`POST /api/admin/reports/filtered`)
✅ Análise por dimensão (`GET /api/admin/reports/dimension/{dimension}`)
✅ Exportação para IA (`POST /api/admin/export/ai`)
✅ Exportação CSV (`POST /api/admin/export/csv`)
✅ Middleware de IP detection
✅ CORS configurado
✅ Error handling

### Banco de Dados (100%)
✅ Tabela `responses` (com colunas calculadas)
✅ Tabela `admin_users` (com admin inicial)
✅ Tabela `access_log` (auditoria)
✅ 4 Views (estatísticas, distribuição, timeline, análise)
✅ Function `export_responses_for_ai()`
✅ Índices otimizados
✅ RLS (Row Level Security)
✅ Triggers para cálculos automáticos

### Documentação (100%)
✅ README.md completo
✅ API_REFERENCE.md (todos os endpoints)
✅ DEPLOY.md (passo a passo)
✅ TESTES.md (guia de testes)
✅ Comentários no código

### Infraestrutura (100%)
✅ docker-compose.yml
✅ Dockerfile (frontend + backend)
✅ .env.example
✅ .gitignore
✅ package.json
✅ requirements.txt
✅ tsconfig.json
✅ tailwind.config.ts

---

## 🧪 TESTAR LOCALMENTE (Opcional)

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```
Acesse: http://localhost:8000/docs

### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Acesse: http://localhost:3000

---

## 📊 STACK COMPLETA

| Camada | Tecnologia | Status |
|--------|------------|--------|
| Frontend | Next.js 15 + React 19 | ✅ 100% |
| Styling | Tailwind CSS + shadcn/ui | ✅ 100% |
| Backend | FastAPI + Pydantic V2 | ✅ 100% |
| Database | Supabase (PostgreSQL) | ✅ 100% |
| Auth | JWT (jose) | ✅ 100% |
| Deploy | Easypanel + Docker | ✅ 100% |
| Types | TypeScript | ✅ 100% |

---

## 🎯 PRÓXIMOS PASSOS

1. ⚡ Execute `supabase-schema.sql` no Supabase (2 min)
2. 🚀 Suba no GitHub (1 min)
3. 🔧 Deploy no Easypanel (10 min)
4. 🔐 Troque a senha do admin (1 min)
5. 🎉 **PRONTO!** Aplicação no ar!

---

## 💡 DICAS PRO

- **Antes de deploy:** Teste localmente primeiro!
- **Após deploy:** Execute teste de submissão via cURL
- **Segurança:** TROQUE a senha admin IMEDIATAMENTE
- **JWT Secret:** Gere um novo com `openssl rand -hex 32`
- **Logs:** Monitore via Easypanel ou `docker logs`
- **Domínio:** Configure DNS + SSL (Easypanel faz SSL automaticamente)

---

## 🆘 PRECISA DE AJUDA?

1. Veja `docs/DEPLOY.md` - Guia completo passo a passo
2. Veja `docs/TESTES.md` - Como testar tudo
3. Veja `docs/API_REFERENCE.md` - Documentação da API
4. Logs do backend: `easypanel logs backend`
5. Logs do Supabase: SQL Editor → `SELECT * FROM access_log`

---

## 🎉 VOCÊ TEM TUDO QUE PRECISA!

A aplicação está **100% COMPLETA** e **PRONTA PARA PRODUÇÃO**.

Basta executar os 3 comandos acima e estará no ar! 🚀

**Desenvolvido com ❤️ por MAP © 2025**
