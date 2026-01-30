# 📚 API Reference - Riscos Psicossociais MAP

Base URL: `https://api.seu-dominio.com` (produção) ou `http://localhost:8000` (desenvolvimento)

## 🔓 Endpoints Públicos (Sem Autenticação)

### 1. Submeter Formulário

```http
POST /api/form/submit
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": {
    "demandas": [5, 6, 4, 7, 5, 6, 7, 8],
    "controle": [3, 4, 5, 4, 3, 4, 5],
    "relacionamento": [2, 1, 2, 3],
    "cargo": [4, 5, 4, 6],
    "mudanca": [5, 6, 5],
    "apoio_chefia": [7, 6, 7, 8, 6],
    "apoio_colegas": [4, 5, 4, 5]
  },
  "completion_time_seconds": 420,
  "user_agent": "Mozilla/5.0..."
}
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Formulário enviado com sucesso!",
  "submitted_at": "2025-01-30T14:30:00Z"
}
```

---

## 🔐 Endpoints Admin (Requer Autenticação)

### 2. Login Admin

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@map.com.br",
  "password": "Admin@123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 86400
}
```

**Response 401:**
```json
{
  "detail": "Email ou senha incorretos"
}
```

---

### 3. Obter Dados do Admin Atual

```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@map.com.br",
  "full_name": "Administrador MAP",
  "created_at": "2025-01-30T10:00:00Z",
  "last_login": "2025-01-30T14:00:00Z",
  "is_active": true
}
```

---

### 4. Estatísticas Gerais (Overview)

```http
GET /api/admin/stats/overview
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "total_responses": 150,
  "unique_ips": 120,
  "avg_completion_time": 387.5,
  "first_submission": "2025-01-15T09:00:00Z",
  "last_submission": "2025-01-30T14:30:00Z",
  "avg_scores": {
    "demandas": 52.3,
    "controle": 38.7,
    "relacionamento": 18.2,
    "cargo": 22.5,
    "mudanca": 19.8,
    "apoio_chefia": 31.2,
    "apoio_colegas": 23.4
  },
  "critical_percentages": {
    "demandas": 23.5,
    "controle": 15.2,
    "relacionamento": 8.1,
    "cargo": 12.3,
    "mudanca": 18.7,
    "apoio_chefia": 20.1,
    "apoio_colegas": 14.3
  }
}
```

---

### 5. Distribuição de Risco por Dimensão

```http
GET /api/admin/stats/risk-distribution
Authorization: Bearer {token}
```

**Response 200:**
```json
[
  {
    "dimension": "Demandas",
    "baixo": 15,
    "moderado": 38,
    "alto": 62,
    "critico": 35
  },
  {
    "dimension": "Controle",
    "baixo": 22,
    "moderado": 45,
    "alto": 58,
    "critico": 25
  }
  // ... outras dimensões
]
```

---

### 6. Timeline de Submissões

```http
GET /api/admin/stats/timeline?start_date=2025-01-01T00:00:00Z&end_date=2025-01-31T23:59:59Z
Authorization: Bearer {token}
```

**Query Parameters:**
- `start_date` (opcional): Data inicial (ISO 8601)
- `end_date` (opcional): Data final (ISO 8601)

**Response 200:**
```json
[
  {
    "hour": "2025-01-30T14:00:00Z",
    "submissions": 12,
    "unique_ips": 11
  },
  {
    "hour": "2025-01-30T13:00:00Z",
    "submissions": 8,
    "unique_ips": 8
  }
  // ...
]
```

---

### 7. Respostas Filtradas

```http
POST /api/admin/reports/filtered
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-01-31T23:59:59Z",
  "risk_level": "CRITICO",
  "dimension": "demandas"
}
```

**Response 200:**
```json
{
  "total": 35,
  "filters": {
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-01-31T23:59:59Z",
    "risk_level": "CRITICO",
    "dimension": "demandas"
  },
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "submitted_at": "2025-01-30T14:30:00Z",
      "ip_address": "192.168.1.100",
      "answers": { /* ... */ },
      "score_demandas": 75,
      "risk_demandas": "CRITICO"
      // ... outros campos
    }
    // ...
  ]
}
```

---

### 8. Análise Detalhada de Dimensão

```http
GET /api/admin/reports/dimension/{dimension}
Authorization: Bearer {token}
```

**Path Parameters:**
- `dimension`: demandas | controle | relacionamento | cargo | mudanca | apoio_chefia | apoio_colegas

**Response 200:**
```json
{
  "avg_score": 52.35,
  "stddev": 18.72,
  "min_score": 8,
  "max_score": 80,
  "median": 54.0,
  "critico_count": 35,
  "alto_count": 62,
  "moderado_count": 38,
  "baixo_count": 15,
  "total": 150
}
```

---

### 9. Exportar para IA

```http
POST /api/admin/export/ai
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-01-31T23:59:59Z"
}
```

**Response 200:**
```json
{
  "total_responses": 150,
  "data": [
    {
      "response_id": "550e8400-e29b-41d4-a716-446655440000",
      "submitted_at": "2025-01-30T14:30:00Z",
      "answers": { /* ... */ },
      "scores": {
        "demandas": 52,
        "controle": 38,
        // ...
      },
      "risks": {
        "demandas": "ALTO",
        "controle": "MODERADO",
        // ...
      }
    }
    // ...
  ]
}
```

---

### 10. Exportar CSV

```http
POST /api/admin/export/csv
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "start_date": "2025-01-01T00:00:00Z",
  "end_date": "2025-01-31T23:59:59Z"
}
```

**Response 200:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename=riscos_psicossociais.csv

id,submitted_at,ip_address,completion_time_seconds,score_demandas,...
550e8400-e29b-41d4-a716-446655440000,2025-01-30T14:30:00Z,192.168.1.100,420,52,...
```

---

## 📊 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 500 | Erro interno do servidor |

---

## 🔑 Autenticação

Todos os endpoints admin requerem um token JWT no header:

```
Authorization: Bearer {seu_token_jwt}
```

O token é obtido através do endpoint `/api/auth/login` e tem validade de **24 horas**.

---

## 🧪 Testando a API

### Com cURL:

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@map.com.br","password":"Admin@123"}'

# Usar token
TOKEN="seu_token_aqui"
curl -X GET http://localhost:8000/api/admin/stats/overview \
  -H "Authorization: Bearer $TOKEN"
```

### Com Postman:

1. Importe a coleção Postman (disponível em `/docs/postman-collection.json`)
2. Configure a variável `{{base_url}}`
3. Faça login e o token será automaticamente salvo
4. Teste os endpoints

---

## 📖 Documentação Interativa

Acesse a documentação interativa (Swagger UI):
```
http://localhost:8000/docs
```

Ou use ReDoc:
```
http://localhost:8000/redoc
```

---

## 💡 Dicas

- Use `start_date` e `end_date` para filtrar por período
- Combine `risk_level` e `dimension` para análises específicas
- O endpoint `/export/ai` é otimizado para integração com modelos de IA
- O CSV exportado contém todos os dados anonimizados

---

**Desenvolvido por MAP © 2025**
