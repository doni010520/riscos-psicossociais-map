'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [riskDist, setRiskDist] = useState<RiskDist[]>([]);
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
      
      // Converter para CSV
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

  // Mapear nomes das dimensões
  const dimensionNames: { [key: string]: string } = {
    'demandas': 'Demandas',
    'controle': 'Controle',
    'apoio_chefia': 'Apoio da Chefia',
    'apoio_colegas': 'Apoio dos Colegas',
    'relacionamento': 'Relacionamentos',
    'cargo': 'Cargo',
    'mudanca': 'Mudança'
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

        {/* Detalhamento de Riscos por Dimensão */}
        <div className="glass-card water-drop mb-8 p-6">
          <h2 className="text-xl font-bold text-white mb-6">📋 Distribuição por Nível de Risco</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-blue-200 font-medium py-3 px-4">Dimensão</th>
                  <th className="text-center text-green-300 font-medium py-3 px-4">Baixo</th>
                  <th className="text-center text-yellow-300 font-medium py-3 px-4">Moderado</th>
                  <th className="text-center text-orange-300 font-medium py-3 px-4">Alto</th>
                  <th className="text-center text-red-300 font-medium py-3 px-4">Crítico</th>
                </tr>
              </thead>
              <tbody>
                {riskDist.map((risk) => (
                  <tr key={risk.dimension} className="border-b border-white/10 hover:bg-white/5">
                    <td className="text-white py-3 px-4 font-medium">
                      {dimensionNames[risk.dimension] || risk.dimension}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-block bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                        {risk.baixo}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-block bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm">
                        {risk.moderado}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-block bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                        {risk.alto}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <span className="inline-block bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                        {risk.critico}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações de Exportação */}
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
