const PlexAPI = require("plex-api");

const constants = require("./constants");

class PlexAPIClient {
    constructor(address, token, clientId, port) {
        const plexUrl = new URL(address);
        this.hostname = plexUrl.hostname;
        this.port = plexUrl.port.length > 0 ? plexUrl.port : port;

        if (!this.port) {
            throw "No port specified";
        }
        console.log(`initiating client at ${this.hostname}; port ${this.port}`);
        this.client = new PlexAPI({
            hostname: this.hostname,
            port: this.port,
            token,
            options: {
                deviceName: constants.DEVICE_NAME,
                identifier: clientId,
            },
        });
    }

    getCollections = async () => {
        const allSections = await new Promise(async (res) => {
            const data = await this.client.find("/library/sections/");
            const sections = data.map(({ title, key }) => ({
                title,
                key,
            }));

            // todo prompt cli to chose different collections
            console.log(
                await this.client.find("/library/sections/1/collection")
            );

            res(sections);
        });

        const results = allSections;
        return results;
    };
}

module.exports = PlexAPIClient;
