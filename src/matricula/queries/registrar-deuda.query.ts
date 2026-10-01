import { Prisma } from '../../prisma/generated/prisma/client.js';

export const REGISTRAR_DEUDA_ESTUDIANTE = (
  id_estudiante: number,
  id_grupo: number,
) => Prisma.sql`
        WITH 
        -- 1. Obtener la mensualidad de la materia y el periodo del grupo al que se inscribe
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
        -- 2. Registrar la matrícula en la tabla correspondiente
        nueva_matricula AS (
          INSERT INTO matricula (id_estudiante, id_grupo)
          VALUES (${id_estudiante}, ${id_grupo})
          RETURNING id
        ),
        -- 3. Crear o actualizar (UPSERT) el registro en la tabla DEUDA
        gestion_deuda AS (
          INSERT INTO deuda (
            id_estudiante, 
            id_periodo, 
            total_deuda, 
            pendiente, 
            deuda_mes, 
            moroso
          )
          SELECT 
            ${id_estudiante},
            id_periodo,
            mensualidad AS total_deuda,
            mensualidad AS pendiente,
            (mensualidad / meses) AS deuda_mes,
            FALSE AS moroso
          FROM datos_origen  
          -- Si el estudiante YA tiene una deuda registrada en este periodo, aplicamos las fórmulas de acumulación:
          ON CONFLICT (id_estudiante, id_periodo) 
          DO UPDATE SET
            total_deuda = deuda.total_deuda + EXCLUDED.total_deuda,
            pendiente   = deuda.pendiente + EXCLUDED.pendiente,
            deuda_mes   = (deuda.total_deuda + EXCLUDED.total_deuda) / (SELECT meses FROM datos_origen)
          
          RETURNING total_deuda, deuda_mes
        )
        -- 4. Retornar los datos confirmados de la operación
        SELECT 
          (SELECT id FROM nueva_matricula) AS matricula_id,
          d.total_deuda AS total_acumulado,
          d.deuda_mes AS mensualidad_calculada
        FROM gestion_deuda d;
`;
