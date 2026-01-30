'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar se já está logado
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Email ou senha incorretos');
      }

      const data = await response.json();
      
      // Salvar token
      localStorage.setItem('admin_token', data.access_token);
      
      // Redirecionar
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card water-drop glass-shine p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo-map.png"
              alt="MAP Logo"
              width={150}
              height={60}
              priority
              className="drop-shadow-2xl"
            />
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              🔐 Admin Login
            </h1>
            <p className="text-blue-200">
              Painel de Administração
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="mb-6 glass-card border-red-500/50 bg-red-500/10 p-4 rounded-lg">
              <p className="text-red-300 text-center text-sm">⚠️ {error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 glass-card text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="admin@map.com.br"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 glass-card text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-lg
                transition-all duration-300 glass-shine
                ${
                  isLoading
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transform hover:scale-[1.02]'
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Entrando...
                </span>
              ) : (
                '🚀 Entrar'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-blue-300 text-xs">
              © 2025 MAP - Riscos Psicossociais
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/formulario')}
            className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
          >
            ← Voltar para o formulário
          </button>
        </div>
      </div>
    </div>
  );
}
