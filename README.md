![bananaponggif](files/bananapong.gif)
# BananaPong

Final project of the 42_cursus. (Version: 9)<br>

BananaPong is a onepage fullstack website where you can play pong with players among other things such as  JWT / 2fa authentification, a chat, private messages, friends list, profiles, a match-making system, a spectating system and modifications to the pong game such as different background and gamemodes.

BananaPong uses the following technologies:
- **VueJS**
- **NestJS**
- **PostgreSQL**

# Usage

### **Test server**: You can try our project on https://transcendence.nimon.fr/ (In case of error 500 at login contact me on slack @nimon or @nsimon)

**Before starting**, please replace the `FORTYTWO_ID`, `FORTYTWO_SECRET` and `AUTH_CALLBACK` variables in `docker/backend.env` with your own (from the 42 API).<br>
Then, run the following command:

```bash
docker-compose up --build
```
> We also provided shell scripts, you can use `start.sh` to start the project and `clean.sh` with the arguments `all` (to delete all the downloaded files) or `bbd` (only delete the database).<br>

If everything went well, you should be able to access the website at `http://localhost:8080`.
> If you'd like to modify additional settings, please feel free to do so in the others environment files.

> Upon first launch, you will be asked to authenticate with your 42 account. If you don't have one, please uncomment the `@Get('generate/:id')` in `/backend/src/auth/auth.controller.ts` and then call that method with your desired id.

# API

Our API is fully documented with swagger at `http://localhost:3000/api/` (using openapi3.0).<br>
Thanks to @Amoenus for the Swagger Dark Theme.
> Make sure sure you input a correct JWT token in the Authorize menu. Your JWT token is the one you get after logging in with your 42 account. It's located in the LocalStorage of your browser under the name token.

# Database

We use pgadmin4 to manage our database, it's located at `http://localhost:5000/`.<br>
The email is `transcendence@42paris.fr` and the password is `transcendence` you may change them in the `docker/pgadmin.env` file.
> Once logging in, the database may send a lot of logs to the console. We tried disabling them, but it doesn't work everytime.

We used TypeORM for our database, it provides a lot of features such as migrations, relations, and most importantly, security.

# Docs

**NESTJS** documentation is available at `https://docs.nestjs.com/`.<br>
**VUEJS** (vuejs 2) documentation is available at `https://vuejs.org/v2/guide/`.<br>
**VUEX** documentation is available at `https://vuex.vuejs.org/`.<br>
**SWAGGER** (OAS 3.0) documentation is available at `https://swagger.io/specification/`. (I Heavily recommend the use of https://editor.swagger.io)<br>
**TYPEORM** documentation is available at `https://typeorm.io/`.<br>
# Screenshots

![loginpng](files/login.png)
![2falogin](files/2falogin.png)
![finishloginpng](files/finishlogin.png)
![mainpng](files/main.png)
![changepng](files/change.png)
![2fa](files/2fa.png)
![chatpng](files/chat.png)
![dmpng](files/dm.png)
![friendspng](files/friend.png)
![profilepng](files/profile.png)
![pregamepng](files/pregame.png)
![gamepng](files/game.png)

## MADE WITH LOVE BY :

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/execrate0/"><img src="https://avatars.githubusercontent.com/u/52411215?v=4" width="100px;" alt=""/><br /><sub><b>execrate0 (ahallain)</b></sub></a><br /><a href="https://profile.intra.42.fr/users/ahallain" title="Intra 42"><img src="https://img.shields.io/badge/Paris-FFFFFF?style=plastic&logo=42&logoColor=000000" alt="Intra 42"/></a></td>
    <td align="center"><a href="https://github.com/assxios/"><img src="https://avatars.githubusercontent.com/u/53396610?v=4" width="100px;" alt=""/><br /><sub><b>Assxios (droge)</b></sub></a><br /><a href="https://profile.intra.42.fr/users/droge" title="Intra 42"><img src="https://img.shields.io/badge/Paris-FFFFFF?style=plastic&logo=42&logoColor=000000" alt="Intra 42"/></a></td>
    <td align="center"><a href="https://github.com/Nimon77/"><img src="https://avatars.githubusercontent.com/u/11821952?v=4" width="100px;" alt=""/><br /><sub><b>Nimon77 (nsimon)</b></sub></a><br /><a href="https://profile.intra.42.fr/users/nsimon" title="Intra 42"><img src="https://img.shields.io/badge/Paris-FFFFFF?style=plastic&logo=42&logoColor=000000" alt="Intra 42"/></a></td>
    <td align="center"><a href="https://github.com/ademjemaa/"><img src="https://avatars.githubusercontent.com/u/24757295?v=4" width="100px;" alt=""/><br /><sub><b>ademjemaa (adjemaa)</b></sub></a><br /><a href="https://profile.intra.42.fr/users/adjemaa" title="Intra 42"><img src="https://img.shields.io/badge/Paris-FFFFFF?style=plastic&logo=42&logoColor=000000" alt="Intra 42"/></a></td>
    <td align="center"><a href="https://github.com/mmaj0708/"><img src="https://avatars.githubusercontent.com/u/57007741?v=4" width="100px;" alt=""/><br /><sub><b>mmaj0708 (mmaj)</b></sub></a><br /><a href="https://profile.intra.42.fr/users/mmaj" title="Intra 42"><img src="https://img.shields.io/badge/Paris-FFFFFF?style=plastic&logo=42&logoColor=000000" alt="Intra 42"/></a></td>
  </tr>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
