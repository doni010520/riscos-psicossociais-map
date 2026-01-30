import { redirect } from 'next/navigation';

export default function Home() {
  // Redirecionar automaticamente para o formulário
  redirect('/formulario');
}
