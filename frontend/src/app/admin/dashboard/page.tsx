'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Stats {
  total_submissions: number;
  average_score: number;
  low_risk_count: number;
  medium_risk_count: number;
  high_risk_count: number;
  critical_risk_count: number;
  submissions_today: number;
  submissions_this_week: number;
  submissions_this_month: number;
}

interface RiskDist {
  risk_level: string;
  count: number;
  percentage: number;
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

      const statsRes = await fetch(`${apiUrl}/api/stats/overview`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const riskRes = await fetch(`${apiUrl}/api/stats/risk-distribution`, {
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
      const response = await fetch(`${apiUrl}/api/export/csv`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const blob = await response.blob();
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
      const response = await fetch(`${apiUrl}/api/export/ai`, {
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
                  <p className="text-white text-3xl font-bold">{stats.total_submissions}</p>
                  <p className="text-blue-300 text-xs mt-1">{stats.submissions_this_month} este mês</p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </div>

            <div className="glass-card water-drop p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">Média Geral</p>
                  <p className="text-white text-3xl font-bold">{stats.average_score.toFixed(1)}</p>
                  <p className="text-blue-300 text-xs mt-1">Escala 0-10</p>
                </div>
                <div className="text-4xl">📈</div>
              </div>
            </div>

            <div className="glass-card water-drop p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">Alto Risco</p>
                  <p className="text-white text-3xl font-bold">{stats.high_risk_count + stats.critical_risk_count}</p>
                  <p className="text-blue-300 text-xs mt-1">
                    {stats.total_submissions > 0 
                      ? ((stats.high_risk_count + stats.critical_risk_count) / stats.total_submissions * 100).toFixed(1) 
                      : 0}% do total
                  </p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </div>

            <div className="glass-card water-drop p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium mb-2">Respostas Hoje</p>
                  <p className="text-white text-3xl font-bold">{stats.submissions_today}</p>
                  <p className="text-blue-300 text-xs mt-1">{stats.submissions_this_week} esta semana</p>
                </div>
                <div className="text-4xl">📅</div>
              </div>
            </div>
          </div>
        )}

        {/* Detalhamento de Riscos */}
        <div className="glass-card water-drop mb-8 p-6">
          <h2 className="text-xl font-bold text-white mb-6">📋 Distribuição por Nível de Risco</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {riskDist.map((risk) => {
              const bgColor = risk.risk_level === 'Baixo' ? 'bg-green-500/20 border-green-500/50' :
                             risk.risk_level === 'Médio' ? 'bg-yellow-500/20 border-yellow-500/50' :
                             risk.risk_level === 'Alto' ? 'bg-orange-500/20 border-orange-500/50' :
                             'bg-red-500/20 border-red-500/50';
              
              const textColor = risk.risk_level === 'Baixo' ? 'text-green-300' :
                               risk.risk_level === 'Médio' ? 'text-yellow-300' :
                               risk.risk_level === 'Alto' ? 'text-orange-300' :
                               'text-red-300';
              
              return (
                <div key={risk.risk_level} className={`p-4 rounded-xl border ${bgColor}`}>
                  <div className="text-center">
                    <p className={`text-3xl font-bold mb-2 ${textColor}`}>{risk.count}</p>
                    <p className={`text-sm font-medium mb-1 ${textColor}`}>{risk.risk_level}</p>
                    <p className="text-xs opacity-80 text-blue-200">{risk.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
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
