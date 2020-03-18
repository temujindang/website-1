const { DateTime } = require('luxon');
const util = require('util');

const markdownIt = require("markdown-it");
const options = {
  html: true,
  breaks: true,
  linkify: true
};

module.exports = function (eleventyConfig) {

  // Markdown helpers
  eleventyConfig.setLibrary("md", markdownIt(options));

  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');
  eleventyConfig.addLayoutAlias('fourohfour', 'layouts/fourohfour.njk');
  eleventyConfig.addLayoutAlias('conf', 'layouts/conf.njk');

  // a debug utility
  eleventyConfig.addFilter('dump', obj => {
    return util.inspect(obj)
  });

  // Date helpers
  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('LLLL d, y');
  });
  eleventyConfig.addFilter('htmlDate', dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('y-MM-dd');
  });

  // Grab excerpts and sections from a file
  eleventyConfig.addFilter("section", require("./src/utils/section.js"));

  // compress and combine js files
  eleventyConfig.addFilter("jsmin", require("./src/utils/minify-js.js"));

  // minify the html output when running in prod
  if (process.env.NODE_ENV == "production") {
    eleventyConfig.addTransform("htmlmin", require("./src/utils/minify-html.js"));
  }

  // minify the css output when running in prod
  // if (process.env.NODE_ENV == "production") {
  //   eleventyConfig.addTransform("CleanCSS", require("./src/utils/minify-css.js"));
  // }

  // rss feed ftw

  const pluginRss = require("@11ty/eleventy-plugin-rss");
  module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(pluginRss);
  };

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy("./src/site/fonts");
  eleventyConfig.addPassthroughCopy("./src/site/images");
  eleventyConfig.addPassthroughCopy("./src/site/css");

  return {
    dir: {
      input: "src/site",
      includes: "_includes",
      output: "dist"
    },
    passthroughFileCopy: true,
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
