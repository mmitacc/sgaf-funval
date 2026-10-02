import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { EspecialidadModule } from './especialidad/especialidad.module.js';
import { MateriaModule } from './materia/materia.module.js';
import { PeriodoModule } from './periodo/periodo.module.js';
import { AulaModule } from './aula/aula.module.js';
import { UsuarioModule } from './usuario/usuario.module.js';
import { ProfesorModule } from './profesor/profesor.module.js';
import { EstudianteModule } from './estudiante/estudiante.module.js';
import { GrupoModule } from './grupo/grupo.module.js';
import { HorarioModule } from './horario/horario.module.js';
import { MatriculaModule } from './matricula/matricula.module.js';
import { TareaModule } from './tarea/tarea.module.js';
import { EntregaModule } from './entrega/entrega.module.js';
import { DeudaModule } from './deuda/deuda.module.js';
import { PagoModule } from './pago/pago.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { envValidationSchema } from './common/configs/env.validation.js';
import { ScheduleModule } from '@nestjs/schedule';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

// Para que los datos de .env sean leidos globalmente
ConfigModule.forRoot({
  isGlobal: true,
});

@Module({
  imports: [
    ScheduleModule.forRoot(), // Activa el soporte de @Cron en toda la app
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        libraryOptions: {
          abortEarly: false,
          allowUnknown: true,
        },
      },
    }),
    PrismaModule,
    AuthModule,
    UsuarioModule,
    EstudianteModule,
    EntregaModule,
    ProfesorModule,
    TareaModule,
    GrupoModule,
    EspecialidadModule,
    MateriaModule,
    PeriodoModule,
    AulaModule,
    HorarioModule,
    MatriculaModule,
    DeudaModule,
    PagoModule,
  ],
  controllers: [AppController],
  providers: [
    // Esto asegura que cada endpoint de la app requiera token automáticamente
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AppService,
  ],
})
export class AppModule {}
