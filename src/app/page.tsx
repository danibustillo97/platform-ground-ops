// app/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
  const router = useRouter();

  return <div>Home</div>;
};

export default HomePage;
