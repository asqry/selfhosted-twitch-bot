# Contributing to this project

- To contribute, all you have to do is:

> Clone this repo

> Push and commit your changes

- After this is done, please be patient as I do not frequently check this repo.
  - If you do not get a response back about your PR within 48 hours, feel free to contact me on Discord @ `Asqry#1234`

### Quality of code contributed:

- I'm not gonna be super strict about code quality, all I ask is that you make it clean-ish and easy to read (variable, function, and file names)
- This project uses the TMI.js library to connect to the Twitch IRC, the TMI.js docs are located [here](https://github.com/tmijs/docs/tree/gh-pages/_posts/v1.4.2)
  \
  \
  \
  \
  &nbsp;

# Self-hosting this project

- Hosting this project yourself is super simple! Just follow these instructions and you should have your very own bot running in no time!

## Setup Steps:

&nbsp;

### Installing Node.js

- Install the latest version of Node.js here:
  - [Windows (.msi)](https://nodejs.org/dist/v14.16.0/node-v14.16.0-x64.msi)
  - [MacOS (.pkg)](https://nodejs.org/dist/v14.16.0/node-v14.16.0.pkg)
  - [Linux (Source Code)](https://nodejs.org/dist/v14.16.0/node-v14.16.0.tar.gz)

&nbsp;

### Cloning this repository

- Download the repo in .zip form [here](https://github.com/seekeroftacos/selfhosted-twitch-bot/archive/main.zip)
- Locate the download location, and extract the downloaded files to your new empty folder

&nbsp;

### Installing npm libraries

- Locate the folder you just extracted
  - It should be called `selfhosted-twitch-bot-main`
- Open it in your favorite terminal application (Command Prompt, Powershell, Bash, Linux Terminal, etc)
  - Usually you can right-click or shift+right-click on the folder to open it in a terminal.
  - If not, open your terminal and type `cd <path>`
    - Path:
      - The location of your folder (e.g C:/Users/asqry/Desktop/Projects/twitchbot)
      - Example: `cd C:/Users/asqry/Desktop/Projects/twitchbot`
- Verify that the `package-lock.json` file exists
- Run the command `npm install`
  - NPM errors? Run the command `npm audit fix`
  - If that doesn't work, feel free to contact me on Discord @ `Asqry#1234` or open a new [issue](https://github.com/seekeroftacos/selfhosted-twitch-bot/issues/new)

&nbsp;

### Configuring your environment variables

- This project utilizes environment variables to store important information and constants

  - For your safety, do not share any of the contents of this file with anyone.

- Create a new file called `.env`
- Copy and paste the content of the `.env.example` file into your new `.env` file

- Replace the `ACTIVE_CHANNEL` variable with your Twitch username
- Replace the `BOT_USERNAME` variable with your bot account's username
- Replace the `COLOR` variable with the color you want your bot to use in chat
  > ```js
  > colors = [
  >   'Blue',
  >   'BlueViolet',
  >   'CadetBlue',
  >   'Chocolate',
  >   'Coral',
  >   'DodgerBlue',
  >   'Firebrick',
  >   'GoldenRod',
  >   'Green',
  >   'HotPink',
  >   'OrangeRed',
  >   'Red',
  >   'SeaGreen',
  >   'SpringGreen',
  >   'YellowGreen',
  > ];
  > ```
  - If your bot account has Twitch prime, you can use any [hex code](https://www.color-hex.com/) as your bot's color
- Replace the `OAUTH_TOKEN` variable with a token retrieved from [https://twitchapps.com/tmi](https://twitchapps.com/tmi)
- Replace the `CLIENT_ID` variable with your Client ID
  - Generating a Client ID:
    - Head to https://twitchtokengenerator.com
    - When prompted, press "Custom Scope Token"
    - Find the `CLIENT ID` field, and press "Copy" to copy your Client ID
- Replace the `TOKEN` variable with your access token
  - Generating your scope token:
    - On the same page as your Client ID:
      - Scroll down, and press "Generate Token!"
        - Authorize with Twitch
      - Solve the captcha
      - Verify that the account name listed at the top of the page is correct
      - Find the `ACCESS TOKEN` field, and press "Copy" to copy your access token
- Replace the `MONGO_CONNECTION_URI` variable with your MongoDB connection URL
  - Generating a connection URL:
    - Head to https://www.mongodb.com
    - In the top right corner, press "Try Free"
    - Create an account
    - Name your organization
    - Name your project
    - Choose "JavaScript" for your preferred language
    - Click "Create a Cluster" in the "Shared Clusters" box (FREE)
    - Choose the region closest to you
    - Feel free to change the Cluster name, any other changes to Tiers will change the price
    - Wait for your cluster to be created, this will take up to 3 minutes
    - On the cluster page, press "Connect"
    - For ease of use, press "Allow Access from Anywhere"
      - This is only ok if you do **NOT** share your connection URL
    - Enter the information for your first user
    - Press "Create Database User"
    - Press "Choose a connection method"
    - For your connection method, choose "Connect your application"
    - Copy the connection URL, and paste it in your `.env` file
    - Replace `<password>` with your database user password
    - Replace `myFirstDatabase` with whatever you want your database to be called (e.g `twitchbot`)
    - Save your changes to `.env`

## Using the bot

- To run the bot on your machine, open the folder in your Terminal application of choice (used above) and run the command `node .`
- If all goes well, the bot will say "Connected" in your Twitch chat
- Report any console errors in a new [issue](https://github.com/seekeroftacos/selfhosted-twitch-bot/issues/new)

#

### Custom Commands

- Use the `!cmds` alias rather than `!commands` to avoid conflict with other common chatbots such as [Nightbot](https://nightbot.tv) and [StreamElements](https://streamelements.com)

- To add a custom command, type `!cmds add <command> <response> -l <userlevel>`
  - Command:
    - The command you want the bot to listen for (e.g !twitter)
  - Response:
    - The response you want the bot to give (e.g https://twitter.com/asqrybot)
  - The `-l` flag
    - Valid userlevels:
      - owner
      - mod / moderator
      - sub / subscriber
      - vip
      - everyone (default)
    - Not including the `-l` flag will default to the `everyone` userlevel
- Example: `!cmds add !twitter https://twitter.com/asqrybot -l vip`

#

- To delete a custom command, type `!cmds delete <command>`
  - Command:
    - The command that the bot listens for (e.g !twitter)
- Example: `!cmds add !twitter https://twitter.com/asqrybot -l vip`

#

- To edit a custom command, type `!cmds edit <command> <response> -l <userlevel>`
  - Command:
    - The command that the bot listens for (e.g !twitter)
  - Response
    - The new response for the command (e.g https://twitter.com/twitchdev)
    - If you don't include a new response, the response of the command will remain the same
  - The `-l` flag (optional)
    - Valid userlevels:
      - owner
      - mod / moderator
      - sub / subscriber
      - vip
      - everyone (default)
    - If you don't include the `-l` flag, the userlevel of the command will remain the same
- Example: `!cmds edit !twitter https://twitter.com/twitchdev -l mod`

#

- Custom Command variables:
  - $(count)
    - A number that updates each time you use the command
  - $(user)
    - The username of the person who ran the command

#

## Default Commands

- The bot comes with a few premade commands that are not possible with custom commands

### !commands

- Usage: `!commands <add/edit/delete> <command> -l <userlevel>`

> Manage Custom Commands

- More information about this command can be found [here](https://github.com/seekeroftacos/selfhosted-twitch-bot#custom-commands)

### !ban

- Usage: `!ban <user> <reason>` (Requires moderator)

  > Bans the specified user

  - User:
    - The username or @ of the person you want to ban
  - Reason (Optional):
    - The reason for banning

### !unban

- Usage: `!unban <user>` (Requires moderator)

  > Unbans the specified user

  - User:
    - The username or @ of the person you want to unban
      - The user must already be banned from the channel

### !clear

- Usage: `!clear` (Requires moderator)

> Clears the chat

- This command does not have any required arguments

### !timeout

- Usage: `!timeout <user> <time> <reason>`

  > Times out the specified user

  - User:
    - The username or @ of the person you want to time out
  - Time:
    - The amount of time that you want the user to be timed out
      - Cannot be longer than 2 weeks
      - Combinations like 1d2h are allowed
      - Must end in [s](a 'Seconds'), [m](a 'Minutes'), [h](a 'Hours'), [d](a 'Days'), [w](a 'Weeks')
  - Reason (Optional):
    - The reason for the timeout

### !ping

- Usage: `!ping`

> Get the latency of your connection to the Twitch IRC

- This command does not have any required arguments

## Donate to this project

- Buy me a coffee! _(I don't drink coffee)_

- Starring the repo supports me just as much as a donation!
- I won't sit here and ask for your money, so check out these charities that I support:

  - The Trevor Project
    <br>
    <details closed>
    <summary>Description</summary>
    <br>
    <strong>Founded in 1998 by the creators of the Academy Award®-winning short film TREVOR, The Trevor Project is the leading national organization providing crisis intervention and suicide prevention services to lesbian, gay, bisexual, transgender, queer & questioning (LGBTQ) young people under 25.</strong>
    </details>
    <br>

    - Donate to The Trevor Project [here](https://give.thetrevorproject.org/give/63307/#!/donation/checkout)

  - Black Lives Matter
    <br>
    <details closed>
    <summary>Description</summary>
    <br>
    <strong>Black Lives Matter Global Network Foundation, Inc. is a global organization in the US, UK, and Canada, whose mission is to eradicate white supremacy and build local power to intervene in violence inflicted on Black communities by the state and vigilantes.</strong>
    </details>
    <br>

    - Donate to Black Lives Matter (BLM) [here](https://secure.actblue.com/donate/ms_blm_homepage_2019)

- If none of those seem appealing to you, feel free to donate to me directly [here](https://paypal.me/asqry)
