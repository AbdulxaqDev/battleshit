# Scoring: Websocket battleship server

[Scoring](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/battleship/score.md?plain=1)

c
Deadline: **2024-02-27 01:00**

## Basic Scope

- Websocket
- [x] **+6** Implemented workable websocket server
- [x] **+6** Handle websocket clients connection/disconnection properly
- [x] **+10** Websocket server message handler implemented properly
- [x] **+10** Websocket server message sender implemented properly
- User
- [x] **+5** Create user with password in temprorary database
- [x] **+5** User validation
- Room
- [x] **+6** Create game room
- [x] **+6** Add user to game room
- [x] **+6** Start game
- [x] **+6** Finish game
- [x] **+8** Update room's game state
- [x] **+4** Update player's turn
- [x] **+8** Update players winner table
- Ships
- [x] **+10** Locate ship to the game board
- Game
- [x] **+8** Attack
- [x] **+4** Random attack

## Advanced Scope

- **+30** Task implemented on Typescript
- **+20** Codebase is separated (at least 4 modules)
- **+30** Make bot for single play (optionally)

## Forfeits

- **-95% of total task score** any external tools except `ws`, `cross-env`, `dotenv`, `tsx`, `typescript`, `ts-node`, `ts-node-dev`, `nodemon`, `eslint` and its plugins, `webpack` and its plugins, `prettier`, `@types/*` and testing tools (for example, Jest, Mocha, AVA, Jasmine, Cypress, Storybook, Puppeteer)
- **-30% of total task score** Commits after deadline (except commits that affect only Readme.md, .gitignore, etc.)
- **-10** Missing PR or its description is incorrect
- **-10** No separate development branch
- **-10** Less than 3 commits in the development branch, not including commits that make changes only to `Readme.md` or similar files (`tsconfig.json`, `.gitignore`, `.prettierrc.json`, etc.)
