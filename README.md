# Pulso

App de entrenamiento: Full Body con series libres de peso/reps, HIIT (bloque
EMOM + descanso + bloque AMRAP), ciclo de descarga de 4 semanas, e
Historial/Estadísticas con gráficas de evolución. Base nueva, sin nada del
proyecto anterior (torso/pierna).

## Instalación y prueba local

```bash
npm install
npm run dev
```

Abre la URL que te dé la terminal (normalmente `http://localhost:5173`).

```bash
npm run build      # genera dist/ para producción
npm run preview    # previsualiza esa build tal cual se vería publicada
```

## Claves de almacenamiento

- `entreno-templates-v1` — plantillas de Full Body, EMOM, AMRAP
- `entreno-historial-v1` — sesiones guardadas
- `entreno-draft-v1` — borrador de Full Body en curso
- `entreno-backups-v1` — copias de seguridad automáticas
- `entreno-preferences-v1` — preferencias del cronómetro
- `entreno-ciclo-v1` — estado del ciclo de descarga

Usa `localStorage` real — aquí sí funciona, es un proyecto independiente, no
un Artifact.

## Las 4 pantallas

- **Full Body**: los 5 ejercicios de tu plantilla, series con peso/reps/tipo
  (aproximación o trabajo), cronómetro de descanso automático entre series.
- **HIIT**: eliges duración de EMOM y AMRAP (o se fija sola en semana de
  descarga), el EMOM rota de ejercicio cada minuto con 40"/20" (30"/30" en
  descarga) y un campo para las reps de ese minuto, luego 2' de descanso, y
  el AMRAP con el circuito fijo y campos para rondas completas + ronda
  parcial.
- **Historial**: filtro Todos/Full Body/HIIT, gráfica de peso por ejercicio
  en Full Body, gráficas de reps EMOM y rondas AMRAP en HIIT, lista de
  sesiones con etiqueta de "descarga" cuando aplica.
- **Ajustes**: editar las 3 plantillas (añadir/quitar ejercicios, cambiar
  descansos y reps objetivo), preferencias del cronómetro, estado del ciclo
  de descarga, registrar un día de descanso activo (nota libre, opcional),
  exportar/importar copia de seguridad en JSON.

## Ciclo de descarga

Cuenta sesiones de Full Body + HIIT entrenadas (no fechas de calendario, no
cuenta descanso activo). A las 24 (4 semanas × 6/semana) aparece el banner
para empezar la descarga o retrasarla 1 semana (pulsable las veces que
quieras). En semana de descarga, Full Body sugiere −20% de peso y 2 series
de trabajo por ejercicio (editable), y HIIT fija EMOM a 12' 30"/30" y AMRAP
a 12'. Un indicador aparte, mientras la descarga está activa, tiene el botón
"Descarga terminada" que reinicia el contador — sin pulsar eso, el ciclo no
avanza solo.

## Una limitación honesta del EMOM

El EMOM calcula el minuto y la fase trabajo/descanso a partir de la hora
real (como el cronómetro de descanso), así que sobrevive a cambiar de
pestaña y a segundo plano sin desincronizarse. Lo único que no cubre: si
dejas el móvil en segundo plano durante varios minutos seguidos mientras el
EMOM corre, los minutos que te saltaste se registran con 0 reps (no se
puede reconstruir un dato que no se introdujo) — al volver, sigue
funcionando con normalidad desde el minuto en el que estás.

## Publicar

Igual que el proyecto anterior: sube esto a GitHub y conéctalo a Vercel
(detecta Vite solo, `npm run build` / carpeta `dist`, HTTPS desde el primer
minuto). Una vez publicado, ábrelo en Safari en el iPhone e "Añadir a
pantalla de inicio" para instalarlo.
