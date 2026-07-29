import React from 'react';

export interface AgencyInfo {
  name: string;
  color: string;
  bg: string;
  desc: string;
}

export const CATALOGO_AGENCIES: AgencyInfo[] = [
  { name: 'STARKEN',        color: '#00843D', bg: '#e6f4ea', desc: 'Económico · Cobertura nacional' },
  { name: 'PULLMAN CARGO',  color: '#00205B', bg: '#e6ecf5', desc: 'Económico · Ideal cajas grandes' },
  { name: 'VARMONTT',       color: '#c62828', bg: '#fdeaea', desc: 'Económico · Especialistas zona sur' },
  { name: 'BLUEXPRESS',     color: '#0057B8', bg: '#e5effb', desc: 'Rápido · Cobertura nacional' },
  { name: 'CHILEXPRESS',    color: '#E4002B', bg: '#fdeaee', desc: 'Rápido · Cobertura nacional' },
  { name: 'RETIRO EN TIENDA', color: '#7c3aed', bg: '#f3effe', desc: 'Retiro en Toesca 2537, Santiago' },
];

/**
 * Marca visual (tipo "logo") de cada agencia. No usa las marcas registradas
 * reales — es un emblema propio (glifo de envío + wordmark) en los colores
 * corporativos de cada courier, para que sea reconocible y a la vez seguro.
 */
export function AgencyLogo({ name, color, size = 26 }: { name: string; color: string; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const, 'aria-hidden': true };

  switch (name) {
    case 'STARKEN':
      // Estrella (star-ken)
      return (
        <svg {...common}>
          <path d="M12 3l2.6 5.27 5.82.85-4.21 4.1.99 5.79L12 16.9l-5.2 2.73.99-5.79-4.21-4.1 5.82-.85L12 3z"
            fill={color} />
        </svg>
      );
    case 'PULLMAN CARGO':
      // Camión de carga
      return (
        <svg {...common}>
          <path d="M3 6h10v9H3z" fill={color} opacity="0.9" />
          <path d="M13 9h4l3 3v3h-7z" fill={color} opacity="0.6" />
          <circle cx="7" cy="17" r="2" fill={color} />
          <circle cx="17" cy="17" r="2" fill={color} />
        </svg>
      );
    case 'VARMONTT':
      // Flecha veloz hacia el sur
      return (
        <svg {...common}>
          <path d="M5 5h9l5 7-5 7H5l5-7-5-7z" fill={color} />
        </svg>
      );
    case 'BLUEXPRESS':
      // Rayo de rapidez
      return (
        <svg {...common}>
          <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={color} />
        </svg>
      );
    case 'CHILEXPRESS':
      // Avión / envío exprés
      return (
        <svg {...common}>
          <path d="M21 4L3 11l6 2 2 6 3-4 5 5 2-16z" fill={color} />
        </svg>
      );
    case 'RETIRO EN TIENDA':
      // Tienda física
      return (
        <svg {...common}>
          <path d="M4 4h16l1 5a3 3 0 01-6 0 3 3 0 01-6 0 3 3 0 01-6 0l1-5z" fill={color} opacity="0.75" />
          <path d="M5 11v9h5v-5h4v5h5v-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M3 7h13v7H3z" fill={color} />
          <circle cx="7" cy="16" r="1.8" fill={color} />
          <circle cx="15" cy="16" r="1.8" fill={color} />
        </svg>
      );
  }
}
