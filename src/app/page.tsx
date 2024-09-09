// app/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  return <div>Home</div>;
};

export default HomePage;
