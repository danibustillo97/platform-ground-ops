import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    
    if (!token) {
        // Redirigir a la página de inicio de sesión si no hay token
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    // Continuar con la solicitud
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
