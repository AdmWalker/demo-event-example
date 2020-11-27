import { Command } from "@oclif/command";
import {
  Connection,
  IBaseTransaction,
  LedgerEvents,
  TransactionHandler,
  KeyHandler,
  IKey,
  KeyType,
} from "@activeledger/sdk";
import { ActiveRequest } from "@activeledger/activeutilities";

// Location of an Activeledger Node API service
const coreURL = "http://localhost:5261";

// Connection to Activeledger
const connection = new Connection("http", "localhost", 5260);

// CLI
class Events extends Command {
  static description = "Listen to Activeledger Events";

  static args = [{ name: "operation" }];
  masterKey!: IKey;

  async run() {
    const { args } = this.parse(Events);

    if (args.operation === "sender") {
      this.sender();
    } else {
      // Listen for events
      this.listner();
    }
  }

  private async sender() {
    // Setup Keys
    const key = await this.generateKey();
    // Transaction Handler
    const txHandler = new TransactionHandler();

    // Build Transaction
    const txBody: IBaseTransaction = {
      $tx: {
        $namespace: "demo",
        $contract: "new",
        $i: {
          demo: {
            publicKey: key.key.pub.pkcs8pem, // Self Signed
            metadata: Math.random().toString(36).substring(7),
          },
        },
      },
      $sigs: {},
      $selfsign: true,
    };

    // Sign Transaction & Send
    const txSig = await txHandler.signTransaction(txBody, key);
    console.log(await txHandler.sendTransaction(txSig, connection));
  }

  private listner() {
    // Manages the realtime connection to Activeledger
    const eventReciever = new LedgerEvents(coreURL);

    // Subscribe to a specific event raised inside an Activeledger smart contract
    eventReciever.subscribeToEvent(
      async (data: any) => {
        // Output the new activity stream id
        console.log(data);

        // Fetch stream
        const stream = await this.getStream(data.streamId);
        console.log(stream);
        console.log("=======================");
      },
      {
        contract: "new", // Name of the running contract (or id)
        event: "newstream", // The event name raised inside the contract
      }
    );
  }

  private async generateKey(): Promise<IKey> {
    if (this.masterKey) {
      return this.masterKey;
    }

    // Create Key
    const keyHandler = new KeyHandler();
    const ppk: IKey = await keyHandler.generateKey(
      "user",
      KeyType.EllipticCurve
    );

    ppk.identity = "demo";

    // Update Key Runtime
    this.masterKey = ppk;
    return this.masterKey;
  }

  private async getStream(id: string): Promise<unknown> {
    return ((await ActiveRequest.send(`${coreURL}/api/stream/${id}`, "GET"))
      .data as any).stream;
  }
}

export = Events;
