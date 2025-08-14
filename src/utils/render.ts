import { join } from "path";
import { readFile } from "fs/promises";

export async function render(name: string): Promise<string> {
    let file = join(__dirname, "..", "pages", `${name}.html`);
    let content = await readFile(file);
    return content.toString();
}
