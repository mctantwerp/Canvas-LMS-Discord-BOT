# 🤖 The unofficial bot for Canvas LMS!

## Welcome to the Guide for Setting Up Your Own Canvas Discord Bot!
This bot is designed to gather new announcements from your Canvas courses and post them in specific Discord channels. It will also send reminders for any assignments that teachers create.

## Setup Instructions

### Step 1: Create a Discord Application in the Discord Developer Portal
1. Visit the [Discord Developer Portal](https://discord.com/developers/docs/intro).
2. Under **OAuth2**, navigate to **OAuth2 URL Generator** and select **bot**.
   ![OAuth2 URL Generator](https://github.com/user-attachments/assets/3214d1f4-81eb-4497-ac98-64eef3c59186)
3. Next, select the following bot permissions:
   - Send Messages
   - View Channels
   - Read Message History
   - Use Slash Commands
   ![Bot Permissions](https://github.com/user-attachments/assets/c354ae8d-8b4a-4c4e-ac3c-c91d939d2d86)

4. Copy the generated URL at the bottom of the screen and open it in a new tab to invite the bot to your desired server.

### Step 2: Clone the Repository on Your Server
1. Run the following command to install dependencies:
   ```bash
   npm install


