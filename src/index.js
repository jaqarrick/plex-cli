const configure = require('./lib/configure');
const utils = require('./lib/utils');
const constants = require('./lib/constants');
const Plexer = require('./lib/plexer');

const service = {
  main,
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
  if (shouldSaveConfig) {
    configure.writeToConfigFile({
      baseUrl,
      authToken,
      outputDirectory,
      clientId,
    });
  }

  const plexer = new Plexer({
    baseUrl,
    authToken,
    outputDirectory,
    clientId,
  });

  await plexer.init(currentMode, cliArgs.mediaId);
  process.exit(0);
}
