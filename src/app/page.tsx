"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";  // Cambio aquí

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return null;
};

export default HomePage;
