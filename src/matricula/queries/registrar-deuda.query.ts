import { Prisma } from '../../prisma/generated/prisma/client.js';

export const REGISTRAR_DEUDA_ESTUDIANTE = (
  id_estudiante: number,
  id_grupo: number,
) => Prisma.sql`
  WITH 
  datos_origen AS (
    SELECT 
      g.id_periodo,
      m.mensualidad,
      p.meses
    FROM grupo g
    JOIN materia m ON g.id_materia = m.id
    JOIN periodo p ON g.id_periodo = p.id
    WHERE g.id = ${id_grupo}
  ),
  gestion_deuda AS (
    INSERT INTO deuda (
      id_estudiante, 
      id_periodo, 
      total_deuda, 
      pendiente, 
      deuda_mes, 
      moroso,
      updated
    )
    SELECT 
      ${id_estudiante},
      id_periodo,
      mensualidad AS total_deuda,
      mensualidad AS pendiente,
      (mensualidad / meses) AS deuda_mes,
      FALSE AS moroso,
      NOW() AS updated
    FROM datos_origen  
    ON CONFLICT (id_estudiante, id_periodo) 
    DO UPDATE SET
      total_deuda = deuda.total_deuda + EXCLUDED.total_deuda,
      pendiente   = deuda.pendiente + EXCLUDED.pendiente,
      deuda_mes   = (deuda.total_deuda + EXCLUDED.total_deuda) / (SELECT meses FROM datos_origen),
      updated     = NOW()
    RETURNING total_deuda, deuda_mes
  )
  SELECT 
    d.total_deuda AS total_acumulado,
    d.deuda_mes AS mensualidad_calculada
  FROM gestion_deuda d;
`;
