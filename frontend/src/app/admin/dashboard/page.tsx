'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Stats {
  total_responses: number;
  avg_completion_time: number;
  unique_ips: number;
  responses_last_24h: number;
  responses_last_7d: number;
  responses_last_30d: number;
}

interface RiskDist {
  dimension: string;
  baixo: number;
  moderado: number;
  alto: number;
  critico: number;
}

interface DimensionSummary {
  dimension: string;
  max_points: number;
  avg_points: string;
  percentage: string;
  risk_level: string;
}

interface Response {
  id: string;
  answers: {
    demandas?: number[];
    controle?: number[];
    relacionamento?: number[];
    cargo?: number[];
    mudanca?: number[];
    apoio_chefia?: number[];
    apoio_colegas?: number[];
  };
  completion_time_seconds: number;
  ip_address: string;
  user_agent: string;
  submitted_at: string;
}

const COLORS = {
  baixo: '#22c55e',
  moderado: '#eab308',
  alto: '#f97316',
  critico: '#ef4444',
};

const dimensionNames: { [key: string]: string } = {
  'demandas': 'Demandas',
  'controle': 'Controle',
  'apoio_chefia': 'Apoio da Chefia',
  'apoio_colegas': 'Apoio dos Colegas',
  'relacionamento': 'Relacionamentos',
  'cargo': 'Cargo',
  'mudanca': 'Mudança'
};

const dimensionMaxPoints: { [key: string]: number } = {
  'demandas': 80,
  'controle': 70,
  'relacionamento': 40,
  'cargo': 40,
  'mudanca': 30,
  'apoio_chefia': 50,
  'apoio_colegas': 40
};

const riskLabels: { [key: string]: string } = {
  'baixo': 'BAIXO',
  'moderado': 'MODERADO',
  'alto': 'ALTO',
  'critico': 'CRÍTICO'
};

// Lista de todas as perguntas
const QUESTIONS = [
  { id: 1, dimension: 'demandas', index: 0, text: 'No trabalho, diferentes grupos exigem de mim, coisas difíceis de conciliar.' },
  { id: 2, dimension: 'demandas', index: 1, text: 'Tenho prazos impossíveis de serem cumpridos.' },
  { id: 3, dimension: 'demandas', index: 2, text: 'Tenho que trabalhar muito intensamente.' },
  { id: 4, dimension: 'demandas', index: 3, text: 'Preciso deixar de lado algumas tarefas porque tenho coisas demais para fazer.' },
  { id: 5, dimension: 'demandas', index: 4, text: 'Não consigo fazer pausas suficientes.' },
  { id: 6, dimension: 'demandas', index: 5, text: 'Sou pressionado para trabalhar por longos períodos.' },
  { id: 7, dimension: 'demandas', index: 6, text: 'Tenho que trabalhar muito rápido.' },
  { id: 8, dimension: 'demandas', index: 7, text: 'Sofro pressões de tempo absurdas.' },
  { id: 9, dimension: 'controle', index: 0, text: 'Não posso decidir quando posso fazer uma pausa.' },
  { id: 10, dimension: 'controle', index: 1, text: 'Não sei como fazer para executar meu trabalho.' },
  { id: 11, dimension: 'controle', index: 2, text: 'Não posso decidir sobre meu ritmo de trabalho.' },
  { id: 12, dimension: 'controle', index: 3, text: 'Não posso escolher como devo fazer meu trabalho.' },
  { id: 13, dimension: 'controle', index: 4, text: 'Meu horário de trabalho não pode ser flexível.' },
  { id: 14, dimension: 'controle', index: 5, text: 'Não tenho algum poder de decisão sobre a minha maneira de trabalhar.' },
  { id: 15, dimension: 'controle', index: 6, text: 'Não posso escolher o que fazer no trabalho.' },
  { id: 16, dimension: 'relacionamento', index: 0, text: 'Estou sujeito a assédio pessoal na forma de palavras ou comportamentos rudes.' },
  { id: 17, dimension: 'relacionamento', index: 1, text: 'Existe atrito ou animosidade entre os colegas de trabalho.' },
  { id: 18, dimension: 'relacionamento', index: 2, text: 'Estou sujeito a constrangimentos no trabalho.' },
  { id: 19, dimension: 'relacionamento', index: 3, text: 'Os relacionamentos no trabalho são tensos.' },
  { id: 20, dimension: 'cargo', index: 0, text: 'Não sei claramente o que é esperado de mim no trabalho.' },
  { id: 21, dimension: 'cargo', index: 1, text: 'Não estou ciente quais são meus deveres e responsabilidades.' },
  { id: 22, dimension: 'cargo', index: 2, text: 'Eu não conheço as metas e objetivos do meu departamento.' },
  { id: 23, dimension: 'cargo', index: 3, text: 'Não compreendo como meu trabalho se integra com os objetivos da organização.' },
  { id: 24, dimension: 'mudanca', index: 0, text: 'Não tenho oportunidades suficientes para questionar as chefias sobre mudanças no trabalho.' },
  { id: 25, dimension: 'mudanca', index: 1, text: 'A equipe não é sempre consultada sobre mudança no trabalho.' },
  { id: 26, dimension: 'mudanca', index: 2, text: 'Quando ocorrem mudanças no trabalho, não sou esclarecido de como elas funcionam na prática.' },
  { id: 27, dimension: 'apoio_chefia', index: 0, text: 'Não posso contar com a ajuda do meu chefe imediato para resolver problemas de trabalho.' },
  { id: 28, dimension: 'apoio_chefia', index: 1, text: 'Não recebo retorno sobre os trabalhos que realizo.' },
  { id: 29, dimension: 'apoio_chefia', index: 2, text: 'Não posso falar com meu chefe algo que me incomodou no trabalho.' },
  { id: 30, dimension: 'apoio_chefia', index: 3, text: 'Não recebo apoio quando realizo trabalho que pode ser emocionalmente desgastante.' },
  { id: 31, dimension: 'apoio_chefia', index: 4, text: 'Meu chefe imediato me desmotiva no trabalho.' },
  { id: 32, dimension: 'apoio_colegas', index: 0, text: 'Não recebo ajuda e o apoio necessário dos meus colegas.' },
  { id: 33, dimension: 'apoio_colegas', index: 1, text: 'Não sou respeitado como eu mereço pelos meus colegas.' },
  { id: 34, dimension: 'apoio_colegas', index: 2, text: 'Se o trabalho fica difícil, meus colegas não me ajudam.' },
  { id: 35, dimension: 'apoio_colegas', index: 3, text: 'Meus colegas não estão dispostos a ouvir meus problemas relacionados ao trabalho.' },
];

