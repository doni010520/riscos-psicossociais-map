'use client';

import React from 'react';
import { DimensionHeaderProps } from '@/types';
import { DIMENSION_DESCRIPTIONS } from '@/lib/questions';

export function DimensionHeader({ dimension, isExpanded, onToggle }: DimensionHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-map-primary to-map-secondary rounded-lg shadow-md overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:opacity-90 transition-opacity"
      >
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">
            {dimension.label}
          </h3>
          <p className="text-sm text-white/80">
            {DIMENSION_DESCRIPTIONS[dimension.name]}
          </p>
          <p className="text-xs text-white/60 mt-1">
            {dimension.questionCount} perguntas • Pontuação máxima: {dimension.maxScore}
          </p>
        </div>

        {/* Ícone de expandir/colapsar */}
        <div className="ml-4">
          <svg
            className={`w-6 h-6 text-white transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Barra de progresso da dimensão */}
      {isExpanded && (
        <div className="px-6 pb-4">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
