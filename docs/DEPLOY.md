# 🚀 DEPLOY COMPLETO - Riscos Psicossociais MAP

## 📋 PRÉ-REQUISITOS

- ✅ Conta Supabase (já configurada)
- ✅ Conta GitHub
- ✅ VPS com Easypanel instalado
- ✅ Domínio configurado (opcional, mas recomendado)

---

## PASSO 1: CONFIGURAR SUPABASE

### 1.1 Executar Schema SQL

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. Vá em **SQL Editor** (ícone de engrenagem no menu lateral)
3. Clique em **New Query**
4. Cole todo o conteúdo do arquivo `supabase-schema.sql`
5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Aguarde completar (deve levar ~10 segundos)

✅ **Verificação:** Execute `SELECT * FROM admin_users;` - deve retornar 1 registro (admin inicial)

### 1.2 Confirmar Credenciais

No Supabase, vá em **Settings → API**:

- **Project URL:** `https://dhisnlwlwbpiexsmbtyj.supabase.co` ✅
- **anon key:** `eyJhbGciOiJIUzI1NiIs...` ✅
- **service_role key:** `eyJhbGciOiJIUzI1NiIs...` ✅

Essas credenciais já estão no `.env.example`!

---

## PASSO 2: PREPARAR O CÓDIGO

### 2.1 Extrair o Projeto

```bash
tar -xzf riscos-psicossociais-map.tar.gz
cd riscos-psicossociais-map
```

### 2.2 Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar (opcional - as credenciais já estão corretas)
nano .env
```

**Importante:** Gere um JWT_SECRET único:

```bash
# Linux/Mac
openssl rand -hex 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Cole o resultado em `.env` na linha `JWT_SECRET=...`

### 2.3 Testar Localmente (Opcional mas Recomendado)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
# Acesse: http://localhost:8000/docs

# Frontend (nova janela do terminal)
cd frontend
npm install
npm run dev
# Acesse: http://localhost:3000
```

**Teste:** Preencha o formulário e veja se salva no Supabase!

---

## PASSO 3: SUBIR PARA O GITHUB

### 3.1 Criar Repositório

1. Acesse https://github.com/new
2. Nome: `riscos-psicossociais-map`
3. Privado: ✅ (Recomendado)
4. **NÃO** inicialize com README (já temos)
5. Crie o repositório

### 3.2 Push do Código

```bash
cd riscos-psicossociais-map

# Inicializar Git
git init
git add .
git commit -m "feat: Aplicação completa Riscos Psicossociais MAP"

# Conectar ao GitHub (substitua SEU-USUARIO)
git remote add origin https://github.com/SEU-USUARIO/riscos-psicossociais-map.git
git branch -M main
git push -u origin main
```

✅ **Verificação:** Acesse o repo no GitHub e confirme que todos os arquivos foram enviados

---

## PASSO 4: DEPLOY NO EASYPANEL

### 4.1 Acessar Easypanel

1. Acesse seu Easypanel: `https://seu-vps-ip:3000`
2. Faça login

### 4.2 Criar Novo Projeto

1. Clique em **+ Create Project**
2. Nome: `riscos-psicossociais-map`
3. Clique em **Create**

### 4.3 Adicionar Serviço do GitHub

1. Dentro do projeto, clique em **+ Add Service**
2. Escolha **GitHub**
3. Conecte sua conta GitHub (se ainda não conectou)
4. Selecione o repositório `riscos-psicossociais-map`
5. Branch: `main`

### 4.4 Configurar Frontend

1. Service Name: `frontend`
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Port: `3000`
5. Working Directory: `/frontend`
6. **Environment Variables:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
   NEXT_PUBLIC_SUPABASE_URL=https://dhisnlwlwbpiexsmbtyj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

### 4.5 Configurar Backend

1. Clique em **+ Add Service** novamente
2. Service Name: `backend`
3. Build Command: (deixe vazio)
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
5. Port: `8000`
6. Working Directory: `/backend`
7. **Environment Variables:**
   ```
   PYTHON_ENV=production
   SUPABASE_URL=https://dhisnlwlwbpiexsmbtyj.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
   JWT_SECRET=seu-jwt-secret-gerado-no-passo-2.2
   JWT_ALGORITHM=HS256
   JWT_EXPIRATION_HOURS=24
   CORS_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
   ```

### 4.6 Deploy

1. Clique em **Deploy** em cada serviço
2. Aguarde o build completar (~5-10 minutos)
3. Verifique os logs para confirmar que está rodando

