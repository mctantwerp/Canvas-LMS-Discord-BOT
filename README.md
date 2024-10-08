# ninjas2425-CanvasBot
![image](https://github.com/user-attachments/assets/97e68a62-f6e9-41d5-b2fe-708b49464401)


## Welcome to our guide to set up your own Canvas discord bot!
This bot is meant to gather all new announcements from your canvas courses and post them in a certain discord channel.
This bot will also send reminders in the set discord channels for any assignments that teachers create.

## Setup:

### Step 1: create a discord application in the discord developer portal
See: https://discord.com/developers/docs/intro
Select under OAuth2 -> OAuth2 URL Generator -> bot
![image](https://github.com/user-attachments/assets/3214d1f4-81eb-4497-ac98-64eef3c59186)
Then select under bot permissions -> administrator (In initBot.js we limit it's power by the intends.bitfields we give it see: https://discord.com/developers/docs/topics/gateway#list-of-intents for more info)
![image](https://github.com/user-attachments/assets/804290da-0a80-4d7b-8279-ed89da084422)
After that copy the generated url at the bottom of the screen and open it in a new tab, this will give you the option to invite the bot to a certain server.
(Note: make sure you are owner or have admin permissions of the server where you want to add the bot to)

### Step 2: clone the repository on your server
1. Run `npm install`
2. Create .env file (copy the example file)
3. Go back to your discord application, go the bot --> reset token --> this is the DISCORD_TOKEN= in your .env
4. Then go to [...](https://canvas.kdg.be/profile/settings) and generate your canvas api token (CANVAS_API=) (+new acces Token)
5. After that change the `CANVAS_COURSES_URL=` and `CANVAS_BASE_URL=` to your institute
6. Then fill in all your database info
- `DB_HOST=""`
- `DB_USER=""`
- `DB_PASSWORD=""`
- `DB_NAME=""`
7. Fill in `SERVER_ID` and `BOT_ID`. These are meant to add commands and circumvent the hour waiting time.
  (Note: you can find the `SERVER_ID` by rightclicking the server icon -> copy server ID / `BOT_ID` by rightclicking the bot inside the server -> copy user ID)
  

### Step 3: set up your database
In the repo you can find a discordbot_setupdb.sql file you can run these query's to create the right database.
Then you can use /addChannelWithCourse `Course_id` `Channel_id` `ChannelName`


## Usage

### slash-commands
We've added several usefull slash commands to create an easy user experience and give you access to all the information your users will need when deploying the bot in your discord server.
Wherever the command needs a parameter it will present you with options from data in the Database so that typing errors or non excisting courses can't be accessed.

#### /get_latest_announcement
This command will ask for a `course_name` and will then fetch the latest annoucement if it excist and send it in the channel but only for the user who asked it to see.

#### /get_upcoming_assignment
This will ask for a `course_name` and will return all upcoming assignments of the earliest date in the channel but only for the user who asked it to see.
(note: if there are 2 assignment of the same date they both will be shown)

#### /get_all_courses
Will return a list of all active courses in the database. This can help you while you are adding channels after you complete your setup.

