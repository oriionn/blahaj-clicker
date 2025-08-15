import Elysia from "elysia";
import { getCount, updateCount } from "./utils/database";

let blahajInThreeSeconds = 0;
let blahajInThreeSecondsPerUsers: Map<string, number> = new Map();

export default new Elysia({ prefix: "/websocket", websocket: { idleTimeout: 20 * 60 } })
    .ws("/", {
        open(ws) {
            ws.subscribe("blahaj")
            ws.send(`blahaj_${getCount()}`);
            blahajInThreeSecondsPerUsers.set(ws.id, 0);
        },
        message(ws, body) {
            if (body === "ping") {
                return ws.send("pong");
            }

            // Anti spamhaj (Patent n°f3mb0y)
            blahajInThreeSeconds++;
            let userBlahaj = (blahajInThreeSecondsPerUsers.get(ws.id) ?? 0) + 1
            blahajInThreeSecondsPerUsers.set(ws.id, userBlahaj)
            setTimeout(() => {
                blahajInThreeSeconds--;
                blahajInThreeSecondsPerUsers.set(ws.id, (blahajInThreeSecondsPerUsers.get(ws.id) ?? 0) - 1)
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
