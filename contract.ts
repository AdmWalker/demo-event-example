import { Activity, Event } from "@activeledger/activecontracts";

/**
 * New Activeledger Smart Contract
 *
 * @export
 * @class MyContract
 * @extends {Standard}
 */
export default class MyContract extends Event {
  /**
   * Quick Transaction Check - Verify Input Properties (Known & Relevant Transaction?)
   * Signatureless - Verify if this contract is happy to run with selfsigned transactions
   *
   * @param {boolean} selfsigned
   * @returns {Promise<boolean>}
   * @memberof MyContract
   */
  public verify(selfsigned: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // Allow Self signed transaction (anonymous)
      resolve(true)
    });
  }

  /**
   * Voting Round, Is the transaction request valid?
   *
   * @returns {Promise<boolean>}
   * @memberof MyContract
   */
  public vote(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.ActiveLogger.debug("Voting Round - Automatic True");
      resolve(true);
    });
  }

  /**
   * Prepares the new streams state to be comitted to the ledger
   *
   * @returns {Promise<any>}
   * @memberof MyContract
   */
  public commit(): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      // Create a new activity stream
      const newStream = this.newActivityStream("demo");
      newStream.setState({metadata : this.transactions.$i.demo.metadata});

      this.event.emit("newstream", { streamId: newStream.getId() })

      this.

    });
  }
}

