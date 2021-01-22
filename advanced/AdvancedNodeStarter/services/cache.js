const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

// Override exec funtion
mongoose.Query.prototype.exec = async function () {
    const key = JSON.stringify(
        {
            ...this._conditions,
            conllection: this.mongooseCollection.name
        });

    const cacheValue = await client.get(key);
    if (cacheValue) {

    }

    // Original exec
    const result = await exec.apply(this, arguments);
}