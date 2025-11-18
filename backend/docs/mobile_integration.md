# Mobile Integration Guide

This file explains how to integrate a mobile UI (native or webview) with the API.

## 1) Authentication

The backend issues JSON Web Tokens for authentication and sets them by default in httpOnly cookies (accessToken, refreshToken).
For regular web frontends this requires the client to use fetch/axios with credentials: 'include' and the server to have FRONTEND_URL set for CORS.

For mobile/native apps that don't use cookies, there are two supported flows:

- Use the header query param opt-in: include the header `x-return-tokens: true` or the query parameter `?returnTokens=true` in the login/register call so the server returns access and refresh tokens in the JSON response. Keep in mind this exposes tokens to JavaScript and should only be used when the client is trusted.

- For refresh, the server will also accept the refresh token via `Authorization: Bearer <token>` if a cookie is not present. This allows native clients to keep using Authorization headers across requests.

## 2) CORS + SameSite cookie behavior

The server allows cross-origin requests based on the FRONTEND_URL env variable. For mobile webview deployments, include the webview origin in the whitelist.

If you plan to use cookies cross-site (native webview, remote domain), ensure cookies are set with `sameSite: 'none'` and `secure: true` in production. The code currently uses `lax` in development for registration and `strict` for login; if you need cross-site cookies, switch to `sameSite: 'none'` in production and enable HTTPS.

## 3) Making authenticated requests

If you use cookies, set fetch/axios options `credentials: 'include'` so cookies are sent.

If you use token-based auth, include `Authorization: Bearer <accessToken>` in each request. The server tries the cookie first and falls back to the header for authentication.

## 4) Add patient to forum endpoint

Routes are available under `/api/forums/:forumId/users` and `/api/forums/:forumId/join`.

The add user endpoint requires `ADD_USER_TO_FORUM` privilege and is protected by RBAC; make sure the logged-in user has that privilege when calling it.

## 5) Ports & environment

- Default server port is `SERVER_PORT` env var (defaults to 3000).
- Make sure your app uses the same API base URL (`VITE_API_URL` in the frontend), and that `FRONTEND_URL` contains the front-end or mobile origin(s) as needed.

### Security note

Returning tokens in JSON is convenient for native/mobile apps, but comes with risks. Only use that flow if the mobile app is trusted and stores tokens securely. Prefer secure, httpOnly cookies where possible.

If you'd like I can add a tiny sample snippet showing a mobile fetch call using this pattern; tell me which mobile stack you use (React Native, Capacitor, Expo, etc.).
