import Elysia from "elysia";
import { getCount, updateCount } from "./utils/database";

let blahajInThreeSeconds = 0;
let blahajInThreeSecondsPerUsers: Map<string, number> = new Map();

export default new Elysia({ prefix: "/websocket", websocket: { idleTimeout: 20 * 60 } })
    .ws("/", {
        open(ws) {
            let id = ws.data.headers["CF-Connecting-IP"] ?? ws.id;

            ws.subscribe("blahaj")
            ws.send(`blahaj_${getCount()}`);
            blahajInThreeSecondsPerUsers.set(id, 0);
        },
        message(ws, body) {
            let id = ws.data.headers["CF-Connecting-IP"] ?? ws.id;
            if (body === "ping") {
                return ws.send("pong");
            }

            // Anti spamhaj (Patent n°f3mb0y)
            blahajInThreeSeconds++;
            let userBlahaj = (blahajInThreeSecondsPerUsers.get(id) ?? 0) + 1
            blahajInThreeSecondsPerUsers.set(id, userBlahaj)
            setTimeout(() => {
                blahajInThreeSeconds--;
                blahajInThreeSecondsPerUsers.set(id, (blahajInThreeSecondsPerUsers.get(id) ?? 0) - 1)
            }, 3000);
            if (blahajInThreeSeconds >= 200 || userBlahaj >= 60) {
                ws.publish("blahaj", "spamhaj")
                return ws.send("spamhaj")
            }

            let count = getCount() + 1;
            updateCount(count);
            let payload = `blahaj_${count}`;
            ws.publish("blahaj", payload);
            ws.send(payload);
        },
        close(ws) {
            ws.unsubscribe("blahaj");
        }
    })
