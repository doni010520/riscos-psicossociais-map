'use client';

import React from 'react';
import { ProgressBarProps } from '@/types';

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      {/* Label e porcentagem - TEXTO BRANCO */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-white">
          {label || 'Progresso'}
        </span>
        <span className="text-sm font-bold text-blue-300">
          {current}/{total} ({percentage}%)
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        >
          {/* Animação de brilho sutil */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-25"></div>
        </div>
      </div>

      {/* Milestone visual */}
      {percentage === 100 && (
        <div className="mt-2 text-sm text-green-300 font-medium flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Todas as perguntas respondidas!
        </div>
      )}
    </div>
  );
}
