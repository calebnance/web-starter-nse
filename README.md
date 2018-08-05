# Web Starter NSE - Nunjucks, SCSS, ES6 Modules

## Overview
It's a starting package to get a web project up and running quickly, using: Nunjucks templating, SCSS and ES6 Modules out of the box!

### Table of Contents:

#### Key features:
* Modular build, include what you need, nothing else for all 3 technologies.
* [PurgeCSS](https://github.com/FullHuman/purgecss/) works out of the box, to make sure we include only what is needed.
* Gulp Config file.. set it.. and forget it [see example](https://youtu.be/tLq27iOW0R0?t=23s)
* ES6 Modules **OR** RequireJS ready
    * with examples of how to use both
* SCSS ready
* Nunjucks (HTML Templating) ready
* Production build gives the option for CDN base pathing across the board (replacing all local/relative pathing).
* Error handling, with terminal notifications when something went wrong (doesn't break watchmen listen chain)

## Install

Make sure you have NodeJS - [download](https://nodejs.org/)

Once you have node on your machine:

* navigate into this project's root via your command line
* then run: `npm install`

## Technologies Used

#### SCSS
Everything for SCSS starts at: `src/scss/main.scss`

##### What's included by default:
* **PurgeCSS** is probably the biggest win of this entire project, it just makes everything better. All these DRY classes, that are present in the build, if you don't end up using them, they will be removed! [purgecss project](https://github.com/FullHuman/purgecss/)
* [reset.css](http://meyerweb.com/eric/tools/css/reset/): v2.0
* mixins:
    * media breakpoints [pulled from bootstrap 4](https://github.com/twbs/bootstrap/blob/v4-dev/scss/mixins/_breakpoints.scss)
    * opacity (also cases for IE's filter alpha())
* variables:
    * animation settings
    * breakpoints
    * colors
* animations and animation helpers
* font face support
* easily turn on and off what gets included
#### JS
* todo

#### Nunjucks (HTML)
* todo

## Gulp Builds (dev/prod)

built with :heart:, Caleb
