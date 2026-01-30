// ============================================================================
// SUPABASE CLIENT
// ============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// API CLIENT FUNCTIONS
// ============================================================================

import { FormSubmission, SubmissionResponse } from '@/types';

export const submitForm = async (data: FormSubmission): Promise<SubmissionResponse> => {
  const { data: response, error } = await supabase
    .from('responses')
    .insert({
      answers: data.answers,
      completion_time_seconds: data.completionTimeSeconds,
      user_agent: data.userAgent || navigator.userAgent,
      ip_address: '0.0.0.0' // Backend pega o IP real
    })
    .select('id, submitted_at')
    .single();

  if (error) throw error;

  return {
    id: response.id,
    message: 'Formulário enviado com sucesso!',
    submittedAt: response.submitted_at
  };
};

// Log de acesso
export const logAccess = async (action: string, metadata?: any) => {
  await supabase
    .from('access_log')
    .insert({
      action,
      metadata,
      ip_address: '0.0.0.0' // Backend pega o IP real
    });
};
