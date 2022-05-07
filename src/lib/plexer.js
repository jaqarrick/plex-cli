const PlexAPI = require("plex-api");
const rp = require("request-promise");

const utils = require("./utils");
const constants = require("./constants");

class Plexer {
    constructor(opts) {
        const { baseUrl, authToken, outputDirectory, clientId } = opts;
        this.baseUrl = baseUrl;
        this.authToken = authToken;
        this.outputDirectory = outputDirectory;
        this.clientId = clientId;

        const plexUrl = new URL(baseUrl);
        const hostname = plexUrl.hostname;
        const port = plexUrl.port.length > 0 ? plexUrl.port : port;

        this.apiClient = new PlexAPI({
            hostname,
            port,
            token: this.authToken,
            options: {
                deviceName: constants.DEVICE_NAME,
                identifier: clientId,
            },
        });
    }

    async init(mode, mediaId) {
        if (mode === constants.EXPLORE_MODE) {
            console.log("init explore mode");
            try {
                await this.initExploreMode();
            } catch (e) {
                console.error(e);
            }
        } else if (mode === constants.DOWNLOAD_MODE) {
            if (!mediaId) {
                mediaId = await utils.promptForInput(
                    constants.PROMPT_MEDIA_ID_URL
                );
            }
            await this.initSingleDownload(mediaId);
        }
    }

    async initExploreMode() {
        try {
            const mediaKeys = await this.getMediaKeys();
            console.log(mediaKeys, "< media keys to download");
            // download the keys
        } catch (e) {
            console.error(e);
        }
    }

    async initSingleDownload(mediaId) {
        console.log("init download");
        const metadataUrl = `${this.baseUrl}/library/metadata/${mediaId}?X-Plex-Token=${this.authToken}`;
        const xmlMetadata = await rp(metadataUrl);
        let exitCode = 1;
        try {
            const metadata = await utils.parseXmlMetadata(xmlMetadata);
            const mediaUrl = `${this.baseUrl}${metadata.mediaPath}?download=1&X-Plex-Token=${this.authToken}`;
            const output = await utils.downloadMedia(
                mediaUrl,
                this.outputDirectory,
                metadata.title,
                metadata.container
            );
            console.log(constants.RESPONSE_SUCCESS);
            console.log(`Please check ${output}`);
            exitCode = 0;
        } catch (error) {
            console.error(constants.RESPONSE_FAILURE);
            console.error(error);
        }
        process.exit(exitCode);
    }

    async getMediaKeys() {
        console.log("Retrieving all sections...");
        const allSectionsData = await this.apiClient.find("/library/sections/");
        const allSectionTitles = allSectionsData.map((s) => s.title);
        console.log("Here are all of your sections:");
        console.table(allSectionTitles);
        const promptSectionIndex = await utils.promptForInput(
            `What section would you like to explore? [type a number between 0 and ${
                allSectionTitles.length - 1
            }]`
        );

        const promptSection = allSectionsData[promptSectionIndex];

        if (!promptSection) {
            throw "Invalid index selection. Try again with a different number.";
        }

        console.log(
            `You selected index ${promptSectionIndex}`,
            promptSection.title
        );
        console.log("Retrieving all collections in ", promptSection.title);
        const sectionKey = promptSection.key;

        const allCollectionData = await this.apiClient.find(
            `/library/sections/${sectionKey}/collections`
        );
        console.log("Here are all your collections in ", promptSection.title);
        console.table(allCollectionData.map((c) => c.title));
        const promptCollectionIndex = await utils.promptForInput(
            `What collection would you like to view? [Please choose a number between 0 and ${
                allCollectionData.length - 1
            }]`
        );

        const collectionKey = allCollectionData[promptCollectionIndex]?.key;
        if (!collectionKey) {
            throw "Invalid index. Please try again.";
        }
        const collectionTitle = allCollectionData[promptCollectionIndex].title;
        const collectionData = await this.apiClient.find(collectionKey);
        const collectionLogData = collectionData.map(({ title, year }) => ({
            title,
            year,
        }));
        console.log("Here are all the titles in ", collectionTitle);
        console.table(collectionLogData);
        const promptMultipleDownload = await utils.promptForInput(
            "Would you like to download all titles? [y/n]"
        );

        if (
            promptMultipleDownload.toLowerCase() === "y" ||
            promptMultipleDownload.toLowerCase() === "yes"
        ) {
            const allTitleKeys = collectionData.map((c) => c.key);
            console.log(
                "Downloading all titles in collection ",
                collectionTitle
            );
            return allTitleKeys;
        }

        const promptTitleIndex = await utils.promptForInput(
            `What would you like to download? [Choose number between 0 and ${
                collectionData.length - 1
            }]`
        );

        const titleKey = collectionData[promptTitleIndex]?.key;

        if (!titleKey) {
            throw "Invalid selection. Try again.";
        }
        return [titleKey];
    }
}

module.exports = Plexer;
