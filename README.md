# Web Starter NSE - Nunjucks, SCSS, ES6 Modules

## Overview
It's a starting package to get a web project up and running quickly but with careful thought into **production ready code**, using: Nunjucks templating, SCSS and ES6 Modules out of the box!

### Table of Contents:
* [Install](#install)

#### Key features:
* Modular build, include what you need, nothing else for all 3 technologies.
* [PurgeCSS](https://github.com/FullHuman/purgecss/) works out of the box, to make sure we include only what is needed.
* Gulp Config file.. set it.. and forget it [see example](https://youtu.be/tLq27iOW0R0?t=23s)
* ES6 Modules **OR** RequireJS ready
    * with examples of how to use both
* SCSS ready
* [Nunjucks](https://mozilla.github.io/nunjucks/) (HTML Templating) ready
* Production build gives the option for CDN base pathing across the board (replacing all local/relative pathing).
* Error handling, with terminal notifications when something went wrong (doesn't break watchmen listen chain)

## Install

Make sure you have NodeJS - [download](https://nodejs.org/)

***currently works with v7.10.1*** and **lower**

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

#### Javascript
There are two options for js bundling, ES6 Modules or RequireJS. Edit the `/gulp-config.js` file to turn on/off which, ES6 Modules are used by default.

* **ES6 Modules** (default)
    * starter file: `src/js/jsES6/main.js`
    * examples:
        * how to import a js module
        * use of services.js (helper functions)
        * purgeCSS javascript test (mention of a class only within js), purgeCSS works! It keeps the class `.fadeOut`... perfect.
    * code treeshaking happens on *production* build

* **RequireJS**
    * starter file: `src/js/requireJS/main.js`
    * examples `src/js/requireJS/modules/logo-fade-in.js`:
        * how to include a js module in RequireJS
        * use of services.js (helper functions)

#### Nunjucks (HTML)
A simple html templating structure that will pretty much handle everything you would need to, with Mozilla's [Nunjucks](https://mozilla.github.io/nunjucks/).

**With this implementation:**

* You can get as shared as you'd want to be
* You can get as specific as you need to be

**About the HTML Structure:**

* Creating a new page is as simple as adding 2 files:
    * `html/data/[pagename].json`
        * settable data
        * `<html>` language attribute
        * `<html>` class
        * `<body>` class
        * page title
        * page description
        * page keywords
        * robot meta tag (follow, index, etc.)
    * `html/pages/[pagename].nunjucks`
    * output will be: **pagename.html**
* Under `html/templates/layout.nunjucks` is the default layout but you can always create another layout if you'd need to, but this one pretty much covers it all.
    * ability to add extra *css* & *js* specific to a single page.
    * under `html/templates/partials/` directory, gives you the ability to create shared html blocks.
    * these html blocks can be used specifically for a single html page or shared on all html pages.

## Gulp Builds (dev/prod)

**Dev Build**
* Run: `npm run dev` when developing locally.
* TODO :: explain the entire process

**Production Build**
* Run: `npm run prod` when code is ready for production.
* TODO :: explain the entire process

built with :heart:, Caleb
