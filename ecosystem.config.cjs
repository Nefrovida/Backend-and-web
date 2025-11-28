module.exports = {
  apps: [
    {
      name: "Nefrovida-Backend",
      script: "backend/src/index.ts",
      interpreter: "tsx",
      watch: ["src"],
      env: {
        SERVER_PORT: 3001,
        VITE_APP_API_URL: "http://localhost:3001/api",
        DATABASE_URL: "db",
        SECRET: "secret",
      },
    },
    {
      name: "Nefrovida-Frontend",
      script: "serve",
      watch: ["src"],
      env: {
        PM2_SERVE_PATH: "frontend/dist",
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: "true",
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
