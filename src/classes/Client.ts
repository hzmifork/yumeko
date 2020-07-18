import { Client } from "discord.js";
import CommandCollector from "../libs/CommandCollector";
import Context from "../libs/MessageContext";
import Logger from "../libs/Logger";
import eventLoader from "../libs/EventLoader";

import "../extension";

// i don't want compiler compile these one
const config = require("../../config.json");

export default class YumekoClient extends Client {
    public collector = new CommandCollector(this);
    public context = new Context();
    public config = config;
    public log = new Logger();
    public constructor() {
        super({
            fetchAllMembers: true,
            disableMentions: "everyone"
        });
        eventLoader(this);
        this.collector.loadAll();
        this.on("error", this.log.error);
        this.on("warn", this.log.warn);
    }
}