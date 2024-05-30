import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

const pjson = require('./package.json');
const pverersion = pjson.version.split(".");
if (pverersion[0] === "0")
    pverersion.shift()

const transformHtmlPlugin = data => ({
    name: 'insert-index-html-keys',
    transformIndexHtml: {
        enforce: 'pre',
        transform(html) {
            return html.replace(
                /<%=\s*(\S+)\s*%>/gi,
                (match, p1) => data[p1] || ''
            );
        }
    }
});

export default defineConfig({
    main: {
        resolve: {
            alias: {
                '@resources': resolve('resources')
            }
        },
        plugins: [externalizeDepsPlugin()]
    },
    preload: {
        plugins: [externalizeDepsPlugin()]
    },
    renderer: {
        resolve: {
            alias: {
                '@renderer': resolve('src/renderer/src')
            }
        },
        plugins: [
            transformHtmlPlugin({
                "htmlWebpackPlugin.options.title": pjson.name,
            }),
            vue()
        ]
    }
})
