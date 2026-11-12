import { Prisma } from '../../prisma/generated/prisma/client.js';

export const VALIDATE_MATRICULA_ESTUDIANTE = (
  id_estudiante: number,
  id_grupo: number,
) => Prisma.sql`
WITH
-- 1. Verifica que el grupo, materia y periodo existan y estén activos
grupo_objetivo AS (
  SELECT 
    g.id AS id_grupo,
    g.id_periodo,
    g.id_materia,
    g.capacidad,
    m.creditos,
    p.max_creditos
  FROM grupo g
  JOIN materia m ON g.id_materia = m.id AND m.deleted = FALSE
  JOIN periodo p ON g.id_periodo = p.id AND p.deleted = FALSE
  WHERE g.id = ${id_grupo}
    AND g.deleted = FALSE
  FOR UPDATE OF g -- Bloquea la fila del grupo brevemente para evitar sobrecupo simultáneo
),
val_capacidad AS (
  SELECT 
    COALESCE(
      COUNT(m.id) >= (SELECT capacidad FROM grupo_objetivo),
      TRUE -- Si el grupo no existe, bloquea por seguridad
    ) AS cupo_lleno
  FROM matricula m
  WHERE m.id_grupo = ${id_grupo}
    AND m.deleted = FALSE
),
val_creditos AS (
  SELECT 
    COALESCE(
      (COALESCE(SUM(mat.creditos), 0) + (SELECT creditos FROM grupo_objetivo)) > (SELECT max_creditos FROM grupo_objetivo),
      TRUE
    ) AS creditos_superados
  FROM matricula m
  JOIN grupo g ON m.id_grupo = g.id AND g.deleted = FALSE
  JOIN materia mat ON g.id_materia = mat.id AND mat.deleted = FALSE
  WHERE m.id_estudiante = ${id_estudiante} 
    AND m.deleted = FALSE
    AND g.id_periodo = (SELECT id_periodo FROM grupo_objetivo)
),
val_materia_duplicada AS (
  SELECT 
    EXISTS (
      SELECT 1 
      FROM matricula m
      JOIN grupo g ON m.id_grupo = g.id AND g.deleted = FALSE
      WHERE m.id_estudiante = ${id_estudiante}
        AND m.deleted = FALSE
        AND g.id_periodo = (SELECT id_periodo FROM grupo_objetivo)
        AND g.id_materia = (SELECT id_materia FROM grupo_objetivo)
    ) AS materia_ya_inscrita
),
val_traslape AS (
  SELECT 
    EXISTS (
      SELECT 1 
      FROM horario h_nuevo
      JOIN horario h_existente ON h_nuevo.dia = h_existente.dia AND h_existente.deleted = FALSE
      JOIN matricula m ON h_existente.id_grupo = m.id_grupo AND m.deleted = FALSE
      JOIN grupo g ON m.id_grupo = g.id AND g.deleted = FALSE
      WHERE h_nuevo.id_grupo = ${id_grupo}
        AND h_nuevo.deleted = FALSE
        AND m.id_estudiante = ${id_estudiante}
        AND g.id_periodo = (SELECT id_periodo FROM grupo_objetivo)
        AND h_nuevo.hora_inicio < h_existente.hora_fin
        AND h_nuevo.hora_fin > h_existente.hora_inicio
    ) AS horario_traslapado
),
evaluacion_reglas AS (
  SELECT 
    EXISTS (SELECT 1 FROM grupo_objetivo) AS grupo_valido,
    (SELECT cupo_lleno FROM val_capacidad) AS error_capacidad,
    (SELECT creditos_superados FROM val_creditos) AS error_creditos,
    (SELECT materia_ya_inscrita FROM val_materia_duplicada) AS error_materia,
    (SELECT horario_traslapado FROM val_traslape) AS error_horario
),
-- 2. Inserta o reactiva la matrícula si fue eliminada lógicamente antes
insercion AS (
  INSERT INTO matricula (id_estudiante, id_grupo, deleted, deletedate, updated)
  SELECT ${id_estudiante}, ${id_grupo}, FALSE, NULL, NOW()
  FROM evaluacion_reglas
  WHERE grupo_valido = TRUE
    AND error_capacidad = FALSE 
    AND error_creditos = FALSE 
    AND error_materia = FALSE 
    AND error_horario = FALSE
  ON CONFLICT (id_estudiante, id_grupo) 
  DO UPDATE SET 
    deleted = FALSE,
    deletedate = NULL,
    updated = NOW()
  RETURNING id
)
SELECT 
  i.id AS id_matricula_creada,
  e.grupo_valido,
  e.error_capacidad,
  e.error_creditos,
  e.error_materia,
  e.error_horario
FROM evaluacion_reglas e
LEFT JOIN insercion i ON TRUE;
`;
