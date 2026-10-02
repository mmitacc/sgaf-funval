# API de Backend: "Sistema de Gestión Académica y Financiera" (Versión NestJS 1.0.0)

## Descripción

Este API es una API RESTful que permite la gestión para sistemas SGAF, cuanta con 14 tablas normalizadas y correctamente estructuradas :'pago', 'deuda', 'entrega', 'tarea', 'matricula', 'horario', 'grupo', 'estudiante', 'profesor', 'usuario', 'aula', 'materia', 'periodo', 'especialidad'.
Se adjunta un archivo panoramico del proyecto: `SGAF-DER.png` (con el esquema gráfico de la base de datos y detalles de campos Enum). También se agrega sobre la Arquitectura de clases NestJS otro nivel de patrón conocido como Soft Delete.


## Instalación
1.- Clonar el repositorio de la url
    `https://github.com/mmitacc/sgaf-funval`
2.- Instalar las dependencias
    `pnpm install`
3.- Actualizar/crear el archivo .env con tu nombre de base de datos, numero puerto local host (3000)
    y password de Postgresql (se tiene un ejemplo en el archivo .env.ejemplo)
4.- Para migrar/crear los schemas/tablas y base de datos postgresql con prisma: 
    `pnpm prisma migrate dev --name init`
5.- Para crear/actualizar el cliente prisma que se comunica con tu base de datos: 
    `pnpm prisma generate`
6.- Para cargar data de test en base de datos (elimina toda la data y siembra nueva data para pruebas): 
    (Usuario SuperAdmin: {email: 'superadmin@prisma.edu', password: 'Man.123'})
    `pnpm run start:seed`
7.- Finalmente, para levantar el servidor backend 
    `pnpm run start:dev`
8.- Existe una ruta para la documentación completa de la API en el puerto
    `http://localhost:3000/api/docs`
    Pero también puedes probarlo en la web, en dirección:
    `http://www.sgaf-funval.com`


## Autor

Para mayores detalles sobre el proyecto, puedes visitar el repositorio de mi proyecto o contactarme en:
[Manuel Mitacc](https://github.com/mmitacc)
Telefono: +051 996 080 313  (Tacna-Perú)
Email: manuelmitacc@hotmail.com


## Licencia

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