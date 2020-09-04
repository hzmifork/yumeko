import YumekoClient from "@yumeko/classes/Client";
import AmazedCommand from "@yumeko/commands/Reactions/Amazed";

export default class Poke extends AmazedCommand {
    public constructor(client: YumekoClient) {
        super(client, "poke");
    }
}