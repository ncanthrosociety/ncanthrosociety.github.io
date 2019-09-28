# Developer's Guide

This static website is built using Node.js and other JavaScript build tools. It is designed to be deployed behind a
basic http server.

## Dependencies and Technologies

The following technologies are used to build this website and must be installed on the build system.

| Dependency | Link                   | Version |
| ---------- | ---------------------- | ------- |
| Node.js    | https://nodejs.org/en/ | v12     |

This website additionally makes use of the following tools. They are managed by the main build system and do not need
to be installed manually, but are listed for informational purposes.

| Tool          | Link                                       | Description                                  |
| ------------- | ------------------------------------------ | -------------------------------------------- |
| Gulp          | https://gulpjs.com/                        | JavaScript build system.                     |
| Pug           | https://pugjs.org/api/getting-started.html | HTML preprocessor.                           | 
| SCSS          | https://sass-lang.com/                     | CSS preprocessor.                            |
| Bootstrap     | https://getbootstrap.com/                  | CSS and components library. Fancy things.    |
| UwU           | https://i.redd.it/azpkt7tam4n01.jpg        | The good feelings you bring to this website. |
| JQuery        | https://jquery.com/                        | JavaScript UI library.                       |
| JQuery-easing | https://github.com/viskin/jquery-easing    | Advanced easing options. More fancy things.  |
| Fontawesome   | https://fontawesome.com/                   | Nice looking icons.                          |


## Setting up for Development

1. Install all required dependencies from [Dependencies and Technologies](#dependencies-and-technologies)
2. Clone the NC Anthro Society website repository using git. 
   ```
   git clone https://github.com/ncanthrosociety/ncanthrosociety.github.io.git
   ```
3. Run npm install.
   ```
   npm i
   ```
4. Run gulp default build task using npx.
   ```
   npx gulp
   ```
5. Open `index.html`!

## Deploying

To deploy a new version of the website, run `npx gulp` to rebuild-and vendor dependencies. Commit and push the changes 
to master. Changes are usually deployed automatically by GitHub within 10 minutes.
