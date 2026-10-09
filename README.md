# Afina

Aprende a comer. Vive más y mejor.

App personal de nutrición y entrenamiento de gimnasio: perfiles por persona, cálculo de gasto y macros por sexo y deporte, menú semanal según tus gustos, compra, batch cooking, ajuste semanal por tendencia y plan de gimnasio basado en ciencia del deporte (volumen por músculo, RIR, progresión doble, descargas, alternativas por material o molestia).

Los datos se guardan solo en el navegador de cada dispositivo. Usa la copia de seguridad para pasarlos de un sitio a otro.

## Construir

```bash
node build.js
```

Genera:
- `dist/` — web instalable (PWA) para Cloudflare Pages
- `afina.html` — versión de una sola página

## Publicar en Cloudflare Pages

- Conectado a GitHub: rama `afina`, comando de build `node build.js`, carpeta de salida `dist`.
- O subida directa: arrastra la carpeta `dist` en Cloudflare Pages.

## Archivos

- `foods.js` base de alimentos
- `engine.js` cálculos de nutrición, ajuste semanal y generador de menús
- `goals.js` objetivos (recomposición, estética, definición, volumen limpio, fuerza, longevidad), estilos de dieta y textos de ayuda
- `exercises.js` biblioteca de ejercicios y material de gimnasio
- `gym.js` motor de programación y progresión
- `learn.js` contenidos divulgativos
- `app.js` pantallas de nutrición, perfil y copias
- `gymui.js` pantallas de entreno
- `shop.js` lista de la compra (formatos, merma, despensa, una o dos compras)
- pulso.js: importa el historial de entrenos de la app PULSO anterior (copiar o archivo JSON).
- `main.js` arranque
