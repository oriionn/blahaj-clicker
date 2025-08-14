import html from "@elysiajs/html";
import { Elysia } from "elysia";
import { render } from "./utils/render";
import staticPlugin from "@elysiajs/static";

const app = new Elysia()
    .use(html())
    .use(staticPlugin())
    .get("/", () => render("index"))
    .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
