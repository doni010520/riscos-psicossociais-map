// ============================================================================
// TYPES: Riscos Psicossociais MAP
// ============================================================================

// Níveis de risco
export type RiskLevel = 'BAIXO' | 'MODERADO' | 'ALTO' | 'CRITICO';

// Dimensões avaliadas
export type Dimension = 
  | 'demandas' 
  | 'controle' 
  | 'relacionamento' 
  | 'cargo' 
  | 'mudanca' 
  | 'apoio_chefia' 
  | 'apoio_colegas';

// Configuração de dimensões
export interface DimensionConfig {
  name: Dimension;
  label: string;
  questionCount: number;
  maxScore: number;
  thresholds: {
    critico: number;
    alto: number;
    moderado: number;
  };
}

// Respostas do formulário (estrutura enviada ao backend)
export interface FormAnswers {
  demandas: number[]; // 8 respostas
  controle: number[]; // 7 respostas
  relacionamento: number[]; // 4 respostas
  cargo: number[]; // 4 respostas
  mudanca: number[]; // 3 respostas
  apoio_chefia: number[]; // 5 respostas
  apoio_colegas: number[]; // 4 respostas
}

// Pergunta individual
export interface Question {
  id: number;
  dimension: Dimension;
  text: string;
  index: number; // índice dentro da dimensão
}

// Resposta individual
export interface Answer {
  questionId: number;
  value: number; // 0-10
}

// Submissão completa do formulário
export interface FormSubmission {
  answers: FormAnswers;
  completionTimeSeconds: number;
  userAgent?: string;
}

// Resposta do backend ao submeter
export interface SubmissionResponse {
  id: string;
  message: string;
  submittedAt: string;
}

// Pontuações calculadas
export interface DimensionScores {
  demandas: number;
  controle: number;
  relacionamento: number;
  cargo: number;
  mudanca: number;
  apoio_chefia: number;
  apoio_colegas: number;
}

// Níveis de risco por dimensão
export interface DimensionRisks {
  demandas: RiskLevel;
  controle: RiskLevel;
  relacionamento: RiskLevel;
  cargo: RiskLevel;
  mudanca: RiskLevel;
  apoio_chefia: RiskLevel;
  apoio_colegas: RiskLevel;
}

// Resposta completa do banco (para dashboard)
export interface Response {
  id: string;
  ipAddress: string;
  submittedAt: string;
  userAgent?: string;
  completionTimeSeconds: number;
  answers: FormAnswers;
  scores: DimensionScores;
  risks: DimensionRisks;
}

// Estatísticas gerais (dashboard)
export interface OverviewStats {
  totalResponses: number;
  uniqueIps: number;
  avgCompletionTime: number;
  firstSubmission: string;
  lastSubmission: string;
  avgScores: DimensionScores;
  criticalPercentages: {
    [K in Dimension]: number;
  };
}

// Distribuição de risco
export interface RiskDistribution {
  dimension: string;
  baixo: number;
  moderado: number;
  alto: number;
  critico: number;
}

// Timeline de submissões
export interface SubmissionTimeline {
  hour: string;
  submissions: number;
  uniqueIps: number;
}

// Análise por pergunta
export interface QuestionAnalysis {
  question: string;
  avgScore: number;
  mostCommonScore: number;
  stddev: number;
}

// Filtros para relatórios
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  riskLevel?: RiskLevel;
  dimension?: Dimension;
}

// Dados para exportação (IA)
export interface ExportData {
  responseId: string;
  submittedAt: string;
  answers: FormAnswers;
  scores: DimensionScores;
  risks: DimensionRisks;
}

// Usuário admin
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

// Login admin
export interface LoginCredentials {
  email: string;
  password: string;
}

// Token de autenticação
export interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Contexto de autenticação
export interface AuthContext {
  user: AdminUser | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Props de componentes
export interface QuestionCardProps {
  question: Question;
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export interface DimensionHeaderProps {
  dimension: DimensionConfig;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface RiskMatrixProps {
  distribution: RiskDistribution[];
}

export interface DimensionChartProps {
  data: DimensionScores;
  thresholds?: DimensionConfig[];
}

export interface FilterPanelProps {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
  onReset: () => void;
}

// Constantes
export const DIMENSIONS: DimensionConfig[] = [
  {
    name: 'demandas',
    label: 'Demandas',
    questionCount: 8,
    maxScore: 80,
    thresholds: { critico: 72, alto: 40, moderado: 24 }
  },
  {
    name: 'controle',
    label: 'Controle',
    questionCount: 7,
    maxScore: 70,
    thresholds: { critico: 63, alto: 35, moderado: 21 }
  },
  {
    name: 'relacionamento',
    label: 'Relacionamento',
    questionCount: 4,
    maxScore: 40,
    thresholds: { critico: 36, alto: 20, moderado: 12 }
  },
  {
    name: 'cargo',
    label: 'Cargo',
    questionCount: 4,
    maxScore: 40,
    thresholds: { critico: 36, alto: 20, moderado: 12 }
  },
  {
    name: 'mudanca',
    label: 'Mudança',
    questionCount: 3,
    maxScore: 30,
    thresholds: { critico: 27, alto: 15, moderado: 9 }
  },
  {
    name: 'apoio_chefia',
    label: 'Apoio Chefia',
    questionCount: 5,
    maxScore: 50,
    thresholds: { critico: 45, alto: 25, moderado: 15 }
  },
  {
    name: 'apoio_colegas',
    label: 'Apoio Colegas',
    questionCount: 4,
    maxScore: 40,
    thresholds: { critico: 36, alto: 20, moderado: 12 }
  }
];

// Utilitários de tipo
export function getRiskLevel(score: number, thresholds: DimensionConfig['thresholds']): RiskLevel {
  if (score >= thresholds.critico) return 'CRITICO';
  if (score >= thresholds.alto) return 'ALTO';
  if (score >= thresholds.moderado) return 'MODERADO';
  return 'BAIXO';
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'CRITICO': return 'text-risk-critico bg-risk-critico/10';
    case 'ALTO': return 'text-risk-alto bg-risk-alto/10';
    case 'MODERADO': return 'text-risk-moderado bg-risk-moderado/10';
    case 'BAIXO': return 'text-risk-baixo bg-risk-baixo/10';
  }
}

export function getRiskBadgeColor(risk: RiskLevel): string {
  switch (risk) {
    case 'CRITICO': return 'bg-risk-critico text-white';
    case 'ALTO': return 'bg-risk-alto text-white';
    case 'MODERADO': return 'bg-risk-moderado text-white';
    case 'BAIXO': return 'bg-risk-baixo text-white';
  }
}