// Função para calcular nível de risco (0-10 escala)
function getRiskLevelFromAvg(avg: number): string {
  if (avg < 3) return 'baixo';
  if (avg < 5) return 'moderado';
  if (avg < 9) return 'alto';
  return 'critico';
}

// Função para calcular nível de risco (percentual)
function getRiskLevel(percentage: number): string {
  if (percentage < 30) return 'baixo';
  if (percentage < 50) return 'moderado';
  if (percentage < 90) return 'alto';
  return 'critico';
}

// Função para calcular pontuação de uma resposta
function calculateResponseScore(answers: Response['answers']) {
  let totalPoints = 0;
  let maxPoints = 0;
  
  Object.entries(answers).forEach(([key, values]) => {
    if (values && Array.isArray(values)) {
      totalPoints += values.reduce((a, b) => a + b, 0);
      maxPoints += dimensionMaxPoints[key] || 0;
    }
  });
  
  const percentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
  return { totalPoints, maxPoints, percentage, riskLevel: getRiskLevel(percentage) };
}

// Função para calcular média por pergunta
function calculateQuestionAverages(responses: Response[]) {
  const questionStats: { [key: number]: { sum: number; count: number } } = {};
  
  // Inicializar
  QUESTIONS.forEach(q => {
    questionStats[q.id] = { sum: 0, count: 0 };
  });
  
  // Somar todas as respostas
  responses.forEach(response => {
    QUESTIONS.forEach(question => {
      const dimensionAnswers = response.answers[question.dimension as keyof typeof response.answers];
      if (dimensionAnswers && dimensionAnswers[question.index] !== undefined) {
        questionStats[question.id].sum += dimensionAnswers[question.index];
        questionStats[question.id].count += 1;
      }
    });
  });
  
  // Calcular médias
  return QUESTIONS.map(q => ({
    ...q,
    avg: questionStats[q.id].count > 0 
      ? questionStats[q.id].sum / questionStats[q.id].count 
      : 0,
    totalResponses: questionStats[q.id].count
  })).sort((a, b) => b.avg - a.avg); // Ordenar por média (maior primeiro)
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [riskDist, setRiskDist] = useState<RiskDist[]>([]);
  const [dimensionSummary, setDimensionSummary] = useState<DimensionSummary[]>([]);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dimensao' | 'pergunta' | 'individual'>('dimensao');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (!savedToken) {
      router.push('/admin');
      return;
    }
    setToken(savedToken);
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const statsRes = await fetch(`${apiUrl}/api/admin/stats/overview`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const riskRes = await fetch(`${apiUrl}/api/admin/stats/risk-distribution`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (riskRes.ok) {
        const riskData = await riskRes.json();
        setRiskDist(riskData);
      }

      const summaryRes = await fetch(`${apiUrl}/api/admin/stats/dimension-summary`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setDimensionSummary(summaryData);
      }

      const responsesRes = await fetch(`${apiUrl}/api/admin/reports/responses`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (responsesRes.ok) {
        const responsesData = await responsesRes.json();
        setResponses(responsesData);
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  const handleExportCSV = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/admin/reports/responses`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      
      const headers = ['id', 'answers', 'completion_time_seconds', 'ip_address', 'user_agent', 'submitted_at'];
      const csvContent = [
        headers.join(','),
        ...data.map((row: any) => 
          headers.map(h => {
            const val = h === 'answers' ? JSON.stringify(row[h]) : row[h];
            return `"${val}"`;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `riscos-psicossociais-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
    }
  };

  const handleExportJSON = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/admin/reports/responses`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `riscos-psicossociais-ai-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
    }
  };

  const totalRisks = riskDist.reduce(
    (acc, item) => ({
      baixo: acc.baixo + item.baixo,
      moderado: acc.moderado + item.moderado,
      alto: acc.alto + item.alto,
      critico: acc.critico + item.critico,
    }),
    { baixo: 0, moderado: 0, alto: 0, critico: 0 }
  );

  const pieData = [
    { name: 'Baixo', value: totalRisks.baixo, color: COLORS.baixo },
    { name: 'Moderado', value: totalRisks.moderado, color: COLORS.moderado },
    { name: 'Alto', value: totalRisks.alto, color: COLORS.alto },
    { name: 'Crítico', value: totalRisks.critico, color: COLORS.critico },
  ];

  const questionAverages = calculateQuestionAverages(responses);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-white text-lg">Carregando dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card water-drop mb-8 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Image src="/logo-map.png" alt="MAP Logo" width={60} height={60} className="rounded-lg" />
              <div>
                <h1 className="text-2xl font-bold text-white">📊 Dashboard Admin</h1>
                <p className="text-blue-200 text-sm">Riscos Psicossociais - MAP</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl glass bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 transition-all"
            >
              🚪 Sair
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card water-drop p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">Total de Respostas</p>
                  <p className="text-white text-3xl font-bold">{stats.total_responses}</p>
                  <p className="text-blue-300 text-xs mt-1">{stats.responses_last_30d} este mês</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            <div className="glass-card water-drop p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">Tempo Médio</p>
                  <p className="text-white text-3xl font-bold">{Math.round(stats.avg_completion_time / 60)}min</p>
                  <p className="text-blue-300 text-xs mt-1">{stats.avg_completion_time.toFixed(0)}s total</p>
                </div>
                <div className="text-4xl">⏱️</div>
              </div>
            </div>

            <div className="glass-card water-drop p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">IPs Únicos</p>
                  <p className="text-white text-3xl font-bold">{stats.unique_ips}</p>
                  <p className="text-blue-300 text-xs mt-1">Participantes distintos</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>

            <div className="glass-card water-drop p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">Últimas 24h</p>
                  <p className="text-white text-3xl font-bold">{stats.responses_last_24h}</p>
                  <p className="text-blue-300 text-xs mt-1">{stats.responses_last_7d} esta semana</p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs de Navegação */}
        <div className="glass-card water-drop mb-8 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('dimensao')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'dimensao'
                  ? 'bg-blue-500/30 text-white'
                  : 'text-blue-300 hover:bg-white/5'
              }`}
            >
              🎯 Por Dimensão
            </button>
            <button
              onClick={() => setActiveTab('pergunta')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'pergunta'
                  ? 'bg-blue-500/30 text-white'
                  : 'text-blue-300 hover:bg-white/5'
              }`}
            >
              📝 Por Pergunta
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'individual'
                  ? 'bg-blue-500/30 text-white'
                  : 'text-blue-300 hover:bg-white/5'
              }`}
            >
              👤 Individual
            </button>
          </div>
        </div>

        {/* Tab: Por Dimensão */}
        {activeTab === 'dimensao' && (
          <>
            <div className="glass-card water-drop mb-8 p-6">
              <h2 className="text-xl font-bold text-white mb-6">🎯 Resultado por Dimensão</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-blue-200 font-medium py-3 px-4">Dimensão</th>
                      <th className="text-center text-blue-200 font-medium py-3 px-4">Máximo</th>
                      <th className="text-center text-blue-200 font-medium py-3 px-4">Resultado</th>
                      <th className="text-center text-blue-200 font-medium py-3 px-4">%</th>
                      <th className="text-center text-blue-200 font-medium py-3 px-4">Nível</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dimensionSummary.map((item) => {
                      const percentage = parseFloat(item.percentage);
                      const avgPoints = parseFloat(item.avg_points);
                      
                      const rowBg = 
                        item.risk_level === 'baixo' ? 'bg-green-500/40' :
                        item.risk_level === 'moderado' ? 'bg-yellow-500/40' :
                        item.risk_level === 'alto' ? 'bg-orange-500/40' :
                        'bg-red-500/40';
                      
                      return (
                        <tr key={item.dimension} className={`${rowBg} border-b border-white/10`}>
                          <td className="text-white py-3 px-4 font-medium">
                            {dimensionNames[item.dimension] || item.dimension}
                          </td>
                          <td className="text-center text-white py-3 px-4">
                            {item.max_points} pts
                          </td>
                          <td className="text-center text-white py-3 px-4 font-bold">
                            {avgPoints.toFixed(1)} pts
                          </td>
                          <td className="text-center text-white py-3 px-4 font-bold">
                            {percentage.toFixed(0)}%
                          </td>
                          <td className="text-center py-3 px-4">
                            <span className="text-white font-bold">
                              {riskLabels[item.risk_level]}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="glass-card water-drop p-6">
                <h2 className="text-xl font-bold text-white mb-4">📊 Visão Geral de Riscos</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm text-blue-200">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card water-drop p-6">
                <h2 className="text-xl font-bold text-white mb-4">⚠️ Áreas que Precisam de Atenção</h2>
                <div className="space-y-3">
                  {dimensionSummary
                    .filter(item => item.risk_level === 'alto' || item.risk_level === 'critico')
                    .map((item) => (
                      <div 
                        key={item.dimension}
                        className={`p-4 rounded-xl border ${
                          item.risk_level === 'critico' 
                            ? 'bg-red-500/20 border-red-500/50' 
                            : 'bg-orange-500/20 border-orange-500/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${
                            item.risk_level === 'critico' ? 'text-red-300' : 'text-orange-300'
                          }`}>
                            {dimensionNames[item.dimension] || item.dimension}
                          </span>
                          <span className={`text-sm ${
                            item.risk_level === 'critico' ? 'text-red-400' : 'text-orange-400'
                          }`}>
                            {parseFloat(item.percentage).toFixed(0)}% - {riskLabels[item.risk_level]}
                          </span>
                        </div>
                      </div>
                    ))}
                  {dimensionSummary.filter(item => item.risk_level === 'alto' || item.risk_level === 'critico').length === 0 && (
                    <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-300">
                      ✅ Nenhuma área em risco alto ou crítico!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab: Por Pergunta */}
        {activeTab === 'pergunta' && (
          <div className="glass-card water-drop mb-8 p-6">
            <h2 className="text-xl font-bold text-white mb-2">📝 Resultado por Pergunta</h2>
            <p className="text-blue-200 text-sm mb-6">Ordenado por média (mais críticas primeiro)</p>
            
            <div className="space-y-3">
              {questionAverages.map((question, index) => {
                const riskLevel = getRiskLevelFromAvg(question.avg);
                
                const rowBg = 
                  riskLevel === 'baixo' ? 'bg-green-500/30 border-green-500/30' :
                  riskLevel === 'moderado' ? 'bg-yellow-500/30 border-yellow-500/30' :
                  riskLevel === 'alto' ? 'bg-orange-500/30 border-orange-500/30' :
                  'bg-red-500/30 border-red-500/30';
                
                return (
                  <div key={question.id} className={`p-4 rounded-xl border ${rowBg}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-blue-300 text-xs font-medium px-2 py-0.5 rounded bg-white/10">
                            {dimensionNames[question.dimension]}
                          </span>
                          <span className="text-blue-400 text-xs">#{index + 1}</span>
                        </div>
                        <p className="text-white">{question.text}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white text-2xl font-bold">{question.avg.toFixed(1)}</p>
                        <p className="text-blue-300 text-xs">de 10</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Individual */}
        {activeTab === 'individual' && (
          <div className="glass-card water-drop mb-8 p-6">
            <h2 className="text-xl font-bold text-white mb-6">👤 Respostas Individuais</h2>
            
            <div className="space-y-3">
              {responses.map((response, index) => {
                const score = calculateResponseScore(response.answers);
                const isExpanded = expandedResponse === response.id;
                
                const rowBg = 
                  score.riskLevel === 'baixo' ? 'bg-green-500/20 border-green-500/30' :
                  score.riskLevel === 'moderado' ? 'bg-yellow-500/20 border-yellow-500/30' :
                  score.riskLevel === 'alto' ? 'bg-orange-500/20 border-orange-500/30' :
                  'bg-red-500/20 border-red-500/30';
                
                return (
                  <div key={response.id} className={`rounded-xl border ${rowBg} overflow-hidden`}>
                    <div 
                      className="p-4 cursor-pointer hover:bg-white/5 transition-all"
                      onClick={() => setExpandedResponse(isExpanded ? null : response.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-white font-bold text-lg">#{index + 1}</span>
                          <div>
                            <p className="text-white font-medium">{formatDate(response.submitted_at)}</p>
                            <p className="text-blue-300 text-sm">Tempo: {formatDuration(response.completion_time_seconds)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white font-bold">{score.totalPoints} / {score.maxPoints} pts</p>
                            <p className="text-blue-300 text-sm">{score.percentage.toFixed(0)}%</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            score.riskLevel === 'baixo' ? 'bg-green-500/30 text-green-300' :
                            score.riskLevel === 'moderado' ? 'bg-yellow-500/30 text-yellow-300' :
                            score.riskLevel === 'alto' ? 'bg-orange-500/30 text-orange-300' :
                            'bg-red-500/30 text-red-300'
                          }`}>
                            {riskLabels[score.riskLevel]}
                          </span>
                          <span className="text-blue-300 text-xl">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="border-t border-white/10 p-4 bg-black/20">
                        <h4 className="text-white font-medium mb-4">Detalhes por Dimensão:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(response.answers).map(([dimension, values]) => {
                            if (!values || !Array.isArray(values)) return null;
                            
                            const dimTotal = values.reduce((a, b) => a + b, 0);
                            const dimMax = dimensionMaxPoints[dimension] || 0;
                            const dimPercentage = dimMax > 0 ? (dimTotal / dimMax) * 100 : 0;
                            const dimRisk = getRiskLevel(dimPercentage);
                            
                            const dimBg = 
                              dimRisk === 'baixo' ? 'bg-green-500/30' :
                              dimRisk === 'moderado' ? 'bg-yellow-500/30' :
                              dimRisk === 'alto' ? 'bg-orange-500/30' :
                              'bg-red-500/30';
                            
                            return (
                              <div key={dimension} className={`p-3 rounded-lg ${dimBg}`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-white font-medium">
                                    {dimensionNames[dimension] || dimension}
                                  </span>
                                  <span className="text-white font-bold">
                                    {dimTotal} / {dimMax} ({dimPercentage.toFixed(0)}%)
                                  </span>
                                </div>
                                <p className="text-blue-200 text-xs mt-1">
                                  Respostas: [{values.join(', ')}]
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Exportar Dados */}
        <div className="glass-card water-drop p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Exportar Dados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExportCSV}
              className="p-6 rounded-xl glass bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 transition-all text-left group"
            >
              <div className="text-4xl mb-3">📥</div>
              <p className="font-semibold text-lg mb-2 group-hover:text-white transition-colors">Exportar CSV</p>
              <p className="text-sm opacity-80">Baixar todas as respostas em formato de planilha</p>
            </button>

            <button
              onClick={handleExportJSON}
              className="p-6 rounded-xl glass bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 transition-all text-left group"
            >
              <div className="text-4xl mb-3">🤖</div>
              <p className="font-semibold text-lg mb-2 group-hover:text-white transition-colors">Exportar JSON</p>
              <p className="text-sm opacity-80">Formato otimizado para análise com IA</p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-blue-200 text-sm">
            © 2025 MAP - Riscos Psicossociais | Dashboard Administrativo
          </p>
        </div>
      </div>
    </div>
  );
}
