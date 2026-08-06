# ForestWork Tournament Website
This is a record archival based website which records all the event that hosted by an organisation called "ForestWork". Current events hosted are: *Mahjong Tournament* from MahjongSoul, *Ultra Hardcore*, *BoxWar* from Minecraft, and *Plazma League* from Plazma Burst 2.

## Tech Stack
- **Framework:** Nuxt 4 from Vue
- **Language:** Mainly TypeScript
- **Styling:** Tailwind CSS
- **Database/CMS:** Supabase with PostgreSQL
- **Admin Module:** 

## Raw Score Data Scope:
- **MahjongSoul**: Official Tournament Website + Another Repo Script of retrieval. Record inserted into supabase manually using csv.
- **PlazmaBurst**: AppSmith to input the scores.

## Development Rules (The "Absolute Rules")
- [Rule 1: Website Development always first be static mock, later turn into dynamic API call when mentioned.]
- [Rule 2: Reuse Components if possible, I hate copy and pasting the same code if they purpose the same aim.]
- [Rule 3: Leave functionality for future user login connection using discord login feature.]
- [Rule 4: For Database, refer store at "mahjong" schema if it is related to MahjongSoul, "minecraft_uhc" schema if it is related to UHC, "minecraft_boxwar if it is related to boxwar, "plazmaburst" schema if it is related to Plazma Burst 2.]
- [Rule 5: Unless the SQL call is definitively bug-free, where confirmed by me, then you can compile that specific function into rpc.function. Otherwise, do not automatically convert into rpc call first, use generic API call supabase for data retrieval.]
- [Rule 6: Unless the calculation is overly complex where coincide with Linus's personality, otherwise the only 2 actions backend does is, call API, retrieve and format API result to frontend to use.]

## Project Structure
- Standard Nuxt 4 format.

## Plugin Installed
- Check package.json for details.

## Current Goal
- TBA