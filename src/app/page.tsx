"use client"; // Marca el componente como Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login'); // Redirige a la página de inicio de sesión
  }, [router]);

  return null; // No renderiza nada
};

export default HomePage;
