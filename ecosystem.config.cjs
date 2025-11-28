module.exports = {
  apps: [
    {
      name: "Nefrovida-Backend",
      script: "backend/dist/index.js",
      interpreter: "node",
      watch: ["src"],
      env: {
        SERVER_PORT: 3001,
        VITE_APP_API_URL: "http://localhost:3001/api",
        DATABASE_URL:
          "postgresql://santi:santialdu1@localhost:5432/vitalsoft_db?schema=public",
        SECRET:
          "A veces, la mente recibe un golpe tan brutal que se esconde en la demencia. Puede parecer que eso no sea beneficioso, pero lo es. A veces, la realidad es solo dolor, y para huir de ese dolor, la mente tiene que abandonar la realidad",
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
        VITE_APP_API_URL: "http://localhost:3001/api",
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
