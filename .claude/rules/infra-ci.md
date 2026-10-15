---
paths:
  - '.github/**'
  - 'infra/**'
  - '.env.example'
  - '.claude/settings.json'
  - '.claude/hooks/**'
---

# Reglas de infraestructura, CI y configuración de Claude Code

- **Workflows:** cada uno declara `permissions` mínimos (por defecto `contents: read`), usa `persist-credentials: false` y no incluye pasos de push, commit, publicación ni despliegue. Las acciones se fijan por SHA de commit completo, con la versión en un comentario, y la versión se verifica en el repositorio oficial ([ADR 0012](../../docs/decisions/0012-calidad-configuracion-ci.md)).
- **Compose:** los puertos se exponen solo en `127.0.0.1` y las imágenes llevan una versión exacta. `infra:down` no borra volúmenes, y borrarlos requiere aprobación.
- **Secretos:** van solo en `.env`, que no se versiona. `.env.example` lleva marcadores (`CAMBIAR`), nunca valores reales.
- **Claude Code:** un cambio en `.claude/settings.json` o en los hooks no puede debilitar las protecciones sin aprobación explícita: ni sacar reglas `deny`, ni ampliar `allow`, ni desactivar el hook. Después de cambiar el hook, correr `npm run test:hooks` y actualizar [docs/claude-code.md](../../docs/claude-code.md).
