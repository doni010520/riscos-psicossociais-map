# 🏥 Riscos Psicossociais MAP

Sistema completo de avaliação de riscos psicossociais no trabalho, 100% anônimo.

## 📋 Sobre o Projeto

Aplicação web para coletar respostas anônimas de funcionários sobre riscos psicossociais no ambiente de trabalho, baseada na metodologia MAP (Management Standards Approach).

### Características Principais

- ✅ **100% Anônimo** - Sem identificação de funcionários
- ✅ **Múltiplas Respostas** - Sem limite por IP
- ✅ **Registro de Origem** - IPs registrados apenas para auditoria
- ✅ **35 Perguntas** - 7 dimensões de risco psicossocial
- ✅ **Dashboard Completo** - Relatórios e gráficos interativos
- ✅ **API Externa** - Endpoint para análise por IA
- ✅ **Responsivo** - Funciona em desktop, tablet e mobile

### 7 Dimensões Avaliadas

1. **Demandas** (8 perguntas) - Carga de trabalho
2. **Controle** (7 perguntas) - Autonomia no trabalho
3. **Relacionamento** (4 perguntas) - Convívio com colegas
4. **Cargo** (4 perguntas) - Clareza de papéis
5. **Mudança** (3 perguntas) - Gestão de mudanças
6. **Apoio Chefia** (5 perguntas) - Suporte da liderança
7. **Apoio Colegas** (4 perguntas) - Suporte dos pares

## 🏗️ Arquitetura

```
┌─────────────────┐
│   Next.js 15    │  Frontend (Formulário + Dashboard)
│   + Tailwind    │  
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FastAPI       │  Backend (API REST)
│   + Pydantic    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │  Banco de Dados (PostgreSQL)
│   + PostgREST   │
└─────────────────┘
```

## 🚀 Deploy

### Pré-requisitos

- Docker + Docker Compose
- Supabase (projeto criado)
- VPS com Easypanel

### Setup Rápido

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/riscos-psicossociais-map.git
cd riscos-psicossociais-map
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite .env com suas credenciais Supabase
```

3. **Execute o schema SQL no Supabase**
```sql
-- No SQL Editor do Supabase, execute:
-- supabase-schema.sql
```

4. **Build e Deploy no Easypanel**
```bash
# O Easypanel detecta automaticamente docker-compose.yml
# Faça push para o repositório e conecte no Easypanel
```

## 📦 Estrutura de Pastas

```
riscos-psicossociais-map/
├── frontend/              # Next.js Application
│   ├── src/
│   │   ├── app/          # App Router
│   │   │   ├── (public)/     # Rotas públicas (formulário)
│   │   │   └── (admin)/      # Rotas admin (dashboard)
│   │   ├── components/   # Componentes React
│   │   ├── lib/          # Utilitários
│   │   └── types/        # TypeScript types
│   ├── public/           # Assets estáticos
│   └── package.json
│
├── backend/              # FastAPI Application
│   ├── app/
│   │   ├── routers/      # Endpoints da API
│   │   ├── services/     # Lógica de negócio
│   │   ├── models/       # Pydantic models
│   │   └── main.py       # Entry point
│   └── requirements.txt
│
├── assets/               # Logo, imagens
├── docs/                 # Documentação adicional
├── supabase-schema.sql   # Schema do banco
├── docker-compose.yml    # Configuração Docker
└── README.md
```

## 🔐 Segurança e Privacidade

### Anonimato Garantido

- ❌ Não coleta: nome, email, matrícula, CPF
- ❌ Não armazena: cookies de identificação
- ✅ Armazena: IP (apenas para auditoria)
- ✅ Criptografia: TLS em todas as comunicações
- ✅ RLS: Row Level Security no Supabase

### Dados Coletados

| Campo | Propósito | Anonimato |
|-------|-----------|-----------|
| IP Address | Auditoria de origem | ✅ Não identifica indivíduo |
| Timestamp | Análise temporal | ✅ Apenas data/hora |
| User Agent | Debug técnico | ✅ Sem dados pessoais |
| Respostas (0-10) | Análise psicossocial | ✅ 100% anônimo |

## 📊 Dashboard Administrativo

### Acesso

- URL: `https://seu-dominio.com/admin/dashboard`
- Credenciais iniciais:
  - Email: `admin@map.com.br`
  - Senha: `Admin@123` (⚠️ TROCAR NO PRIMEIRO LOGIN!)

### Funcionalidades

#### Visão Geral
- Total de respostas
- IPs únicos
- Tempo médio de preenchimento
- Distribuição geral de risco

#### Análise por Dimensão
- Gráficos de barra (distribuição de risco)
- Médias e percentis
- Perguntas críticas (maiores pontuações)
- Comparação entre dimensões

#### Filtros Avançados
- Por período (últimos 7/30/90 dias, customizado)
- Por nível de risco (Crítico, Alto, Moderado, Baixo)
- Por pergunta específica
- Timeline de submissões

#### Exportação
- CSV (dados brutos anonimizados)
- PDF (relatório executivo)
- JSON (para análise externa/IA)

## 🤖 API Externa para IA

Endpoint para exportar dados anonimizados para análise por IA externa:

```bash
POST /api/admin/export-for-ai
Authorization: Bearer {token}

{
  "start_date": "2025-01-01",
  "end_date": "2025-01-31",
  "format": "json"
}
```

Resposta:
```json
{
  "total_responses": 150,
  "data": [
    {
      "submitted_at": "2025-01-30T10:30:00Z",
      "answers": {...},
      "scores": {...},
      "risks": {...}
    }
  ]
}
```

## 🎨 Identidade Visual

### Cores

```css
/* Primária (Azul MAP) */
--primary: #04518c;

/* Secundária (Azul claro) */
--secondary: #6b9ac4;

/* Matriz de Risco */
--risk-baixo: #10B981;    /* Verde */
--risk-moderado: #F59E0B; /* Amarelo */
--risk-alto: #F97316;     /* Laranja */
--risk-critico: #EF4444;  /* Vermelho */
```

### Logo

- Arquivo: `assets/logo-map.png`
- Dimensões: 200x200px (SVG preferível)
- Formato: PNG com fundo transparente

## 📖 Documentação Adicional

- [API Reference](docs/api-reference.md) - Documentação completa da API
- [Database Schema](docs/database-schema.md) - Estrutura do banco
- [User Guide](docs/user-guide.md) - Guia para usuários finais
- [Admin Guide](docs/admin-guide.md) - Guia para administradores

## 🛠️ Desenvolvimento

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# Acesse: http://localhost:3000
```

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# Acesse: http://localhost:8000/docs
```

## 🧪 Testes

### Frontend
```bash
npm run test
npm run test:e2e
```

### Backend
```bash
pytest
pytest --cov
```

## 📝 Licença

Proprietary - MAP © 2025

## 👥 Contato

- **Empresa**: MAP
- **Projeto**: Riscos Psicossociais
- **Email**: admin@map.com.br

---

**Desenvolvido com ❤️ para promover ambientes de trabalho mais saudáveis**
