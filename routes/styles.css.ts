import type { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET: () => {
    const css = Deno.readTextFileSync(
      new URL("../static/tailwind.css", import.meta.url),
    );

    return new Response(css, {
      headers: { "Content-Type": "text/css" },
    });
  },
};
