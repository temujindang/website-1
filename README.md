# Oxide Computer Company website

[![Netlify Status](https://api.netlify.com/api/v1/badges/0cf78df6-6274-4d35-b329-23b354d037e7/deploy-status)](https://app.netlify.com/sites/gracious-heisenberg-b8f5b9/deploys)
[![broken link checker](https://github.com/oxidecomputer/website/workflows/broken%20link%20checker/badge.svg)](https://github.com/oxidecomputer/website/actions?query=workflow%3A%22broken+link+checker%22)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Prerequisites](#prerequisites)
- [Stack](#stack)
- [Running locally](#running-locally)
- [Adding new content](#adding-new-content)
  - [Blog posts](#blog-posts)
    - [Rich links](#rich-links)
  - [Team members](#team-members)
- [Previewing the production build](#previewing-the-production-build)
- [Styling with TailwindCSS](#styling-with-tailwindcss)
  - [Global CSS utilities.](#global-css-utilities)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Prerequisites

- [Node and NPM](https://nodejs.org/)
- [Netlify CLI](https://www.npmjs.com/package/netlify-cli)

## Stack

- [Eleventy](https://11ty.dev) for templates and site generation
- [Tailwindcss](https://tailwindcss.com) for a utility first CSS workflow
- [PurgeCSS](https://www.purgecss.com/) for optimizing CSS output
- [UglifyJS](https://www.npmjs.com/package/uglify-js) for a simple JS build pipeline
- [Netlify CLI](https://www.npmjs.com/package/netlify-cli) for Netlify dev pipeline and local replication of prod environment


## Running locally

```bash

# install Netlify CLI globally
npm install netlify-cli -g

# install the project dependencies
npm install

# run the build and server locally
netlify dev
```

## Adding new content 

### Blog posts

Add a new markdown file to [`src/site/blog`](src/site/blog). Make sure it has the
following metadata at the top of the file. To make things easy on yourself, duplicate an existing post.

```
---
title: 'Post title'
subtitle: 'Post subtitle (if any)'
date: 2020-02-03T23:00:00
tags: ['post', 'announcements']
authors: ["first-last", "first-last", "first-last"]
description: |
    A description that is used in snippets.
---
```

~~The authors field can hold more than one author and is the name of the `json`
file for the specific author in [`_data/team`](_data/team).~~

Make sure to add a `description` to your post for the main pages as well as social 
media cards.

#### Rich links

If you want to use rich links add them to a post in this format:
```
{{"https://oxide.computer/podcast/on-the-metal-10-season-1-wrap-up/" | linkPreview | safe}}
```

### Team members

Add a json file to [`_data/team`](data/team) in the following format:

```json
{
  "weight": 1,
  "name": "Jessie Frazelle",
  "title": "CPO",
  "twitter": "jessfraz",
  "github": "jessfraz",
  "linkedin": "https://www.linkedin.com/in/jessie-frazelle/",
  "blog": "https://jess.dev"
}
```

The order for the team page is currently set in `_date/team/members.json`.

## Previewing the production build

When building for production, an extra build step will strip out all CSS classes not used in the site. This step is not performed during the automatic rebuilds which take place during dev.

```bash
# run the production build
npm run build
```

## Styling with TailwindCSS

This site uses TailwindCSS to offer utility CSS classes and provide a rapid means to styling the site. This means that most styling can be done without writing any additional CSS. Instead, utility classes can be added directly to the HTML. This may not be to everyone's tastes, but it can provide some very rapid development and also offer surprising levels of familiarity for those used to working in this way (since the conventions and classes are not _per site_.)

While running/developing locally, the `npm run start` command will recompile the site as files are saved and this includes the CSS pipeline from Tailwind.

### Global CSS utilities.

A small number of bespoke CSS rules are provided for efficiency of repeated or global classes. These reside in `src/site/_includes/css/tailwind.css`

<!-- ## Just clone and go

You can also get started with your own copy of this site cloned to your GitHub account and deployed to Netlify with a configured CI/CD pipeline and HTTPS by clicking the button below and following the instructions.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/philhawksworth/eleventail) -->
