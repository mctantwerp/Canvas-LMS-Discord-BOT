# ninjas2425-CanvasBot
![image](https://github.com/user-attachments/assets/97e68a62-f6e9-41d5-b2fe-708b49464401)


## Welcome to our guide to set up your own Canvas discord bot!
This bot is meant to gather all new announcements from your canvas courses and post them in a certain discord channel.
This bot will also send reminders in the set discord channels for any assignments that teachers create.

## Setup:

### Step 1: create a discord application in the discord developer portal
see: https://discord.com/developers/docs/intro
select under OAuth2 -> OAuth2 URL Generator -> bot
![image](https://github.com/user-attachments/assets/3214d1f4-81eb-4497-ac98-64eef3c59186)
then select under bot permissions -> send messages, view channels, read message history, use slash commands
![image](https://github.com/user-attachments/assets/c354ae8d-8b4a-4c4e-ac3c-c91d939d2d86)

after that copy the generated url at the bottom of the screen and open it in a new tab, this will give you the option to invite the bot to a certain server.

### Step 2: clone the repository on your server
1. run `npm install`
2. create .env file (copy the example file)
3. go back to your discord application, go the bot --> reset token --> this is the DISCORD_TOKEN= in your .env
4. then go to ... and generate your canvas api token (CANVAS_API=)
5. after that change the `CANVAS_COURSES_URL=` and `CANVAS_BASE_URL=` to your institute
6. then fill in all your database info
- `DB_HOST=""`
- `DB_USER=""`
- `DB_PASSWORD=""`
- `DB_NAME=""`

### Step 3: set up your database
in the repo you can find a discordbot_setupdb.sql file you can run these query's to create the right database
then you can use /addChannelWithCourse `Course_id` `Channel_id` `ChannelName`

