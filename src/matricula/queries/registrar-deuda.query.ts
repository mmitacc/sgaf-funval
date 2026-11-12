import { Prisma } from '../../prisma/generated/prisma/client.js';

export const REGISTRAR_DEUDA_ESTUDIANTE = (
  id_estudiante: number,
  id_grupo: number,
) => Prisma.sql`
  WITH datos_origen AS (
    SELECT 
      g.id_periodo,
      m.mensualidad,
      p.meses
    FROM grupo g
    JOIN materia m ON g.id_materia = m.id AND m.deleted = FALSE
    JOIN periodo p ON g.id_periodo = p.id AND p.deleted = FALSE
    WHERE g.id = ${id_grupo}
      AND g.deleted = FALSE
  )
  UPDATE deuda d
  SET
    total_deuda = d.total_deuda + o.mensualidad*o.meses,
    pendiente   = d.pendiente + o.mensualidad*o.meses,
    deuda_mes   = ROUND((d.pendiente + o.mensualidad*o.meses) / o.meses, 2),
    updated     = NOW()
  FROM datos_origen o
  WHERE d.id_estudiante = ${id_estudiante}
    AND d.id_periodo = o.id_periodo
    AND d.deleted = FALSE
  RETURNING 
    d.total_deuda AS total_acumulado, 
    d.deuda_mes AS mensualidad_calculada;
`;
