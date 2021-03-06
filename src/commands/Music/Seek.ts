import Command from "@yumeko/classes/Command";
import type { Message } from "discord.js";
import { readableTime } from "@yumeko/util/Util";
import { DeclareCommand, isMusicPlaying, isMemberInVoiceChannel, isSameVoiceChannel, inhibit, isInStream, constantly } from "@yumeko/decorators";

@DeclareCommand("seek", {
    aliases: ["seek", "jumpto"],
    description: {
        content: (msg): string => msg.ctx.lang("COMMAND_MUSIC_SEEK_DESCRIPTION"),
        usage: "seek <time position>",
        examples: ["seek 00:30"]
    },
    category: "music",
    permissions: {
        user: ["MANAGE_GUILD"]
    },
    args: [
        {
            identifier: "time",
            match: "single",
            type: "timespan",
            prompt: (msg): string => msg.ctx.lang("COMMAND_MUSIC_SEEK_PROMPT")
        }
    ]
})
export default class extends Command {
    @constantly
    @isInStream()
    @isMusicPlaying()
    @isMemberInVoiceChannel()
    @isSameVoiceChannel()
    @inhibit((msg, { time }: { time: number }) => {
        if (!msg.guild!.music.song!.isSeekable) return msg.ctx.lang("COMMAND_MUSIC_SEEK_NOT_SEEKABLE");
        if (msg.guild!.music.song!.length < time || time < 0)
            return msg.ctx.lang("COMMAND_MUSIC_SEEK_TOO_LONG_OR_SHORT");
    })
    public async exec(msg: Message, { time }: { time: number }): Promise<Message> {
        const { music } = msg.guild!;
        music.seek(time);
        return msg.ctx.send(msg.ctx.lang("COMMAND_MUSIC_SEEK_SEEKED", readableTime(time)));
    }

    public ignore(msg: Message): boolean {
        return !!msg.guild!.music.song && (msg.guild!.music.listeners.length < 2 ||
            msg.guild!.music.song.requester.id === msg.author.id);
    }
}