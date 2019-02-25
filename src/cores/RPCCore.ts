import RPC from "discord-rpc";

export default class RPCCore {

    /**
     * discord-rpc instance.
     */
    private rpc: RPC.Client;

    public constructor() {
        this.rpc = new RPC.Client({ transport: "ipc"});
        const clientId: string = process.env.BOT_CLIENT_ID as string;
        console.log(clientId);
        const scopes: string[] = ["rpc", "rpc.api"];
        this.rpc.login({clientId, scopes})
        .catch((err) => {
            console.log("Login: " + err);
        });
        this.rpc.on("ready", () => {
            RPC.register(clientId);
            this.rpc.setActivity({
                state: "thinking really hard Pepega",
                largeImageKey: "raf_750x1000_075_t_heather_grey_u1",
                largeImageText: "Pepega",
                smallImageKey: "raf_750x1000_075_t_heather_grey_u1",
                smallImageText: "raf_750x1000_075_t_heather_grey_u1",
            })
            .catch((err) => {
                console.log("Activity: " + err);
            });
        });
    }

    public getInstance(): RPC.Client {
        return this.rpc;
    }

}
