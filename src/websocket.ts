import Elysia, { t } from "elysia";
import { getCount, updateCount } from "./utils/database";

let blahajInThreeSeconds = 0;
let blahajInThreeSecondsPerUsers: Map<string, number> = new Map();

export default new Elysia({ prefix: "/websocket", websocket: { idleTimeout: 20 * 60 } })
    .ws("/", {
        open(ws) {
            let id = ws.data.headers["CF-Connecting-IP"] ?? ws.id;

            ws.subscribe("blahaj")
            ws.send(`blahaj_${getCount()}_1`);
            blahajInThreeSecondsPerUsers.set(id, 0);

            if (isGoalReached()) return ws.send(`show_${btoa(process.env.GOAL_IMAGE_URL!)}`);
        },
        message(ws) {
            ws.send("pong");
        },
        close(ws) {
            ws.unsubscribe("blahaj");
        }
    })
    .post("/click", async ({ headers, server, body }) => {
        // Anti spamhaj (Patent n°f3mb0y)
        let ip = headers["CF-Connecting-IP"];
        blahajInThreeSeconds++;
        let userBlahaj = 0;
        if (ip) userBlahaj = (blahajInThreeSecondsPerUsers.get(ip) ?? 0) + 1;

        setTimeout(() => {
            blahajInThreeSeconds--;
            if (ip) blahajInThreeSecondsPerUsers.set(ip, (blahajInThreeSecondsPerUsers.get(ip) ?? 0) - 1)
        }, 3000);

        if (blahajInThreeSeconds >= 160 || userBlahaj >= 60) {
            server!.publish("blahaj", `spamhaj`);
        }

        let count = getCount() + 1;
        updateCount(count);
        server!.publish("blahaj", `blahaj_${count}_${body.uuid}`);

        if (isGoalReached()) return server!.publish("blahaj", `show_${btoa(process.env.GOAL_IMAGE_URL!)}`);

        return { ok: true }
    }, {
        body: t.Object({
            uuid: t.String()
        })
    })

function isGoalReached(): boolean {
    let count = getCount();
    return count >= Number(process.env.GOAL!);
}
