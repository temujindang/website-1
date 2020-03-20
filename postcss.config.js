/* This was causing some of the css we need to be removed.
 * TODO [$5e7510282495610007ff3c42]: fix this and add it back in
 */
const purgecss = require('@fullhuman/postcss-purgecss')({

  // Specify the paths to all of the template files in your project
  content: [
    './src/site/**/*.njk'
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
})

module.exports = {
  plugins: [
    require('tailwindcss'),
    // require('@tailwindcss/ui'),
    require('autoprefixer'),
    ...process.env.NODE_ENV === 'production' ? [require('cssnano')] : []
  ]
};
