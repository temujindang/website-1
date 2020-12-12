const { DateTime } = require('luxon');
const util = require('util');
const fs = require("fs");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const htmlmin = require("html-minifier");

// Helper function to escape HseTML
const escape = (unsafe) => {
    return (unsafe === null) ? null :
        unsafe.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
};

const markdownIt = require("markdown-it");
const options = {
    html: true,
    // Keep this to false so we can return after 80 chars.
    breaks: false,
    linkify: true
};

module.exports = function (eleventyConfig) {
    // Add RSS plugin.
    const pluginRss = require("@11ty/eleventy-plugin-rss");
    eleventyConfig.addPlugin(pluginRss);

    // Add filter for sitemap.
    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    // Markdown helpers
    eleventyConfig.setLibrary("md", markdownIt(options).use(require("markdown-it-anchor"), {
        level: 1,
    }));

    // Layout aliases for convenience
    eleventyConfig.addLayoutAlias('default', 'layouts/base.njk');
    eleventyConfig.addLayoutAlias('fourohfour', 'layouts/fourohfour.njk');
    eleventyConfig.addLayoutAlias('conf', 'layouts/conf.njk');

    // RSS last feed updated.
    eleventyConfig.addNunjucksFilter("rssFeedLastUpdatedDate", collection => {
        if( !collection || !collection.length ) {
            throw new Error( "Collection is empty in rssFeedLastUpdatedDate filter." );
        }

        // Newest date in the collection
        return new Date(Math.max(...collection.map(item => {return item.date}))).toUTCString();
    });
    eleventyConfig.addFilter('addCDATA', htmlContent => {
        return "<![CDATA[ " + htmlContent + " ]]>";
    });

    // Add filter for transcripts.
    eleventyConfig.addFilter("doTranscript", function(value) {
        // Read the file.
        if (!value || !value.length) {
            return "";
        }
        var content = "";
        const data = fs.readFileSync('src/site/_data/transcripts/' + value, 'UTF-8');
        const lines = data.split(/\r?\n/);

        // print all lines
        lines.forEach((line) => {
            if (!line.startsWith('[')){
                // Parse the time.
                var parts = line.split(' ');
                var time = parts[0];
                var speaker = parts[1];
                if (speaker && time && (time.startsWith('0') || time.startsWith('1') || time.startsWith('2') || time.startsWith('3') || time.startsWith('4') || time.startsWith('5') || time.startsWith('6') || time.startsWith('7') || time.startsWith('8') || time.startsWith('9'))) {
                    content += '<p class="transcript-line timecode-marker" id="t='+time+'" data-timecode="'+time+'"><a href="#t='+time+'"><span class="timestamp">'+time+'</span></a><span class="speaker"><strong>'+speaker+'</strong>'+ line.replace(time, '').replace(speaker, '') + '</span></p>';
                } else if (speaker && time) {
                    content += '<p class="transcript-line">'+ line + '</p>';
                }
            }
        });

        return content;
    });

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

    /**
     * Split the content into excerpt and remainder
     *
     * @param {String} str
     * @param {String [excerpt | remainder]} section
     *
     * If excerpt or nothing is passed as an argument, we return what was before the split marker.
     * If remainder is passed as an argument, we return the rest of the post
     *
     */
    eleventyConfig.addFilter("section", function(str, section) {
        var content = new String(str);
        var delimit = "\n<!--more-->\n";
        var parts = content.split(delimit);
        var which = section == 'remainder' ? 1 : 0;
        if(parts.length) {
            return parts[which];
        } else {
            return str
        }
    });


    // Minify the css output.
    eleventyConfig.addFilter("cssmin", function (code) {
        if (process.env.NODE_ENV === "production") {
            return new CleanCSS({}).minify(code).styles;
        } else {
            return code;
        }
    });

    // Compress and combine js files.
    eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (
        code,
        callback
    ) {
        if (process.env.NODE_ENV === "production") {
            try {
                const minified = await minify(code);
                callback(null, minified.code);
            } catch (err) {
                console.error("Terser error: ", err);
                // Fail gracefully.
                callback(null, code);
            }
        } else {
            callback(null, code);
        }
    });

    // Minify the HTML
    if (process.env.NODE_ENV === "production") {
        eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
            // Eleventy 1.0+: use this.inputPath and this.outputPath instead
            if( outputPath.endsWith(".html") ) {
                let minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true
                });
                return minified;
            }

            return content;
        });
    }

    // Static assets to pass through
    eleventyConfig.addPassthroughCopy({ "./src/site/_includes/fonts": "fonts" });
    eleventyConfig.addPassthroughCopy("./src/site/images");
    eleventyConfig.addPassthroughCopy("./src/site/robots.txt");

    return {
        dir: {
            input: "src/site",
            includes: "_includes",
            output: "dist"
        },
        passthroughFileCopy: true,
        templateFormats: [
            "md",
            "njk",
            "html",
            "css",
            "png",
            "jpg",
            "gif"
        ],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        dataTemplateEngine: "njk",
    };
};
