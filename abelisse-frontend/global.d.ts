// ===============================
// Tipos globales para ABELISSE
// ===============================

// Archivos CSS
declare module "*.css";
declare module "*.scss";
declare module "*.sass";

// Imágenes
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.webp";
declare module "*.svg" {
  const content: any;
  export default content;
}

// Videos
declare module "*.mp4";
declare module "*.webm";

// JSON
declare module "*.json";

// ===============================
// Variables de entorno
// ===============================
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BACKEND_URL: string;
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY: string;
    NEXT_PUBLIC_PAYPAL_CLIENT_ID?: string;
  }
}
