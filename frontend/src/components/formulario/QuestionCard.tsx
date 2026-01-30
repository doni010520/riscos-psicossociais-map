'use client';

import React from 'react';
import { QuestionCardProps } from '@/types';

export function QuestionCard({ question, value, onChange, disabled = false }: QuestionCardProps) {
  const handleClick = (score: number) => {
    if (!disabled) {
      onChange(score);
    }
  };

  return (
    <div className="glass-card water-drop p-6 hover:bg-white/10 transition-all">
      {/* Texto da pergunta */}
      <div className="mb-6">
        <p className="text-base font-medium text-white leading-relaxed">
          {question.id}. {question.text}
        </p>
      </div>

      {/* Escala de 0 a 10 */}
      <div className="space-y-4">
        {/* Labels */}
        <div className="flex justify-between text-sm font-medium text-blue-200">
          <span className="text-green-300">Nunca</span>
          <span className="text-yellow-300">Às Vezes</span>
          <span className="text-red-300">Sempre</span>
        </div>

        {/* Botões de 0 a 10 */}
        <div className="flex gap-2 justify-between">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => handleClick(score)}
              disabled={disabled}
              className={`
                flex items-center justify-center w-10 h-10 rounded-lg font-semibold
                transition-all duration-200 border-2
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'}
                ${
                  value === score
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/50 scale-110'
                    : 'bg-white/10 text-blue-200 border-white/20 hover:border-blue-400 hover:bg-white/20'
                }
              `}
            >
              {score}
            </button>
          ))}
        </div>

        {/* Indicador visual da escala */}
        <div className="h-2 rounded-full bg-gradient-to-r from-green-500/30 via-yellow-500/30 to-red-500/30"></div>
      </div>

      {/* Feedback visual quando respondida */}
      {value !== null && !disabled && (
        <div className="mt-4 text-sm text-green-300 font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Respondida
        </div>
      )}
    </div>
  );
}
