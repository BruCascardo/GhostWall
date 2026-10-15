# Requisitos de GhostWall

Esta carpeta organiza los requisitos extraídos de la documentación funcional del proyecto. **No reemplaza a los documentos originales**: ante cualquier diferencia, prevalece el documento fuente citado.

| Archivo | Contenido |
|---|---|
| [catalog.md](catalog.md) | Catálogo de requisitos con identificadores estables (RA, RF, RNF, OBJ) |
| [ambiguities.md](ambiguities.md) | Contradicciones, ambigüedades y preguntas abiertas (AMB, P) |
| [traceability.md](traceability.md) | Matriz requisito → prueba automatizada prevista |

## Estado de aprobación de las fuentes

> **Pendiente (P1):** el equipo todavía no confirmó qué documentos aprobó el profesor. La 3ª entrega vence el 26/10/2026 según D1, aunque el historial de versiones de D4 la declara "Versión Final" el 08/09/2026. Mientras P1 siga abierta, todo requisito que solo figure en D4 (secciones 8 a 14) debe considerarse **sujeto a confirmación**.

## Inventario de fuentes

Rutas relativas a esta carpeta. Las secciones 1 a 7 de D2, D3 y D4 tienen el mismo contenido (verificado por comparación de texto; solo cambia el formato), por lo que el catálogo cita a D4 para esas secciones.

| ID | Documento | Aporta | Autoridad |
|---|---|---|---|
| D1 | [cronograma_proyecto_2026.pdf](<../Cosas Generales/cronograma_proyecto_2026.pdf>) | Normas de la cátedra, fechas y requisitos obligatorios | Máxima (cátedra) |
| D2 | [E1 - V3](<../1er Entrega/E1 - V3 - Proyecto Final - Cascardo, Giacomelli, Munné.docx>) | Secciones 1–4 | Supuesta aprobada (P1) |
| D3 | [E2 - V6](<../2da Entrega/E2 - V6 - Proyecto Final - Cascardo, Giacomelli, Munné.docx>) | Secciones 1–7 y anexos | Supuesta aprobada (P1) |
| D4 | [E3-V4](<../3er Entrega/E3-V4-Proyecto Final Cascardo Giacomelli Munné.docx>) | Secciones 1–14: datos, casos de uso CUU01–CUU09, metodología, tamaño, riesgos, diseño, UML | **Estado desconocido (P1)** |
| D5 | [Casos de Uso (Planilla Completa)_2](<../Artefactos/GhostWall - Casos de Uso (Planilla Completa)_2.docx>) | Fichas CUR, CRE, CUU01–CUU07 v2.02 | Superada por D4 (AMB-36) |
| D6 | [Casos de Uso.docx](<../Artefactos/Casos de Uso.docx>) | Borrador v1.00 | Excluida (AMB-35) |
| D7 | [Listado de Casos de Uso](<../Artefactos/GhostWall - Listado de Casos de Uso.docx>) | Lista sin CUU08/CUU09 | Superada por D4 |
| D8 | [GhostWall_DER.drawio](../Artefactos/GhostWall_DER.drawio) | Fuente editable del DER | Complementa D4 (ver AMB-25) |
| D9 | [Diagramas UML.drawio](<../Artefactos/GhostWall - Diagramas UML.drawio>) | Fuente de los diagramas de D4 §14 | Complementa D4 |
| D10 | [OrganigramaGhostWall.drawio](../Artefactos/OrganigramaGhostWall.drawio) | Organigrama | Igual a D4 §1.3 |
| D11 | [Gantt_GhostWall_2026.xlsx](../Artefactos/Gantt_GhostWall_2026.xlsx) | Gantt preliminar (E1) | Planificación |
| D12 | [Gantt_GhostWall_Sistema_2026.xlsx](../Artefactos/Gantt_GhostWall_Sistema_2026.xlsx) | Gantt de D4 §11 | Planificación |
| D13 | [AbstractGhostWall.pdf](<../Cosas Generales/AbstractGhostWall.pdf>) | Abstract presentado | Contexto |
| D14 | [GhostWall 2.pdf](<../Cosas Generales/GhostWall 2.pdf>) | "Versión ampliada" dirigida a un autor en segunda persona | Excluida (AMB-35) |
| D15 | [Puesta en sociedad.pptx](<../Cosas Generales/GhostWall_Puesta_en_sociedad.pptx>) | Presentación resumen | Contexto |
| D16 | [Brand board.pptx](<../Cosas Generales/GhostWall-Brand-board.pptx>) | Colores y tipografías | Guía visual de la interfaz |
| D17 | [Documento sin título.docx](<../Artefactos/Documento sin título.docx>) | Instrucción dirigida a una herramienta de IA; no es documentación | Excluida (AMB-35) |

## Convenciones

- **Identificadores estables.** Un ID nunca se reutiliza ni se renumera. Si un requisito se elimina, se marca *Retirado* y se conserva la fila.
- **Prefijos:** `RA` restricción académica, `RF` funcional, `RNF` no funcional, `OBJ` objetivo de negocio (no verificable en el prototipo), `AMB` ambigüedad o contradicción, `P` pregunta abierta, `T-` prueba prevista.
- **Citas:** `D4 §8.2.1` es la sección de un documento; `CUU02 p4` es el paso 4 del camino básico de la ficha del caso de uso en D4 §8.4; `RN2` es la regla de negocio 2 de esa ficha; `4.a` es un camino alternativo.
- **Estados:** `C` explícito en la fuente; `C/A` explícito pero afectado por una ambigüedad registrada.
- Ninguna fila del catálogo es una recomendación técnica. Las recomendaciones están en [../decisions/](../decisions/README.md).
