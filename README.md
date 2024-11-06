# The Unofficial Canvas Bot.
![image](https://github.com/user-attachments/assets/97e68a62-f6e9-41d5-b2fe-708b49464401)

## Welcome to the Setup Guide for Your Canvas Discord Bot! 🎉

This bot is designed to automatically fetch new announcements and assignments from your Canvas courses and post them in a designated Discord channel. The bot will also send reminders for assignments with a 7 day, 3 day, and 1 day notice.

## Setup:

### Step 1: Create a Discord Application in the Developer Portal
- Visit: [Discord Developer Portal](https://discord.com/developers/docs/intro)
- Navigate to **OAuth2** -> **OAuth2 URL Generator** -> **bot**.
  
  ![image](https://github.com/user-attachments/assets/3214d1f4-81eb-4497-ac98-64eef3c59186)

- Under **bot permissions**, select **administrator**. *(Don’t worry, its permissions are limited by the `intents.bitfields` we set. See [Discord Intents](https://discord.com/developers/docs/topics/gateway#list-of-intents) for more info.)*
  
  ![image](https://github.com/user-attachments/assets/804290da-0a80-4d7b-8279-ed89da084422)

- Copy the generated URL at the bottom and open it in a new tab. This will let you invite the bot to your server. *(Make sure you have admin permissions on the server to do this.)*

### Step 2: Clone the Repository on Your Server
1. Run `npm install`.
2. Create a `.env` file (use the example provided).
3. In your Discord application, go to **bot** -> **reset token**, and set this as the `DISCORD_TOKEN` in your `.env`.
4. Generate your Canvas API token via [Canvas Settings](https://canvas.kdg.be/profile/settings) and set this as `CANVAS_API`.
5. Update the `CANVAS_COURSES_URL` and `CANVAS_BASE_URL` with your institution's information.
6. Add your `SERVER_ID` and `BOT_ID` to the `.env`. This will help you set commands faster without the typical wait. *(Find your `SERVER_ID` by right-clicking your server icon -> **Copy Server ID**, and your `BOT_ID` by right-clicking the bot in the server -> **Copy User ID**).* Make sure to enable discord developer tools *(User settings -> Advanced -> enable "Developer mode")* for this to be an available option.

### Step 3: Set Up Your Database 🛠️
- Run the queries in the `discordbot_setupdb.sql` file from the repository to set up your database correctly.
- Use the command `/addChannelWithCourse Course_id Channel_id ChannelName` to link courses with channels.
- Fill in your database details in the .env file:
   - `DB_HOST=""`
   - `DB_USER=""`
   - `DB_PASSWORD=""`
   - `DB_NAME=""`

## Usage

### Slash Commands 🚀
We've built several useful slash commands to enhance the user experience and give your users access to important course information.

#### `/add_channel_to_course`
- This command allows you to add a course to the server. You will have to fill in the following:
  - Course_id (the number found in the URL when you have a canvas course opened, for example 49715).
  - Course_name (the name of the course, this can be anything you like).
  - Channel_discord_id (the ID of the designated discord channel you want to link the course to).
    - You can get this ID by right-clicking on a text-channel and selecting *"Copy Channel ID"* (make sure you have developer mode enabled for this to show up!).

#### `/get_latest_announcement`
- This command will ask for a `course_name` and fetch the latest announcement (if available) from that course. The result is visible only to the user who requested it.

#### `/get_upcoming_assignment`
- This command will ask for a `course_name` and return all upcoming assignments. Again, only visible to the requesting user.
  - *(Note: If multiple assignments share the same due date, they will all be shown.)*

#### `/get_all_courses`
- This command returns a list of all active courses in the database. Super handy when you’re adding new channels or checking course availability.

---

And that's it! 🎉 You’re now ready to deploy your CanvasBot and stay on top of announcements and assignments in Discord. Enjoy!

## Contact
Gilles Serrien - [serriengilles@gmail.com](mailto:serriengilles@gmail.com) - [LinkedIn](https://www.linkedin.com/in/gillesserrien/)

Rinus Van Linden - [rinus.vanlinden@gmail.com](mailto:rinus.vanlinden@gmail.com) - [LinkedIn](https://www.linkedin.com/in/rinus-van-linden-a8b454292/)