✅ **Verificação:**
- Backend: Acesse `https://backend.seu-projeto.easypanel.host/health`
- Frontend: Acesse `https://frontend.seu-projeto.easypanel.host`

---

## PASSO 5: CONFIGURAR DOMÍNIO (Opcional)

### 5.1 Configurar DNS

No seu provedor de domínio (Registro.br, Cloudflare, etc):

```
# A Records
@       A       SEU_IP_VPS
www     A       SEU_IP_VPS
api     A       SEU_IP_VPS

# Ou CNAME (se Easypanel fornecer)
@       CNAME   seu-projeto.easypanel.host
www     CNAME   seu-projeto.easypanel.host
api     CNAME   backend.seu-projeto.easypanel.host
```

### 5.2 Configurar SSL (Easypanel faz automaticamente)

1. No Easypanel, vá em cada serviço
2. Clique em **Domains**
3. Adicione seu domínio (ex: `formulario.map.com.br`)
4. Easypanel vai gerar certificado SSL via Let's Encrypt automaticamente

---

## PASSO 6: TESTES PÓS-DEPLOY

### 6.1 Testar Formulário

```bash
# Submeter formulário de teste
curl -X POST https://api.seu-dominio.com/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "demandas": [5, 6, 4, 7, 5, 6, 7, 8],
      "controle": [3, 4, 5, 4, 3, 4, 5],
      "relacionamento": [2, 1, 2, 3],
      "cargo": [4, 5, 4, 6],
      "mudanca": [5, 6, 5],
      "apoio_chefia": [7, 6, 7, 8, 6],
      "apoio_colegas": [4, 5, 4, 5]
    },
    "completion_time_seconds": 420
  }'
```

✅ Deve retornar `{"id": "...", "message": "Formulário enviado com sucesso!", ...}`

### 6.2 Testar Login Admin

```bash
curl -X POST https://api.seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@map.com.br","password":"Admin@123"}'
```

✅ Deve retornar `{"access_token": "...", ...}`

### 6.3 Verificar no Supabase

1. Acesse Supabase: **Table Editor → responses**
2. Deve ter 1 resposta de teste
3. Verifique que as colunas calculadas (score_*, risk_*) estão preenchidas

---

## PASSO 7: TROCAR SENHA DO ADMIN

⚠️ **IMPORTANTE - FAÇA ISSO IMEDIATAMENTE!**

```bash
# 1. Fazer login
TOKEN=$(curl -X POST https://api.seu-dominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@map.com.br","password":"Admin@123"}' \
  | jq -r '.access_token')

# 2. No Supabase SQL Editor, execute:
```

```sql
UPDATE admin_users 
SET password_hash = crypt('SuaNovaSenhaSegura123!', gen_salt('bf'))
WHERE email = 'admin@map.com.br';
```

Agora faça login com a nova senha!

---

## PASSO 8: MONITORAMENTO

### 8.1 Configurar Alertas (Opcional)

No Easypanel:
1. Vá em cada serviço
2. Configure **Health Checks**
3. Configure **Auto-restart** se falhar

### 8.2 Logs

```bash
# Ver logs do backend no Easypanel
easypanel logs backend -f

# Ou use a interface web:
# Easypanel → Seu Projeto → Backend → Logs
```

---

## ✅ CHECKLIST FINAL

- [ ] Schema SQL executado no Supabase
- [ ] Repositório GitHub criado e código enviado
- [ ] Frontend deployado no Easypanel
- [ ] Backend deployado no Easypanel
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado e SSL ativo
- [ ] Teste de submissão de formulário funcionando
- [ ] Login admin funcionando
- [ ] Senha admin alterada
- [ ] Dashboard acessível

---

## 🎉 PRONTO!

Sua aplicação está no ar!

- **Formulário:** https://seu-dominio.com/formulario
- **Dashboard:** https://seu-dominio.com/admin/dashboard
- **API Docs:** https://api.seu-dominio.com/docs

---

## 🆘 TROUBLESHOOTING

### Erro "CORS"
- Verifique `CORS_ORIGINS` no backend
- Adicione seu domínio completo (com https://)

### Erro 500 no Backend
- Verifique logs: `easypanel logs backend`
- Confirme que Supabase credentials estão corretas

### Frontend não conecta ao Backend
- Verifique `NEXT_PUBLIC_API_URL` no frontend
- Deve ser a URL pública do backend (não localhost!)

### Banco de dados vazio
- Execute o `supabase-schema.sql` novamente
- Verifique que está no projeto correto do Supabase

---

**Dúvidas?** Verifique os logs e a documentação em `/docs`!

**Desenvolvido por MAP © 2025**
