# ENTIDADES

## Entity: PACIENTE

|Atributo               | Tipo          | Reglas o notas       |
|-----------------------|---------------|----------------------|
| Id                    | Número entero | [PK], autoincremental|
| Nombre                | Texto         | Obligatorio          |
| Correo                | Texto         | Obligatorio             |
| Apellido Paterno      | Texto         | Obligatorio             |
| Carnet de Identidad   | Texto         | Opcional Único          |
| Número de teléfono    | Texto         | Opcional                |
| Fecha de nacimiento   | Fecha         | Obligatorio y no futura |

## Entity: ESPECIALIDAD

|Atributo               | Tipo          | Reglas o notas     |
|-----------------------|---------------|--------------------|
| Id                    | Número entero | [PK]               |
| Nombre_especialidad   | Texto         | Obligatorio y Único|
| Descripción           | Texto         | Obligatorio        |

## Entity: MÉDICO

|Atributo               | Tipo          | Reglas o notas     |
|-----------------------|---------------|--------------------|
| Id                    | Número entero | [PK]               |
| Nombre                | Texto         | Obligatorio        |
| Número de teléfono    | Texto         | Obligatorio        |
| Id_especialidad       | Número entero | [FK] Obligatorio   |

## Entity: CITAS
|Atributo               | Tipo          | Reglas o notas                      |
|-----------------------|---------------|-------------------------------------|
| Id                    | Número entero | [PK]                                |
| Id_médico             | Número entero | [FK] Obligatorio                    |
| Id_paciente           | Número entero | [FK] Obligatorio                    |
| Fecha_hora            | Fecha y hora  | Obligatorio, no agendar en el pasado|
| Estado                | Enumeración   | Programada(def), completada, cancelada

### RELACIONES
- Una especialidad puede tener cero o muchos médicos, pero cada médico pertenece a una sola especialidad

- Un paciente puede tener cero o muchas citas, pero cada cita pertenece a un solo paciente

- Un médico puede tener cero o muchas citas, pero cada cita está asignada a un solo médico
