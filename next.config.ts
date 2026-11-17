import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
};

// Prepara las reescrituras del script de desafío de BotID; no bloquea nada por sí solo.
// Lo que protege es checkBotId() en una ruta/Server Action concreta (todavía no hay ninguna).
export default withBotId(nextConfig);
