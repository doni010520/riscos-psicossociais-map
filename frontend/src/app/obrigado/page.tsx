'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ObrigadoPage() {
  const router = useRouter();

  useEffect(() => {
    // Prevenir volta ao formulário
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-map-primary to-map-secondary px-8 py-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-full p-6 shadow-lg">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Obrigado pela sua participação!
            </h1>
            <p className="text-lg text-white/90">
              Suas respostas foram enviadas com sucesso
            </p>
          </div>

          {/* Conteúdo */}
          <div className="px-8 py-10">
            <div className="space-y-6">
              {/* Mensagem principal */}
              <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-green-900 mb-2">
                  ✅ Formulário enviado com sucesso!
                </h2>
                <p className="text-sm text-green-800">
                  Sua contribuição é muito importante para promovermos um ambiente de trabalho
                  mais saudável e produtivo para todos.
                </p>
              </div>

              {/* Informações */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-map-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-map-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      100% Anônimo
                    </h3>
                    <p className="text-sm text-gray-600">
                      Suas respostas são completamente anônimas e não podem ser rastreadas até você.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-map-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-map-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Análise em Andamento
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sua resposta será incluída na análise geral que ajudará a identificar áreas de melhoria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-map-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-map-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Obrigado por Contribuir
                    </h3>
                    <p className="text-sm text-gray-600">
                      Sua participação demonstra comprometimento com a melhoria contínua do ambiente de trabalho.
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Logo MAP */}
              <div className="flex justify-center">
                <Image
                  src="/logo-map.png"
                  alt="MAP Logo"
                  width={80}
                  height={80}
                  className="rounded-lg opacity-80"
                />
              </div>

              {/* Footer text */}
              <p className="text-center text-sm text-gray-500">
                Desenvolvido por MAP © 2025
                <br />
                Promovendo ambientes de trabalho mais saudáveis
              </p>
            </div>
          </div>
        </div>

        {/* Mensagem adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Você pode fechar esta janela agora
          </p>
        </div>
      </div>
    </div>
  );
}
