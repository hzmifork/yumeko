"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_tags_1 = require("common-tags");
const presences = require("../../assets/json/presence.json");
class ReadyEvent {
    constructor(client) {
        this.client = client;
        this.listener = "ready";
    }
    async exec() {
        await assignDB(this.client);
        this.client.log.info(common_tags_1.stripIndents `
            ${this.client.log.color(this.client.user.tag, "FFFFFF")} is Ready to play. ${this.client.shard ? this.client.shard.ids.map(x => this.client.log.color(`#${x + 1}`, "00FFFF")).join(", ") : ""}
        `);
        this.client.lavalink.userID = this.client.user.id;
        presence.call(null, this.client);
        setInterval(presence.bind(null, this.client), 60000);
    }
}
exports.default = ReadyEvent;
function presence(client) {
    const { name, type, status } = presences[Math.round(Math.random() * presences.length)] || presences[0];
    client.user.setPresence({
        status,
        activity: {
            name: name.replace(/\user/g, client.user.username)
                .replace(/prefix/g, client.config.prefix)
                .replace(/listenmoe/g, client.nowplayMoe.jpop.data ? client.nowplayMoe.jpop.data.title : "LISTEN.moe")
                .replace(/shard:(id|count)/g, (_, type) => client.shard ? (type === "id" ? client.shard.ids.map(x => x + 1).join(", ") : client.shard.count) : 1),
            type
        }
    });
}
async function assignDB(client) {
    await client.db.connect();
    const values = await client.db.guild.all();
    for (const { key, value } of values) {
        const guild = client.guilds.cache.get(key);
        if (!guild)
            continue;
        guild.assignDatabase(value);
    }
}
