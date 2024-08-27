import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const router = useRouter();
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

    useEffect(() => {
        if (!token) {
            router.push("/login");
        } else {
            window.history.pushState(null, "", window.location.href);
            window.onpopstate = () => {
                window.history.go(1);
            };
        }
    }, [token, router]);

    return <>{token ? children : null}</>;
};

export default ProtectedRoute;
