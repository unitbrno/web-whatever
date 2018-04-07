# WhateverBox

## Requirements

This application requires PHP 7.2+, MySQL 5.7+, NPM (Node Package Manager) and Gulp. Gulp can be installed by command `npm install -g gulp`.

## Installation

1. Clone the repository.

2. Create file `app/config/config.local.neon`. Use file `config.local.template.neon` as a template.

3. Install JavaScript dependencies by command `npm install`.

4. Run migrations using command `php bin/console migrations:continue`.

## Running

After successful installation, you can start the application by command

`gulp watch`

This command compiles the assets (`gulp build`), runs the web server (`gulp run:server`), watches for changes in `www/src` directory and triggers re-compilation automatically. 

The application starts running on http://localhost:8000/.

## Guest user credentials

Email: guest@example.com

Password: guest
