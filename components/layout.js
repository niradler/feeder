const { html } = require('@statikly-stack/render')
const footer = require('./footer')
const header = require('./header')
const context = require('data.json');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = ({ body }) => {
    return html`
<html lang="en" data-theme="${context.defaultTheme}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${context.title}" />
    <meta property="og:description" content="${context.title}" />
    <meta property="og:image" content="/public/assets/fav.png" />
    <meta property="og:site_name" content="${context.title}" />
    <meta name="description" content="${context.title}" />
    <link rel="icon" type="image/png" href="/public/assets/fav.png" />
    <title>${context.title}</title>
    <link href="/public/css/daisyui.css" rel="stylesheet" type="text/css" />
    <link href="/public/css/tailwind.min.css" rel="stylesheet" type="text/css" />
    <script src="/assets?asset=htmx.org/dist/htmx.js"></script>
    <script src="/assets?asset=htmx.org/dist/ext/sse.js"></script>
    <script src="/public/js/scripts.js" defer></script>
    <script src="/public/js/debug.js" defer></script>
</head>

<body class="container mx-auto">
    <div class="flex flex-col justify-between">
        ${header(context)}
        <main class="">${body(context)}</main>
        ${footer(context)}
    </div>
</body>

</html>
    `
}