# Website

Source code for oxidecomputer.com.

* [Contributing](README.md#contributing)
    * [Running locally](README.md#running-locally)
    * [Compressing the javascript and css files](README.md#compressing-the-javascript-and-css-files)
    * [Adding a blog post](README.md#adding-a-blog-post)
    * [Adding a new team member](README.md#adding-a-new-team-member)

## Contributing

### Running locally

Install [hugo](https://gohugo.io/).

Run `hugo serve` to automatically update as you make changes. This will output
the url to the browser.

### Compressing the javascript and css files

Run `make dev` to compress all the javascript and css files into minified
versions. This runs in a docker container then outputs the results.

### Adding a blog post

Add a new markdown file to [`content/blog`](content/blog). Make sure it has the
following metadata at the top of the file:

```
+++
date = "2016-09-17T08:09:26-07:00"
title = "Post Title"
authors = ["name of author files in data/team"]
description = "Description of the post."
+++
```

The authors field can hold more than one author and is the name of the `toml`
file for the specific author in [`data/team`](data/team).

### Adding a new team member

Add a toml file to [`data/team`](data/team) in the following format:

```toml
name = "Jessie Frazelle"
title = "CPO"
twitter = "jessfraz"
github = "jessfraz"
linkedin = "https://www.linkedin.com/in/jessie-frazelle/"
blog = "https://jess.dev"
bio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
```
