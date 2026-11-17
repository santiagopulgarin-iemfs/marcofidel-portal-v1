import { initBotId } from "botid/client/core";

/**
 * Vercel BotID: protege rutas puntuales que RECIBEN datos (un formulario que llama a una
 * Server Action o a una ruta de API) contra bots, sin mostrar ningún captcha visible.
 *
 * Hoy el sitio no tiene ninguna: es informativo (calendario, trámites, contacto por
 * mailto:), así que la lista queda vacía — initBotId() así no hace nada, pero deja el
 * cableado listo (junto con withBotId() en next.config.ts).
 *
 * El día que se agregue un formulario real (por ejemplo, Admisiones o PQRS con una
 * Server Action o una ruta /api/...), se agrega así:
 *
 *   protect: [{ path: "/api/admisiones", method: "POST" }]
 *
 * y en esa Server Action o ruta se llama a checkBotId() de "botid/server" para
 * rechazar la petición si viene de un bot (ver node_modules/botid/README.md).
 */
initBotId({
  protect: [],
});
