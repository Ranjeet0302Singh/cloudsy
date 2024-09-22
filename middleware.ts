import { clerkMiddleware ,createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])


/**
 * Middleware function to handle authentication and route redirection.
 *
 * @param {Object} auth - The authentication object.
 * @param {Function} auth.userId - Function to get the user ID.
 * @param {Object} req - The request object.
 * @param {string} req.url - The URL of the request.
 *
 * @returns {NextResponse} - Redirects to appropriate routes based on authentication and route type.
 *
 * The middleware performs the following checks:
 * - If the user is authenticated and the route is public but not the home page, redirect to the home page.
 * - If the user is not authenticated:
 *   - If the route is not public and not a public API route, redirect to the sign-in page.
 *   - If the route is an API route and not a public API route, redirect to the sign-in page.
 */
export default clerkMiddleware((auth,req)=>{
    const {userId} = auth();
    const currenturl =new URL (req.url);
    const isHomePage = currenturl.pathname === "/home";
    const isApiRoute = currenturl.pathname.startsWith("/api");

    if (userId && isPublicRoute(req) && !isHomePage){
        return NextResponse.redirect(new URL("/home",req.url));
    }
    if(!userId ){
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL ("/sign-in",req.url));
        }
        if(isApiRoute && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/sign-in",req.url));
        }
    }
    return NextResponse.next();

});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"],
};