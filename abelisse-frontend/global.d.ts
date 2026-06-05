// ===============================
// Tipos globales para archivos
// ===============================

// Imágenes
declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.gif" {
  const value: string;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}

// SVG (solo UNA declaración, la correcta)
declare module "*.svg" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

// Videos
declare module "*.mp4" {
  const value: string;
  export default value;
}

declare module "*.webm" {
  const value: string;
  export default value;
}

declare module "*.ogg" {
  const value: string;
  export default value;
}
