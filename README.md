Toothpaste is an editor which allow you to compose an email template. There are several possibilities to create a template, with a basic model, by starting from scratch or by directly import html.

## Requirements
- Install Node
    - on OSX install [home brew](http://brew.sh/) and type ```brew install node```
    - on Windows install [chocolatey](https://chocolatey.org/) and type ```choco install nodejs```
- On OSX you can alleviate the need to run as sudo by [following these instructions](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md). I highly recommend this step on OSX
- Open terminal
- Type ```npm install -g gulp```

## Installing npm dependencies
Open terminal and type :

    npm install

## Installing bower dependencies
Open terminal and type :

    bower install

## Running
    gulp

All gulp tasks are specify on ```gulp-tasks``` folder. Paths declared in gulp tasks are in ```gulp.config.json``` file.

## Documentation

Go to https://crunchmail.github.io/toothpaste/

## Gulp commands

    gulp deploy

Build documentation and deploy documentation on the gh-pages branch
