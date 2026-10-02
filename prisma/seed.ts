import { PrismaClient } from '../src/prisma/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  Rol,
  Estado,
  EstadoPago,
  TipoPago,
  ConceptoPago,
} from '../src/prisma/generated/prisma/enums.js';
import { Decimal } from '@prisma/client/runtime/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  console.log('Iniciando limpieza completa de la base de datos...');

  // 1. Tablas Hijas Finales (Dependen de todo)
  await prisma.entrega.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.horario.deleteMany();

  // 2. Tablas Intermedias / Dependientes directas
  await prisma.tarea.deleteMany();
  await prisma.deuda.deleteMany();
  await prisma.grupo.deleteMany();

  // 3. Tablas de Herencia de Usuario
  await prisma.profesor.deleteMany();
  await prisma.estudiante.deleteMany();

  // 4. Tablas Catálogo / Maestras (Ahora sí se pueden borrar con seguridad)
  await prisma.usuario.deleteMany();
  await prisma.materia.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.periodo.deleteMany();
  await prisma.especialidad.deleteMany();

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "especialidad" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "materia" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "periodo" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "aula" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "usuario" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "profesor" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "estudiante" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "grupo" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "horario" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "matricula" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "tarea" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "entrega" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "deuda" RESTART IDENTITY CASCADE;`,
  );
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "pago" RESTART IDENTITY CASCADE;`,
  );

  console.log('Base de datos limpia. Iniciando la siembra de datos...');
  // ==========================================
  // 1. ESTRUCTURAS BASE EXTERNAS
  // ==========================================
  await prisma.especialidad.createMany({
    data: [
      { nombre: 'Matemáticas Avanzadas' },
      { nombre: 'Ciencias Naturales' },
      { nombre: 'Literatura y Lenguaje' },
    ],
  });
  const especialidades = await prisma.especialidad.findMany({
    orderBy: { id: 'asc' },
  });

  const periodoActual = await prisma.periodo.create({
    data: {
      nombre: 'Periodo Regular III-2026',
      meses: 3,
      inicio: new Date('2026-09-15'),
      fin: new Date('2026-12-15'),
      max_creditos: 25,
      matricula: new Decimal(100),
    },
  });

  await prisma.materia.createMany({
    data: [
      {
        nombre: 'Cálculo Diferencial',
        creditos: 5,
        mensualidad: new Decimal(150),
      },
      {
        nombre: 'Física Mecánica',
        creditos: 5,
        mensualidad: new Decimal(160),
      },
      {
        nombre: 'Comprensión Lectora',
        creditos: 4,
        mensualidad: new Decimal(120),
      },
      {
        nombre: 'Química Orgánica',
        creditos: 5,
        mensualidad: new Decimal(150),
      },
    ],
  });
  const materias = await prisma.materia.findMany({ orderBy: { id: 'asc' } });

  await prisma.aula.createMany({
    data: [
      { nombre: 'Aula 101 - Pabellón A', capacidad: 30 },
      { nombre: 'Laboratorio de Física', capacidad: 25 },
      { nombre: 'Aula 204 - Pabellón B', capacidad: 35 },
      { nombre: 'Laboratorio de Química', capacidad: 20 },
    ],
  });
  const aulas = await prisma.aula.findMany({ orderBy: { id: 'asc' } });

  // ==========================================
  // 2. USUARIOS Y HERENCIA (12 en total)
  // ==========================================
  const passwordEstudiante = await bcrypt.hash('123456', 10);
  const passwordProfesor = await bcrypt.hash('123456789', 10);
  const passwordRecepcionista = await bcrypt.hash('654321', 10);
  const passwordAdministrador = await bcrypt.hash('Admin123', 10);
  const passwordSuperAdmin = await bcrypt.hash('Man.123', 10);
  // Personal del Sistema
  await prisma.usuario.createMany({
    data: [
      {
        nombres: 'Manuel',
        apellidos: 'Mitacc',
        email: 'superadmin@prisma.edu',
        password: passwordSuperAdmin,
        rol: Rol.SUPERADMIN,
        estado: Estado.ACTIVO,
        masculino: true,
      },
      {
        nombres: 'Ana',
        apellidos: 'Gomez',
        email: 'admin@prisma.edu',
        password: passwordAdministrador,
        rol: Rol.ADMINISTRADOR,
        estado: Estado.ACTIVO,
        masculino: false,
      },
      {
        nombres: 'Laura',
        apellidos: 'Torres',
        email: 'recepcion@prisma.edu',
        password: passwordRecepcionista,
        rol: Rol.RECEPCIONISTA,
        estado: Estado.ACTIVO,
        masculino: false,
      },
    ],
  });
  const recepcionista = await prisma.usuario.findFirstOrThrow({
    where: { rol: Rol.RECEPCIONISTA },
  });

  // Profesores
  await prisma.usuario.createMany({
    data: [
      {
        nombres: 'Roberto',
        apellidos: 'Silva',
        email: 'roberto.silva@prisma.edu',
        password: passwordProfesor,
        rol: Rol.PROFESOR,
        estado: Estado.ACTIVO,
        masculino: true,
      },
      {
        nombres: 'Elena',
        apellidos: 'Rios',
        email: 'elena.rios@prisma.edu',
        password: passwordProfesor,
        rol: Rol.PROFESOR,
        estado: Estado.ACTIVO,
        masculino: false,
      },
      {
        nombres: 'Marcos',
        apellidos: 'Peña',
        email: 'marcos.pena@prisma.edu',
        password: passwordProfesor,
        rol: Rol.PROFESOR,
        estado: Estado.ACTIVO,
        masculino: true,
      },
    ],
  });
  const profesoresUsuarios = await prisma.usuario.findMany({
    where: { rol: Rol.PROFESOR },
    orderBy: { id: 'asc' },
  });

  await prisma.profesor.createMany({
    data: [
      {
        id_usuario: profesoresUsuarios[0].id,
        fecha_contrato: new Date('2024-02-15'),
        id_especialidad: especialidades[0].id,
      },
      {
        id_usuario: profesoresUsuarios[1].id,
        fecha_contrato: new Date('2023-06-01'),
        id_especialidad: especialidades[1].id,
      },
      {
        id_usuario: profesoresUsuarios[2].id,
        fecha_contrato: new Date('2025-01-10'),
        id_especialidad: especialidades[2].id,
      },
    ],
  });

  // Estudiantes (5 activos, 1 suspendido por deudas)
  await prisma.usuario.createMany({
    data: [
      {
        nombres: 'Juan',
        apellidos: 'Perez',
        email: 'alumno.juan@prisma.edu',
        password: passwordEstudiante,
        rol: Rol.ESTUDIANTE,
        estado: Estado.ACTIVO,
        masculino: true,
      },
      {
        nombres: 'Diego',
        apellidos: 'Castro',
        email: 'alumno.diego@prisma.edu',
        password: passwordEstudiante,
        rol: Rol.ESTUDIANTE,
        estado: Estado.ACTIVO,
        masculino: true,
      },
      {
        nombres: 'Sofia',
        apellidos: 'Diaz',
        email: 'alumno.sofia@prisma.edu',
        password: passwordEstudiante,
        rol: Rol.ESTUDIANTE,
        estado: Estado.ACTIVO,
        masculino: false,
      },
      {
        nombres: 'Valentina',
        apellidos: 'Tapia',
        email: 'alumno.valentina@prisma.edu',
        password: passwordEstudiante,
        rol: Rol.ESTUDIANTE,
        estado: Estado.ACTIVO,
        masculino: false,
      },
      {
        nombres: 'Mateo',
        apellidos: 'Luna',
        email: 'alumno.mateo@prisma.edu',
        password: passwordEstudiante,
        rol: Rol.ESTUDIANTE,
        estado: Estado.ACTIVO,
        masculino: true,
      },
      {
        nombres: 'Lucas',
        apellidos: 'Morales',
        email: 'alumno.lucas@prisma.edu',
        password: passwordEstudiante,
        rol: Rol.ESTUDIANTE,
        estado: Estado.PENDIENTE,
        masculino: true,
      },
    ],
  });
  const estudiantesUsuarios = await prisma.usuario.findMany({
    where: { rol: Rol.ESTUDIANTE },
    orderBy: { id: 'asc' },
  });

  await prisma.estudiante.createMany({
    data: estudiantesUsuarios.map((user, i) => ({
      id_usuario: user.id,
      codigo: `MAT-2026-00${i + 1}`,
      apoderado: `Apoderado de ${user.nombres}`,
    })),
  });

  // ==========================================
  // 3. PLANIFICACIÓN ACADÉMICA (Grupos y Horarios)
  // ==========================================
  await prisma.grupo.createMany({
    data: [
      {
        capacidad: 20,
        id_profesor: profesoresUsuarios[0].id,
        id_aula: aulas[0].id,
        id_materia: materias[0].id,
        id_periodo: periodoActual.id,
      },
      {
        capacidad: 20,
        id_profesor: profesoresUsuarios[1].id,
        id_aula: aulas[1].id,
        id_materia: materias[1].id,
        id_periodo: periodoActual.id,
      },
      {
        capacidad: 20,
        id_profesor: profesoresUsuarios[2].id,
        id_aula: aulas[2].id,
        id_materia: materias[2].id,
        id_periodo: periodoActual.id,
      },
      {
        capacidad: 20,
        id_profesor: profesoresUsuarios[1].id,
        id_aula: aulas[3].id,
        id_materia: materias[3].id,
        id_periodo: periodoActual.id,
      },
    ],
  });
  const grupos = await prisma.grupo.findMany({ orderBy: { id: 'asc' } });

  await prisma.horario.createMany({
    data: [
      {
        dia: 'LUNES',
        hora_inicio: new Date('2026-01-01T08:00:00Z'),
        hora_fin: new Date('2026-01-01T10:00:00Z'),
        id_grupo: grupos[0].id,
      },
      {
        dia: 'MARTES',
        hora_inicio: new Date('2026-01-01T08:00:00Z'),
        hora_fin: new Date('2026-01-01T10:00:00Z'),
        id_grupo: grupos[1].id,
      },
      {
        dia: 'MIERCOLES',
        hora_inicio: new Date('2026-01-01T08:00:00Z'),
        hora_fin: new Date('2026-01-01T10:00:00Z'),
        id_grupo: grupos[2].id,
      },
      {
        dia: 'JUEVES',
        hora_inicio: new Date('2026-01-01T08:00:00Z'),
        hora_fin: new Date('2026-01-01T10:00:00Z'),
        id_grupo: grupos[3].id,
      },
    ],
  });

  // ==========================================
  // 4. PROCESO DE MATRICULACIÓN (24 Matrículas Distintas)
  // ==========================================
  const matriculasData: { id_estudiante: number; id_grupo: number }[] = [];
  for (const est of estudiantesUsuarios) {
    for (const grp of grupos) {
      if (est.estado !== 'PENDIENTE')
        matriculasData.push({ id_estudiante: est.id, id_grupo: grp.id });
    }
  }
  await prisma.matricula.createMany({ data: matriculasData });

  // ==========================================
  // 5. AULA VIRTUAL (Tareas e Inserción Masiva de 20 Entregas)
  // ==========================================
  await prisma.tarea.createMany({
    data: [
      {
        nombre: 'Tarea 1 - G1',
        instrucciones: '...',
        fecha_entrega: new Date('2026-10-05'),
        id_grupo: grupos[0].id,
      },
      {
        nombre: 'Tarea 2 - G1',
        instrucciones: '...',
        fecha_entrega: new Date('2026-10-20'),
        id_grupo: grupos[0].id,
      },
      {
        nombre: 'Tarea 1 - G2',
        instrucciones: '...',
        fecha_entrega: new Date('2026-10-05'),
        id_grupo: grupos[1].id,
      },
      {
        nombre: 'Tarea 2 - G2',
        instrucciones: '...',
        fecha_entrega: new Date('2026-10-20'),
        id_grupo: grupos[1].id,
      },
      {
        nombre: 'Tarea 1 - G3',
        instrucciones: '...',
        fecha_entrega: new Date('2026-10-05'),
        id_grupo: grupos[2].id,
      },
      {
        nombre: 'Tarea 1 - G4',
        instrucciones: '...',
        fecha_entrega: new Date('2026-10-05'),
        id_grupo: grupos[3].id,
      },
    ],
  });
  const tareas = await prisma.tarea.findMany({ orderBy: { id: 'asc' } });

  const entregasData = [];
  let entregaCount = 0;

  for (const est of estudiantesUsuarios) {
    for (const tar of tareas) {
      if (entregaCount >= 20) break;

      const esCompleta = entregaCount < 15;
      entregasData.push({
        respuesta: `Respuesta del alumno ID ${est.id} para la tarea ID ${tar.id}`,
        archivo_url: esCompleta ? 'https://prisma.edu' : null,
        calificacion: esCompleta ? Math.floor(Math.random() * 10) + 11 : null,
        id_estudiante: est.id,
        id_tarea: tar.id,
      });
      entregaCount++;
    }
  }
  await prisma.entrega.createMany({ data: entregasData });

  // ==========================================
  // 6. CONTROL FINANCIERO (5 Al día, 1 aún en PENDIENTE de matricula)
  // ==========================================

  // A. Generación de Deudas Consolidadas del Periodo (Para los 5 alumnos ACTIVOS)
  // Ejemplo real: Total 450, Cuota 150, Pendiente inicia en 450 pero baja a 300 tras el primer pago.
  const estudiantesActivos = estudiantesUsuarios.filter(
    (e) => e.estado === Estado.ACTIVO,
  );
  const deudasData = estudiantesActivos.map((est) => ({
    total_deuda: new Decimal(1740.0),
    pendiente: new Decimal(1160.0),
    deuda_mes: new Decimal(580.0),
    moroso: false,
    id_periodo: periodoActual.id,
    id_estudiante: est.id,
  }));

  await prisma.deuda.createMany({ data: deudasData });
  const deudas = await prisma.deuda.findMany({ orderBy: { id: 'asc' } });

  const todosLosPagos: any[] = [];

  // B.1. Agregar el Pago de la Matricula (100) para los 5 alumnos activos
  deudas.forEach((deuda) => {
    todosLosPagos.push({
      concepto: ConceptoPago.MATRICULA,
      descripcion: 'Periodo III',
      monto: new Decimal(100.0),
      tipo_pago: TipoPago.TRANSFERENCIA,
      estado_pago: EstadoPago.APROBADO,
      id_operador: recepcionista.id,
      id_estudiante: deuda.id_estudiante,
      id_deuda: deuda.id,
      created: new Date('2026-09-25'),
    });
  });

  // B.2. Agregar el Pago de Mensualidad Octubre (580) para los 5 alumnos activos
  deudas.forEach((deuda) => {
    todosLosPagos.push({
      concepto: ConceptoPago.MENSUALIDAD,
      descripcion: 'Octubre 2026',
      monto: new Decimal(580.0),
      tipo_pago: TipoPago.TRANSFERENCIA,
      estado_pago: EstadoPago.APROBADO,
      id_operador: recepcionista.id,
      id_estudiante: deuda.id_estudiante,
      id_deuda: deuda.id,
      created: new Date('2026-09-29'),
    });
  });

  // C. Inserción masiva final en PostgreSQL
  await prisma.pago.createMany({ data: todosLosPagos });

  console.log('Base de datos sembrada con éxito.');
  console.log('- 3 Especialidades creadas');
  console.log('- 4 Materias creadas');
  console.log('- 1 Período creado');
  console.log('- 4 Aulas creadas');
  console.log(
    '- 12 Usuarios creados (RECEPCIONISTA, ADMINISTRADOR, SUPERADMIN, 3 PROFESORES, 6 ESTUDIANTES)',
  );
  console.log('- 3 Profesores insertados');
  console.log('- 6 Estudiantes insertados');
  console.log('- 4 Grupos creados');
  console.log('- 4 Horarios creados');
  console.log('- 20 Matriculas creadas');
  console.log('- 6 Tareas creadas');
  console.log('- 20 Entregas creadas');
  console.log('- 5 Deudas creadas');
  console.log('- 5 Pagos insertados');
}

main()
  .catch((error) => {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
