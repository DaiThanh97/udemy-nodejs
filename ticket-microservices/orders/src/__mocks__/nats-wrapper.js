const natsWrapper = {
    getClient: () => ({
        publish: jest.fn().mockImplementation((subject, data, callback) => {
            callback();
        }),
    })
};
module.exports = natsWrapper;