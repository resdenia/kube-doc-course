import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  private _client?: Stan; //304 lesson from Microservices questionMark(?) it means that for ts we declare that value can be undefined

  get client() {
    if (!this._client) {
      throw new Error('Cannot access Nats client before connecting');
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      //this._client!.on('connect', () => {
      // we are put ! to handle ts error( that we declare to ts that we are know risks)

      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
