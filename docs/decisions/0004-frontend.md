# ADR 0004 — Frontend: Next.js 16, Tailwind CSS 4 y ECharts

- **Estado:** Recomendada (desvío menor de D4: Next.js 14 → 16)
- **Fecha:** 2026-10-14
- **Requisitos:** RA-001, RF-047, RF-060, RF-061, RNF-014, RNF-016

## Contexto

D4 §13.1 especifica Next.js 14, React, Tailwind y D3.js / ECharts. Según nextjs.org/support-policy (consultado el 2026-10-14), **Next.js 14.x no tiene soporte**; 16.x es *Active LTS* y 15.x *Maintenance LTS*. La versión publicada en npm es 16.4.1.

## Alternativas

| Alternativa | Comentario |
|---|---|
| Next.js 14 (lo que dice D4) | Sin parches de seguridad; contradice RA-002 |
| **Next.js 16** | Soporte activo, React 19.3; misma familia tecnológica que D4 |
| Vite + React (SPA) | Más simple, pero se aparta de D4 |

Para gráficos: D3 (máxima flexibilidad, pero cada gráfico se programa desde cero) o **ECharts 6** (incluye velocímetro y mapa de calor). D4 menciona ambas, así que elegir una cumple el documento.

## Decisión

Next.js 16 (App Router), Tailwind CSS 4 y ECharts 6. La identidad visual se toma de D16: colores Rubí #A50F26, Tinta #121212, Hueso #ECE8E1 y Papel #F6F4EF; tipografías Anton, Instrument Serif, Inter y Space Mono.

## Reversibilidad

ECharts → D3: costo bajo, se cambia por gráfico. Next.js → otro framework: costo medio.

## Impacto en la documentación aprobada

| Documento | Qué cambia |
|---|---|
| D4 §13.1, figura de arquitectura y diagrama de despliegue (D9) | "Next.js 14" pasa a "Next.js 16" (14.x no tiene soporte) |
| D4 §4.1 y §5.2.1 | "React/Next.js + D3.js": en el prototipo los gráficos se hacen con ECharts, que D4 §13.1 ya menciona como alternativa |
