/**
 * Contenedores con las medidas de la UPB.
 * Celular: 20 px de margen a cada lado. Desde 576 px: ancho fijo centrado (540, 720 y 960 px),
 * así el logo, el menú y el contenido arrancan todos en el mismo borde.
 * La foto principal NO usa contenedor: va de borde a borde en todos los tamaños.
 * Las medidas van en px para que no cambien al ampliar el texto.
 */

/** Contenido de las páginas (1240 px útiles desde 1200 px) */
export const wrap =
  "mx-auto w-full px-[20px] xs:max-w-[540px] xs:px-0 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1280px] xl:px-[20px]";

/** Barra superior y footer: igual en celular y tableta, ancho completo en escritorio */
export const wideWrap =
  "mx-auto w-full px-[20px] xs:max-w-[540px] xs:px-0 md:max-w-[720px] lg:max-w-[1521px] lg:px-[60px]";
