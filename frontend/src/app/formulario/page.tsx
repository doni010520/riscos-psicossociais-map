'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { QuestionCard } from '@/components/formulario/QuestionCard';
import { ProgressBar } from '@/components/formulario/ProgressBar';
import { DimensionHeader } from '@/components/formulario/DimensionHeader';
import { QUESTIONS, getQuestionsByDimension } from '@/lib/questions';
import { submitForm, logAccess } from '@/lib/supabase';
import { FormAnswers, Dimension } from '@/types';
import { DIMENSIONS } from '@/types';

export default function FormularioPage() {
  const router = useRouter();
  const [startTime] = useState(Date.now());
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [expandedDimension, setExpandedDimension] = useState<Dimension>('demandas');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Log de acesso ao formulário
  useEffect(() => {
    logAccess('form_view');
  }, []);

  // Atualizar resposta
  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Verificar se todas as perguntas foram respondidas
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  // Submeter formulário
  const handleSubmit = async () => {
    if (!allAnswered) {
      setError('Por favor, responda todas as perguntas antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Organizar respostas por dimensão
      const dimensionAnswers: FormAnswers = {
        demandas: [],
        controle: [],
        relacionamento: [],
        cargo: [],
        mudanca: [],
        apoio_chefia: [],
        apoio_colegas: [],
      };

      QUESTIONS.forEach((question) => {
        const answer = answers[question.id];
        if (answer !== undefined) {
          dimensionAnswers[question.dimension].push(answer);
        }
      });

      // Calcular tempo de preenchimento
      const completionTime = Math.floor((Date.now() - startTime) / 1000);

      // Enviar para API
      await submitForm({
        answers: dimensionAnswers,
        completionTimeSeconds: completionTime,
        userAgent: navigator.userAgent
      });

      // Log de conclusão
      await logAccess('form_completion');

      // Redirecionar para página de agradecimento
      router.push('/obrigado');
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      setError('Erro ao enviar o formulário. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header - SEM water-drop */}
      <header className="glass-card mb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-map.png"
              alt="MAP Logo"
              width={60}
              height={60}
              className="rounded-lg drop-shadow-2xl"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">
                Avaliação de Riscos Psicossociais
              </h1>
              <p className="text-sm text-blue-200 mt-1">
                Questionário anônimo • 35 perguntas • Escala de 0 a 10
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Barra de progresso geral */}
        <div className="mb-8 glass-card p-6">
          <ProgressBar
            current={answeredCount}
            total={QUESTIONS.length}
            label="Progresso Geral"
          />
        </div>

        {/* Instruções */}
        <div className="mb-8 glass-card border-l-4 border-blue-500 p-6">
          <h2 className="text-lg font-semibold text-white mb-2">
            📋 Instruções
          </h2>
          <ul className="space-y-2 text-sm text-blue-200">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Leia cada afirmação com atenção e escolha um número de <strong className="text-white">0 a 10</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span><strong className="text-white">0 = NUNCA</strong> (discordo totalmente) | <strong className="text-white">10 = SEMPRE</strong> (concordo totalmente)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Suas respostas são <strong className="text-white">100% anônimas</strong>. Seja honesto(a)!</span>
            </li>
          </ul>
        </div>

        {/* Perguntas agrupadas por dimensão */}
        <div className="space-y-6">
          {DIMENSIONS.map((dimension) => {
            const dimensionQuestions = getQuestionsByDimension(dimension.name);
            const isExpanded = expandedDimension === dimension.name;

            return (
              <div key={dimension.name} className="space-y-4">
                <DimensionHeader
                  dimension={dimension}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedDimension(
                    isExpanded ? 'demandas' : dimension.name
                  )}
                />

                {isExpanded && (
                  <div className="space-y-4 animate-fadeIn">
                    {dimensionQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        value={answers[question.id] ?? null}
                        onChange={(value) => handleAnswerChange(question.id, value)}
                        disabled={isSubmitting}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-8 glass-card border-l-4 border-red-500 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Botão de envio - SEM water-drop */}
        <div className="mt-8 glass-card p-6">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className={`
              w-full py-4 px-6 rounded-xl font-semibold text-lg
              transition-all duration-300
              ${
                allAnswered && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transform hover:scale-[1.02]'
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando...
              </span>
            ) : allAnswered ? (
              '🚀 Enviar Respostas'
            ) : (
              `⏳ Responda todas as perguntas (${answeredCount}/${QUESTIONS.length})`
            )}
          </button>

          {allAnswered && !isSubmitting && (
            <p className="text-center text-sm text-green-300 mt-3">
              ✅ Todas as perguntas foram respondidas. Clique para enviar!
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-blue-200">
          <p>🔒 Suas respostas são completamente anônimas e confidenciais.</p>
          <p className="mt-1">Desenvolvido por MAP © 2025</p>
        </div>
      </main>
    </div>
  );
}
