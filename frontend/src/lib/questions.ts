// ============================================================================
// QUESTÕES: Riscos Psicossociais MAP
// 35 perguntas distribuídas em 7 dimensões
// ============================================================================

import { Question, Dimension } from '@/types';

export const QUESTIONS: Question[] = [
  // ====================
  // DEMANDAS (8 perguntas)
  // ====================
  {
    id: 1,
    dimension: 'demandas',
    text: 'No trabalho, diferentes grupos exigem de mim, coisas difíceis de conciliar.',
    index: 0
  },
  {
    id: 2,
    dimension: 'demandas',
    text: 'Tenho prazos impossíveis de serem cumpridos.',
    index: 1
  },
  {
    id: 3,
    dimension: 'demandas',
    text: 'Tenho que trabalhar muito intensamente.',
    index: 2
  },
  {
    id: 4,
    dimension: 'demandas',
    text: 'Preciso deixar de lado algumas tarefas porque tenho coisas demais para fazer.',
    index: 3
  },
  {
    id: 5,
    dimension: 'demandas',
    text: 'Não consigo fazer pausas suficientes.',
    index: 4
  },
  {
    id: 6,
    dimension: 'demandas',
    text: 'Sou pressionado para trabalhar por longos períodos.',
    index: 5
  },
  {
    id: 7,
    dimension: 'demandas',
    text: 'Tenho que trabalhar muito rápido.',
    index: 6
  },
  {
    id: 8,
    dimension: 'demandas',
    text: 'Sofro pressões de tempo absurdas.',
    index: 7
  },
  
  // ====================
  // CONTROLE (7 perguntas)
  // ====================
  {
    id: 9,
    dimension: 'controle',
    text: 'Não posso decidir quando posso fazer uma pausa.',
    index: 0
  },
  {
    id: 10,
    dimension: 'controle',
    text: 'Não sei como fazer para executar meu trabalho.',
    index: 1
  },
  {
    id: 11,
    dimension: 'controle',
    text: 'Não posso decidir sobre meu ritmo de trabalho.',
    index: 2
  },
  {
    id: 12,
    dimension: 'controle',
    text: 'Não posso escolher como devo fazer meu trabalho.',
    index: 3
  },
  {
    id: 13,
    dimension: 'controle',
    text: 'Meu horário de trabalho não pode ser flexível.',
    index: 4
  },
  {
    id: 14,
    dimension: 'controle',
    text: 'Não tenho algum poder de decisão sobre a minha maneira de trabalhar.',
    index: 5
  },
  {
    id: 15,
    dimension: 'controle',
    text: 'Não posso escolher o que fazer no trabalho.',
    index: 6
  },
  
  // ====================
  // RELACIONAMENTO (4 perguntas)
  // ====================
  {
    id: 16,
    dimension: 'relacionamento',
    text: 'Estou sujeito a assédio pessoal na forma de palavras ou comportamentos rudes.',
    index: 0
  },
  {
    id: 17,
    dimension: 'relacionamento',
    text: 'Existe atrito ou animosidade entre os colegas de trabalho.',
    index: 1
  },
  {
    id: 18,
    dimension: 'relacionamento',
    text: 'Estou sujeito a constrangimentos no trabalho.',
    index: 2
  },
  {
    id: 19,
    dimension: 'relacionamento',
    text: 'Os relacionamentos no trabalho são tensos.',
    index: 3
  },
  
  // ====================
  // CARGO (4 perguntas)
  // ====================
  {
    id: 20,
    dimension: 'cargo',
    text: 'Não sei claramente o que é esperado de mim no trabalho.',
    index: 0
  },
  {
    id: 21,
    dimension: 'cargo',
    text: 'Não estou ciente quais são meus deveres e responsabilidades.',
    index: 1
  },
  {
    id: 22,
    dimension: 'cargo',
    text: 'Eu não conheço as metas e objetivos do meu departamento.',
    index: 2
  },
  {
    id: 23,
    dimension: 'cargo',
    text: 'Não compreendo como meu trabalho se integra com os objetivos da organização.',
    index: 3
  },
  
  // ====================
  // MUDANÇA (3 perguntas)
  // ====================
  {
    id: 24,
    dimension: 'mudanca',
    text: 'Não tenho oportunidades suficientes para questionar as chefias sobre mudanças no trabalho.',
    index: 0
  },
  {
    id: 25,
    dimension: 'mudanca',
    text: 'A equipe não é sempre consultada sobre mudança no trabalho.',
    index: 1
  },
  {
    id: 26,
    dimension: 'mudanca',
    text: 'Quando ocorrem mudanças no trabalho, não sou esclarecido de como elas funcionam na prática.',
    index: 2
  },
  
  // ====================
  // APOIO CHEFIA (5 perguntas)
  // ====================
  {
    id: 27,
    dimension: 'apoio_chefia',
    text: 'Não posso contar com a ajuda do meu chefe imediato para resolver problemas de trabalho.',
    index: 0
  },
  {
    id: 28,
    dimension: 'apoio_chefia',
    text: 'Não recebo retorno sobre os trabalhos que realizo.',
    index: 1
  },
  {
    id: 29,
    dimension: 'apoio_chefia',
    text: 'Não posso falar com meu chefe algo que me incomodou no trabalho.',
    index: 2
  },
  {
    id: 30,
    dimension: 'apoio_chefia',
    text: 'Não recebo apoio quando realizo trabalho que pode ser emocionalmente desgastante.',
    index: 3
  },
  {
    id: 31,
    dimension: 'apoio_chefia',
    text: 'Meu chefe imediato me desmotiva no trabalho.',
    index: 4
  },
  
  // ====================
  // APOIO COLEGAS (4 perguntas)
  // ====================
  {
    id: 32,
    dimension: 'apoio_colegas',
    text: 'Não recebo ajuda e o apoio necessário dos meus colegas.',
    index: 0
  },
  {
    id: 33,
    dimension: 'apoio_colegas',
    text: 'Não sou respeitado como eu mereço pelos meus colegas.',
    index: 1
  },
  {
    id: 34,
    dimension: 'apoio_colegas',
    text: 'Se o trabalho fica difícil, meus colegas não me ajudam.',
    index: 2
  },
  {
    id: 35,
    dimension: 'apoio_colegas',
    text: 'Meus colegas não estão dispostos a ouvir meus problemas relacionados ao trabalho.',
    index: 3
  }
];

