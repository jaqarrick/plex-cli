# plexer

🚧 WIP 🚧

`plexer` is a command-line interface utility for downloading media files from a Plex server.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [FAQ](#faq)

## Features

- Download Plex media and save it to a local directory.
- Explore media collections and download them as a batch.

## Quick Start

### Install the Tool

```bash
npm install -g plexer
```

### Use the Standalone Download Command

```bash
$ plexer download

> Base URL: https://255-255-255-255.dygevsK8qUWrIXGjXFzhFQDjgbpQWpnW.plex.direct:32400
> Media ID: 123456
> Auth Token: wa3iJvt3nKzi12Pr1Zxq
> Media Output Directory: ~/Downloads
  Downloading [====================] 1469081/bps 100% 0.0s
Success! File downloaded without error.
Please check /Users/evanklein/Downloads/Inception.mp4
```

### Explore and Download Media Collections
```bash
$ plexer explore
```

#### Non-interactive mode

To use plexer in a non-interactive mode, supply the following CLI flags:

```bash
$ plexer download \
  --baseUrl https://255-255-255-255.dygevsK8qUWrIXGjXFzhFQDjgbpQWpnW.plex.direct:32400
  --mediaId 123456 \
  --authToken wa3iJvt3nKzi12Pr1Zxq \
  --outputDirectory ~/Downloads
```

```bash
$ plexer explore \
  --baseUrl https://255-255-255-255.dygevsK8qUWrIXGjXFzhFQDjgbpQWpnW.plex.direct:32400
  --mediaId 123456 \
  --authToken wa3iJvt3nKzi12Pr1Zxq \
  --outputDirectory ~/Downloads \
  --clientId
```
Note that `clientId` can be a random string. This allows the Plex API to uniquely identify your device.

#### Saving your flag values
Use `--saveConfig true` to store your authToken, clientId, and baseUrl to your device for future use. 
## FAQ

### What are some example inputs for the CLI prompts
#### Base URL
**The base URL of the Plex server.**

_Example: `https://255-255-255-255.dygevsK8qUWrIXGjXFzhFQDjgbpQWpnW.plex.direct:32400`_

#### Media ID
**The ID of the media item in Plex server.**
Obtain this value by navigating to the desired media item on Plex server. Inspect the query parameter `key`. Its value will have the schema `/library/metadata/<mediaId>`

_Example: `123456`_

#### Auth Token
**The authentication token used to make requests via the Plex server API.**
Inspect the network logs in the browser when playing the media item in Plex server. Search for `X-Plex-Token`, which is the name of the query parameter Plex uses to pass its authentication token in requests.

_Example: `wa3iJvt3nKzi12Pr1Zxq`_

#### Media Output Directory
**The directory which will contain the downloaded media file.**
This value can be an absolute or relative path.

_Example: `~/Downloads`_

#### ClientId
**A string that identifies your device to the Plex API**

#### Save Config Option
With `--saveConfig true` values for Auth Token, BaseUrl, Port, and Client Id will be saved to a config file on your device (`~/.plexconf`).

## Attribution
This project is a fork of Evan Klein's [plex-dl](https://github.com/elklein96/plex-dl) CLI, which is the foundation of the download process in this interface. 
