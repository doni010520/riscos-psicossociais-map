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

const riskLabels: { [key: string]: string } = {
  'baixo': 'BAIXO',
  'moderado': 'MODERADO',
  'alto': 'ALTO',
  'critico': 'CRÍTICO'
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [riskDist, setRiskDist] = useState<RiskDist[]>([]);
  const [dimensionSummary, setDimensionSummary] = useState<DimensionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

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

        {/* Resultado por Dimensão - Tabela Simples */}
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
          {/* Gráfico de Pizza */}
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

          {/* Áreas que Precisam de Atenção */}
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
