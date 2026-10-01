import { Prisma } from '../../prisma/generated/prisma/client.js';

export const VALIDATE_MATRICULA_ESTUDIANTE = (
  id_estudiante: number,
  id_grupo: number,
) => Prisma.sql`
WITH
grupo_objetivo AS (
  SELECT 
    g.id AS id_grupo,
    g.id_periodo,
    g.id_materia,
    g.capacidad,
    m.creditos,
    p.max_creditos
  FROM grupo g
  JOIN materia m ON g.id_materia = m.id
  JOIN periodo p ON g.id_periodo = p.id
  WHERE g.id = ${id_grupo}
),
val_capacidad AS (
  SELECT 
    CASE 
      WHEN COUNT(m.id) >= (SELECT capacidad FROM grupo_objetivo) THEN TRUE 
      ELSE FALSE 
    END AS cupo_lleno
  FROM matricula m
  WHERE m.id_grupo = ${id_grupo}
),
val_creditos AS (
  SELECT 
    CASE 
      WHEN (COALESCE(SUM(mat.creditos), 0) + (SELECT creditos FROM grupo_objetivo)) > (SELECT max_creditos FROM grupo_objetivo) THEN TRUE
      ELSE FALSE
    END AS creditos_superados
  FROM matricula m
  JOIN grupo g ON m.id_grupo = g.id
  JOIN materia mat ON g.id_materia = mat.id
  WHERE m.id_estudiante = ${id_estudiante} 
    AND g.id_periodo = (SELECT id_periodo FROM grupo_objetivo)
),
val_materia_duplicada AS (
  SELECT 
    EXISTS (
      SELECT 1 
      FROM matricula m
      JOIN grupo g ON m.id_grupo = g.id
      WHERE m.id_estudiante = ${id_estudiante}
        AND g.id_periodo = (SELECT id_periodo FROM grupo_objetivo)
        AND g.id_materia = (SELECT id_materia FROM grupo_objetivo)
    ) AS materia_ya_inscrita
),
val_traslape AS (
  SELECT 
    EXISTS (
      SELECT 1 
      FROM horario h_nuevo
      JOIN horario h_existente ON h_nuevo.dia = h_existente.dia
      JOIN matricula m ON h_existente.id_grupo = m.id_grupo
      JOIN grupo g ON m.id_grupo = g.id
      WHERE h_nuevo.id_grupo = ${id_grupo}
        AND m.id_estudiante = ${id_estudiante}
        AND g.id_periodo = (SELECT id_periodo FROM grupo_objetivo)
        AND h_nuevo.hora_inicio < h_existente.hora_fin
        AND h_nuevo.hora_fin > h_existente.hora_inicio
    ) AS horario_traslapado
),
evaluacion_reglas AS (
  SELECT 
    (SELECT cupo_lleno FROM val_capacidad) AS error_capacidad,
    (SELECT creditos_superados FROM val_creditos) AS error_creditos,
    (SELECT materia_ya_inscrita FROM val_materia_duplicada) AS error_materia,
    (SELECT horario_traslapado FROM val_traslape) AS error_horario
),
insercion AS (
  INSERT INTO matricula (id_estudiante, id_grupo, updated)
  SELECT ${id_estudiante}, ${id_grupo}, NOW()
  FROM evaluacion_reglas
  WHERE error_capacidad = FALSE 
    AND error_creditos = FALSE 
    AND error_materia = FALSE 
    AND error_horario = FALSE
  RETURNING id
)
SELECT 
  i.id AS id_matricula_creada,
  e.error_capacidad,
  e.error_creditos,
  e.error_materia,
  e.error_horario
FROM evaluacion_reglas e
LEFT JOIN insercion i ON TRUE;`;
