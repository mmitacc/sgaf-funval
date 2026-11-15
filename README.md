# 🎓 API de Backend: TechUniversity — Sistema de Gestión Académica y Financiera (NestJS)

## Descripción

API RESTful desarrollada con **NestJS**, **Prisma ORM**, **PostgreSQL** y **Cloudinary** para la administración integral de instituciones educativas (SGAF). Cuenta con **15 tablas normalizadas** y estructuradas (`pago`, `deuda`, `entrega`, `tarea`, `matricula`, `horario`, `grupo`, `materiales_grupo`, `estudiante`, `profesor`, `usuario`, `aula`, `materia`, `periodo`, `especialidad`).

Se adjunta el diagrama panorámico del proyecto en `SGAF-DER.png` (con el esquema entidad-relación de la base de datos y detalle de tipos `Enum`). Toda la arquitectura implementa el patrón **Soft-Delete** (`created`, `updated`, `deleted`, `deletedate`) y control de acceso basado en roles (**JWT + Guards RBAC**).

---

## ✨ Novedades y Mejoras Recientes

* **Gestión de Materiales de Clase (`materiales_grupo`):** Endpoints dedicados para que los docentes publiquen enlaces, videos y recursos académicos por sección.
* **Flujo Financiero y Control de Acceso por Estado:**
  * Inicio de sesión habilitado para estudiantes en estado `PENDIENTE` (matrícula inicial sin abonar) y `SUSPENDIDO` (mora mensual) con acceso restringido a regularización de pagos y reactivación automática a `ACTIVO`.
  * **Corte Mensual Selectivo (`POST /api/deuda/corte-mensual`):** Procesa y suspende únicamente a estudiantes `ACTIVO` con cuotas vencidas, evitando afectar cuentas `PENDIENTE` o `INACTIVO`.
  * **Validación de Matrícula por Periodo (`POST /api/pago/matricula`):** Verificación directa de matrícula aprobada antes de habilitar cobros de mensualidad.
* **Reportes Ejecutivos y Finanzas (`/api/admin`):**
  * Resumen financiero consolidado por periodo (`GET /api/admin/finanzas/resumen`) con métricas de recaudación, proyección, morosidad y canales de pago.
  * Panel ejecutivo (`GET /api/admin/dashboard`) con soporte de filtro histórico por periodo (`?idPeriodo=`) y detección automática del ciclo académico vigente (`inicio <= hoy <= fin`).
* **Consultas Enriquecidas y Seguridad:**
  * `GET /api/grupo` incluye relaciones completas (`materia`, `periodo`, `aula`, `profesor`, `horarios` activos y conteo `_count.matriculas`).
  * Exclusión automática de cuentas `SUPERADMIN` en los listados administrativos de usuarios y reseteo seguro de contraseñas temporales.

---

## 🛠️ Stack Tecnológico

* **Framework:** NestJS + TypeScript
* **ORM & Base de Datos:** Prisma ORM + PostgreSQL
* **Autenticación y Seguridad:** JWT (`@nestjs/jwt`), Passport, Bcrypt y Guards por Roles
* **Almacenamiento Multimedia:** Cloudinary (avatares y entregas de tareas)
* **Documentación:** Swagger / OpenAPI

---

## ⚙️ Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/mmitacc/sgaf-funval
   cd sgaf-funval
   ```

2. **Instalar las dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Crea o actualiza el archivo `.env` en la raíz del proyecto tomando como base `.env.ejemplo` (puerto `3000`, credenciales de PostgreSQL, secreto JWT, credenciales de Cloudinary y `FRONTEND_URL`).

4. **Ejecutar migraciones de Prisma en PostgreSQL:**
   ```bash
   pnpm prisma migrate dev --name init
   ```

5. **Generar el cliente de Prisma:**
   ```bash
   pnpm prisma generate
   ```

6. **Sembrar datos iniciales de prueba (Seed):**
   *(Reinicia la base de datos y carga registros de prueba en todos los módulos. Incluye SuperAdmin: `superadmin@prisma.edu` / `Man.123`)*
   ```bash
   pnpm run start:seed
   ```

7. **Levantar el servidor en modo desarrollo:**
   ```bash
   pnpm run start:dev
   ```

8. **Explorar la documentación interactiva (Swagger):**
   * **Entorno Local:** `http://localhost:3000/api/docs`
   * **Entorno Producción (Render):** `https://sgaf-funval.onrender.com/api/docs`

---

## 👨‍💻 Autor

**Manuel Mitacc** (`@mmitacc`) — *Full-Stack Developer*  
Para mayores detalles sobre el proyecto o consultas técnicas, puedes contactarme en:

* **GitHub:** [github.com/mmitacc](https://github.com/mmitacc)
* **LinkedIn:** [://linkedin.com](https://www.linkedin.com/in/mmitacc/)
* **Teléfono:** +51 996 080 313 (Tacna - Perú)
* **Email:** manuelmitacc@hotmail.com

---

## 📄 Licencia

MIT License

Copyright (c) 2026 [Manuel Mitacc](https://github.com/mmitacc)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
