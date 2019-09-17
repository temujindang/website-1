# Website

Source code for oxidecomputer.com.

## Contributing

### Running locally

Install [hugo](https://gohugo.io/).

Run `hugo serve` to automatically update as you make changes. This will output
the url to the browser.

### Compressing the javascript and css files

Run `make dev` to compress all the javascript and css files into minified
versions. This runs in a docker container then outputs the results.
