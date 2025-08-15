import html from "@elysiajs/html";
import { Elysia } from "elysia";
import { render } from "./utils/render";
import staticPlugin from "@elysiajs/static";
import websocket from "./websocket";

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .use(staticPlugin({ prefix: "/lucide", assets: "node_modules/lucide-static/icons" }))
    .onAfterHandle(async ({ path, query, set }) => {
        if (path.startsWith("/lucide/") && query.color) {
            let file = Bun.file(path.replace("/lucide", "node_modules/lucide-static/icons"));
            let content = await file.text();
            content = content.replaceAll("currentColor", query.color);
            set.headers["content-type"] = "image/svg+xml";
            return new Response(content);
        }
    })
    .get("/", () => render("index"))
    .use(websocket)
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