// Utilitários para agrupar perguntas
export const getQuestionsByDimension = (dimension: Dimension): Question[] => {
  return QUESTIONS.filter(q => q.dimension === dimension);
};

export const getQuestionById = (id: number): Question | undefined => {
  return QUESTIONS.find(q => q.id === id);
};

// Labels para dimensões
export const DIMENSION_LABELS: Record<Dimension, string> = {
  demandas: 'Demandas',
  controle: 'Controle',
  relacionamento: 'Relacionamento',
  cargo: 'Cargo',
  mudanca: 'Mudança',
  apoio_chefia: 'Apoio Chefia',
  apoio_colegas: 'Apoio Colegas'
};

// Descrições das dimensões
export const DIMENSION_DESCRIPTIONS: Record<Dimension, string> = {
  demandas: 'Avalia a carga de trabalho, pressões de tempo e intensidade das atividades.',
  controle: 'Mede o nível de autonomia e poder de decisão sobre o próprio trabalho.',
  relacionamento: 'Analisa a qualidade das relações interpessoais no ambiente de trabalho.',
  cargo: 'Verifica a clareza sobre papéis, responsabilidades e objetivos.',
  mudanca: 'Avalia como as mudanças organizacionais são comunicadas e gerenciadas.',
  apoio_chefia: 'Mede o suporte recebido da liderança imediata.',
  apoio_colegas: 'Avalia o apoio e colaboração entre os membros da equipe.'
};
