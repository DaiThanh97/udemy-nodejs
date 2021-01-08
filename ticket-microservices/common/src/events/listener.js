class Listener {
    constructor(client) {
        this.client = client;
        this.subject = "";
        this.queueGroupName = "";
        this.onMessage = (data, msg) => { };
        this.ackWait = 5 * 1000;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setManualAckMode(true)
            .setDeliverAllAvailable()
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        );

        subscription.on('message', msg => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg) {
        const data = msg.getData();
        return JSON.parse(data);
    }
}

module.exports = Listener;