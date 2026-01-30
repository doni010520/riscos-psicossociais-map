# 🧪 GUIA DE TESTES - Riscos Psicossociais MAP

## 🚀 TESTES LOCAIS RÁPIDOS

### 1️⃣ Testar Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:3000`

**Testes manuais:**
- ✅ Abrir formulário
- ✅ Responder todas as 35 perguntas
- ✅ Verificar barra de progresso
- ✅ Submeter formulário
- ✅ Ver página de agradecimento

---

### 2️⃣ Testar Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Acesse: `http://localhost:8000/docs`

**Testes automáticos via Swagger:**
1. `/health` - Verificar saúde da API
2. `/api/form/submit` - Submeter resposta de teste
3. `/api/auth/login` - Login com `admin@map.com.br` / `Admin@123`
4. `/api/admin/stats/overview` - Ver estatísticas (usar token)

---

## 🔍 TESTES COM cURL

### Submeter Formulário

```bash
curl -X POST http://localhost:8000/api/form/submit \
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

### Login Admin

```bash
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@map.com.br","password":"Admin@123"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"
```

### Obter Estatísticas

```bash
curl -X GET http://localhost:8000/api/admin/stats/overview \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 TESTE DE CARGA (Opcional)

### Usando Apache Bench (ab)

```bash
# 100 requisições, 10 concorrentes
ab -n 100 -c 10 -p test_data.json -T application/json \
  http://localhost:8000/api/form/submit
```

### Usando Locust (Python)

```python
# locustfile.py
from locust import HttpUser, task, between

class FormUser(HttpUser):
    wait_time = between(1, 3)
    
    @task
    def submit_form(self):
        self.client.post("/api/form/submit", json={
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
        })
```

```bash
locust -f locustfile.py --host=http://localhost:8000
```

---

## ✅ CHECKLIST DE TESTES

### Frontend
- [ ] Formulário renderiza corretamente
- [ ] Todas as 35 perguntas aparecem
- [ ] Escala 0-10 funciona em cada pergunta
- [ ] Barra de progresso atualiza
- [ ] Não permite enviar sem responder tudo
- [ ] Envia com sucesso
- [ ] Página de agradecimento aparece
- [ ] Responsivo em mobile

### Backend
- [ ] `/health` retorna 200
- [ ] `/api/form/submit` aceita dados válidos
- [ ] `/api/form/submit` rejeita dados inválidos
- [ ] `/api/auth/login` retorna token JWT
- [ ] `/api/auth/login` rejeita credenciais erradas
- [ ] `/api/admin/*` requer autenticação
- [ ] Estatísticas calculadas corretamente
- [ ] Exportação CSV funciona
- [ ] Exportação para IA funciona

### Banco de Dados (Supabase)
- [ ] Schema criado sem erros
- [ ] Tabelas criadas (responses, admin_users, access_log)
- [ ] Views funcionando (stats_overview, risk_distribution)
- [ ] RLS ativo e funcionando
- [ ] Admin inicial criado
- [ ] Colunas calculadas (scores, risks) funcionando

### Integração
- [ ] Frontend conecta ao backend
- [ ] Backend conecta ao Supabase
- [ ] Autenticação JWT funciona end-to-end
- [ ] Submissão de formulário persiste no banco
- [ ] Dashboard carrega dados reais

---

## 🐛 DEBUGGING

### Logs do Backend

```bash
# Ver logs em tempo real
uvicorn app.main:app --reload --log-level debug
```

### Logs do Supabase

```sql
-- Ver últimas submissões
SELECT * FROM responses ORDER BY submitted_at DESC LIMIT 10;

-- Ver estatísticas gerais
SELECT * FROM stats_overview;

-- Ver logs de acesso
SELECT * FROM access_log ORDER BY timestamp DESC LIMIT 20;
```

### Inspecionar Token JWT

```bash
# Decodificar JWT (sem validar)
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq
```

---

## 🔥 TESTES DE REGRESSÃO

Após cada mudança, execute:

```bash
# 1. Submeter formulário
./test_scripts/test_form_submit.sh

# 2. Testar autenticação
./test_scripts/test_auth.sh

# 3. Testar endpoints admin
./test_scripts/test_admin_endpoints.sh
```

---

## 📈 TESTES DE PERFORMANCE

### Métricas Esperadas

| Endpoint | Tempo Médio | P95 | P99 |
|----------|-------------|-----|-----|
| `POST /api/form/submit` | < 200ms | < 300ms | < 500ms |
| `GET /api/admin/stats/overview` | < 150ms | < 250ms | < 400ms |
| `GET /api/admin/stats/timeline` | < 300ms | < 500ms | < 800ms |
| `POST /api/admin/export/csv` | < 2s | < 5s | < 10s |

---

## 🎯 CENÁRIOS DE TESTE

### Cenário 1: Usuário Completa Formulário
1. Abre `/formulario`
2. Responde todas as 35 perguntas
3. Clica em "Enviar"
4. Vê página de agradecimento

**Resultado esperado:** ✅ Resposta salva no banco, IP registrado

### Cenário 2: Admin Vê Estatísticas
1. Faz login em `/admin/dashboard`
2. Vê overview com totais
3. Filtra por dimensão
4. Exporta CSV

**Resultado esperado:** ✅ Dados corretos, CSV gerado

### Cenário 3: Múltiplas Submissões Simultâneas
1. 10 usuários abrem o formulário
2. Todos respondem ao mesmo tempo
3. Todos enviam

**Resultado esperado:** ✅ Todas as respostas salvas, sem conflitos

---

## 🔐 TESTES DE SEGURANÇA

### Verificar RLS (Row Level Security)

```sql
-- Tentar acessar sem permissão (deve falhar)
SET ROLE anon;
SELECT * FROM admin_users; -- deve retornar vazio ou erro
```

### Verificar JWT

```bash
# Token expirado deve ser rejeitado
curl -X GET http://localhost:8000/api/admin/stats/overview \
  -H "Authorization: Bearer token_expirado_aqui"

# Deve retornar 401 Unauthorized
```

---

**Desenvolvido por MAP © 2025**
