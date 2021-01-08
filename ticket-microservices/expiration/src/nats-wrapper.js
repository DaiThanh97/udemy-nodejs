const nats = require('node-nats-streaming');

class NatsWrapper {
    #_client;

    getClient() {
        if (!this.#_client) {
            throw new Error('Nats client is not initialzed!');
        }
        return this.#_client;
    }

    connect(clusterId, clientId, url) {
        this.#_client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this.#_client.on('connect', () => {
                console.log("Connected to NATS");
                resolve();
            });

            this.#_client.on('error', err => {
                reject(err);
            });
        })
    }
}

const natsWrapper = new NatsWrapper();
module.exports = natsWrapper;