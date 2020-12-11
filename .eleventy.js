const { DateTime } = require('luxon');
const util = require('util');

const fs = require("fs");
const crypto = require("crypto");
const scrape = require('html-metadata');
const path = require('path');
const CleanCSS = require("clean-css");

// Helper function to escape HseTML
const escape = (unsafe) => {
    return (unsafe === null) ? null :
        unsafe.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
};

const linkPreview = (link, callback) => {

    // Helper function to format links
    const format = (metadata) => {
        let domain = link.replace(/^http[s]?:\/\/([^\/]+).*$/i, '$1');
        let title = escape((metadata.openGraph ? metadata.openGraph.title : null) || metadata.general.title || "").trim();
        let author = escape(((metadata.jsonLd && metadata.jsonLd.author) ? metadata.jsonLd.author.name : null) || "");
        let image = escape((metadata.openGraph && metadata.openGraph.image) ? (Array.isArray(metadata.openGraph.image) ? metadata.openGraph.image[0].url : metadata.openGraph.image.url) : null);
        let description = escape(((metadata.openGraph ? metadata.openGraph.description : "") || metadata.general.description || "").trim());

        if (title.length > 180) {
            title = title.replace(/^(.{0,180})\s.*$/s, '$1') + '…';
        }
        if (description.length > 180) {
            description = description.replace(/^(.{0,180})\s.*$/s, '$1') + '…';
        }
        return `<div class="lp"><a class="lp-img" href="${link}" target="_blank">` +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.733 67.733"><path fill="#424242" d="M0 0h67.733v67.733H0z"/><path fill="#fff" d="M33.867 13.547a20.32 20.32 0 00-20.32 20.32 20.32 20.32 0 0020.32 20.32 20.32 20.32 0 0020.32-20.32H50.8A16.933 16.933 0 0133.867 50.8a16.933 16.933 0 01-16.934-16.933 16.933 16.933 0 0116.934-16.934z"/><path fill="#fff" d="M26.383 36.361l4.99 4.99 19.955-19.957 4.99 4.99V11.415H41.35l4.99 4.99L26.382 36.36"/></svg>' +
            (image ? `<img src="data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" data-src="${image}" alt="${title}">` : '') +
            //          Use the below line without lazy loading
            //          (image ? `<img src="${image}" alt="${title}">` : '') +
            `</a><a class="lp-meta" href="${link}" target="_blank"><span class="lp-title">${title}<br></span><span class="lp-desc">${description}</span>` + `<div class="mt-1 text-sm">` +
            (author ? `<span class="lp-author">${author}</span> - ` : ``) +
            `<span class="lp-url">${domain}</span></div></a></div>`.replace(/[\n\r]/g, ' ');
    }

// Hash the link URL (using SHA1) and create a file name from it
let hash = crypto.createHash('sha1').update(link).digest('hex');
let file = path.join('_links', `${hash}.json`);

if (fs.existsSync(file)) {
    // File with cached metadata exists
    console.log(`[linkPreview] Using persisted data for link ${link}.`);
    fs.readFile(file, (err, data) => {
        if (err) callback("Reading persisted metadata failed", `<div style="color:#ff0000; font-weight:bold">ERROR: Reading persisted metadata failed</div>`);
        // Parse file as JSON, pass it to the format function to format the link
        callback(null, format(JSON.parse(data.toString('utf-8'))));
    });
} else {
    // No cached metadata exists
    console.log(`[linkPreview] No persisted data for ${link}, scraping.`);
    scrape(link).then((metadata => {
        if (!metadata) callback("No metadata", `<div style="color:#ff0000; font-weight:bold">ERROR: Did not receive metadata</div>`);
        // First, store the metadata returned by scrape in the file
        fs.writeFile(file, JSON.stringify(metadata, null, 2), (err) => { /* Ignore errors, worst case we parse the link again */ });
        // Then, format the link
        callback(null, format(metadata));
    }));
}
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

    eleventyConfig.addNunjucksAsyncFilter("linkPreview", linkPreview);

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
                    content += '<p class="transcript-line" id="t='+time+'"><a href="#t='+time+'"><span class="timestamp">'+time+'</span></a><span class="speaker"><strong>'+speaker+'</strong>'+ line.replace(time, '').replace(speaker, '') + '</span></p>';
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

    // Grab excerpts and sections from a file
    eleventyConfig.addFilter("section", require("./src/utils/section.js"));

    // compress and combine js files
    eleventyConfig.addFilter("jsmin", require("./src/utils/minify-js.js"));

    // minify the css output
    eleventyConfig.addFilter("cssmin", function (code) {
        return new CleanCSS({}).minify(code).styles;
    });

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
