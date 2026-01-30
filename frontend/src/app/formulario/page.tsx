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
      const formAnswers: FormAnswers = {
        demandas: [],
        controle: [],
        relacionamento: [],
        cargo: [],
        mudanca: [],
        apoio_chefia: [],
        apoio_colegas: []
      };

      QUESTIONS.forEach(q => {
        const answer = answers[q.id];
        if (answer !== undefined) {
          formAnswers[q.dimension][q.index] = answer;
        }
      });

      // Calcular tempo de preenchimento
      const completionTimeSeconds = Math.round((Date.now() - startTime) / 1000);

      // Enviar para o backend
      await submitForm({
        answers: formAnswers,
        completionTimeSeconds,
        userAgent: navigator.userAgent
      });

      // Redirecionar para página de agradecimento
      router.push('/obrigado');
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      setError('Erro ao enviar suas respostas. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-map.png"
              alt="MAP Logo"
              width={60}
              height={60}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Avaliação de Riscos Psicossociais
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Questionário anônimo • 35 perguntas • Escala de 0 a 10
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Barra de progresso geral */}
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <ProgressBar
            current={answeredCount}
            total={QUESTIONS.length}
            label="Progresso Geral"
          />
        </div>

        {/* Instruções */}
        <div className="mb-8 bg-blue-50 border-l-4 border-map-primary rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            📋 Instruções
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-map-primary font-bold">•</span>
              <span>Leia cada afirmação com atenção e escolha um número de <strong>0 a 10</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-map-primary font-bold">•</span>
              <span><strong>0 = NUNCA</strong> (discordo totalmente) | <strong>10 = SEMPRE</strong> (concordo totalmente)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-map-primary font-bold">•</span>
              <span>Suas respostas são <strong>100% anônimas</strong>. Seja honesto(a)!</span>
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
          <div className="mt-8 bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Botão de envio */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-lg
              transition-all duration-200
              ${
                allAnswered && !isSubmitting
                  ? 'bg-map-primary hover:bg-map-primary/90 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
              'Enviar Respostas'
            ) : (
              `Responda todas as perguntas (${answeredCount}/${QUESTIONS.length})`
            )}
          </button>

          {allAnswered && !isSubmitting && (
            <p className="text-center text-sm text-gray-600 mt-3">
              ✅ Todas as perguntas foram respondidas. Clique para enviar!
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Suas respostas são completamente anônimas e confidenciais.</p>
          <p className="mt-1">Desenvolvido por MAP © 2025</p>
        </div>
      </main>
    </div>
  );
}
