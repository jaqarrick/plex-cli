const rp = require('request-promise');

const PlexAPIClient = require('./api/plex-api');
const configure = require('./lib/configure');
const utils = require('./lib/utils');
const constants = require('./lib/constants');

const service = {
    main
};
module.exports = service;

async function main(argv) {
    const currentMode = utils.determineCliMode(argv);
    const config = configure.sourceConfigFile();
    const cliArgs = utils.processCliArgs(argv);
    const baseUrl =
        cliArgs.baseUrl ||
        config?.baseUrl ||
        (await utils.promptForInput(constants.PROMPT_BASE_URL));
    const authToken =
        cliArgs.authToken ||
        config?.authToken ||
        (await utils.promptForInput(constants.PROMPT_AUTH_TOKEN));
    const outputDirectory =
        cliArgs.outputDirectory ||
        config?.outputDirectory ||
        (await utils.promptForInput(constants.PROMPT_OUTPUT_DIR));

    const clientId = 
        cliArgs.clientId ||
        config?.clientId ||
        (await utils.promptForInput(constants.PROMPT_CLIENT_ID));
    
    const shouldSaveConfig = Boolean(cliArgs.saveConfig);
    if (shouldSaveConfig){
        configure.writeToConfigFile({
            baseUrl,
            authToken,
            outputDirectory,
            clientId,
        });
    }

    if (currentMode === constants.DOWNLOAD_MODE) {
        const mediaId =
            cliArgs.mediaId ||
            (await utils.promptForInput(constants.PROMPT_MEDIA_ID_URL));
        const metadataUrl = `${baseUrl}/library/metadata/${mediaId}?X-Plex-Token=${authToken}`;
        const xmlMetadata = await rp(metadataUrl);
        let exitCode = 1;
    
        try {
            const metadata = await utils.parseXmlMetadata(xmlMetadata);
            const mediaUrl = `${baseUrl}${metadata.mediaPath}?download=1&X-Plex-Token=${authToken}`;
    
            const output = await utils.downloadMedia(mediaUrl, outputDirectory, metadata.title, metadata.container);
            console.log(constants.RESPONSE_SUCCESS);
            console.log(`Please check ${output}`);
    
            exitCode = 0;
        } catch (error) {
            console.error(constants.RESPONSE_FAILURE);
            console.error(error);
        }
    
        process.exit(exitCode);
    } else if (currentMode === constants.EXPLORE_MODE) {
        const plexClient = new PlexAPIClient(baseUrl, authToken, clientId);
        const collections = await plexClient.getCollections()
        console.log(collections)
    }

    process.exit(0);
    
}
