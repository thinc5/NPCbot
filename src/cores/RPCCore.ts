import RPC from "discord-rpc";

export default class RPCCore {

    /**
     * discord-rpc instance.
     */
    private rpc: RPC.Client;

    public constructor() {
        this.rpc = new RPC.Client({ transport: "websocket"});
        const clientId: string = process.env.BOT_CLIENT_ID as string;
        const scopes: string[] = ["rpc", "rpc.api", "messages.read"];
        this.rpc.login({clientId, scopes})
        .catch((err) => {
            console.log(err);
        });
        this.rpc.on("ready", () => {
            this.rpc.setActivity({
                state: "thinking really hard Pepega",
                largeImageKey: "raf_750x1000_075_t_heather_grey_u1",
                largeImageText: "Pepega",
                smallImageKey: "raf_750x1000_075_t_heather_grey_u1",
                smallImageText: "raf_750x1000_075_t_heather_grey_u1",
            })
            .catch((err) => {
                console.log(err);
            });
        });
    }

    public getInstance(): RPC.Client {
        return this.rpc;
    }

}
