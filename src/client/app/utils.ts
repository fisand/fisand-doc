import { siteDataRef } from './data'
import { inBrowser, EXTERNAL_URL_RE } from '../shared'

export { inBrowser }

/**
 * Join two paths by resolving the slash collision.
 */
export function joinPath(base: string, path: string): string {
  return `${base}${path}`.replace(/\/+/g, '/')
}

export function withBase(path: string) {
  return EXTERNAL_URL_RE.test(path)
    ? path
    : joinPath(siteDataRef.value.base, path)
}

/**
 * Converts a url path to the corresponding js chunk filename.
 */
export function pathToFile(path: string): string {
  let pagePath = path.replace(/\.html$/, '')
  pagePath = decodeURIComponent(pagePath)
  if (pagePath.endsWith('/')) {
    pagePath += 'index'
  }

  if (import.meta.env.DEV) {
    // always force re-fetch content in dev
    pagePath += `.md?t=${Date.now()}`
  } else {
    // in production, each .md file is built into a .md.js file following
    // the path conversion scheme.
    // /foo/bar.html -> ./foo_bar.md
    if (inBrowser) {
      const base = import.meta.env.BASE_URL
      pagePath = pagePath.slice(base.length).replace(/\//g, '_') + '.md'
      // client production build needs to account for page hash, which is
      // injected directly in the page's html
      const pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()]
      pagePath = `${base}assets/${pagePath}.${pageHash}.js`
    } else {
      // ssr build uses much simpler name mapping
      pagePath = `./${pagePath.slice(1).replace(/\//g, '_')}.md.js`
    }
  }

  return pagePath
}

export function submitCodepen(data: {
  template: string
  script: string
  styles: string
}) {
  const resourcesTpl = `
<script src="//unpkg.com/vue@next"><\/script>
<script src="//unpkg.com/mand-mobile-next/dist/lib/mand-mobile.full.js"><\/script>
  `

  let htmlTpl = `
${resourcesTpl}
<div id="app">
${decodeURIComponent(data.template)}
</div>
    `
  let cssTpl = `
@import url("//unpkg.com/mand-mobile-next/dist/lib/mand-mobile-next.full.css");
${(decodeURIComponent(data.styles) || '').trim()}
  `
  let jsTpl = data.script
    ? decodeURIComponent(data.script)
        .replace(/export default/, 'var Main =')
        .trim()
        .replace(
          /import ({.*}) from \\?("|')vue\\?("|')/g,
          (s, s1) => `const ${s1} = Vue`
        )
        .replace(
          /import {?.*}? from \\?("|')mand-mobile-next\/(\w+-?\w+)\\?("|')(;?)/g,
          (s, s1, s2) =>
            `const {${s2
              .replace(/\w/, (s: any) => s.toUpperCase())
              .replace(/-(\w)/, (s: any, s1: string) =>
                s1.toUpperCase()
              )}} = MandMobile`
        )
    : 'var Main = {}'
  jsTpl += `
;const app = Vue.createApp(Main);
app.use(MandMobile);
app.mount("#app")
  `

  const payload = {
    js: jsTpl,
    css: cssTpl,
    html: htmlTpl
  }
  const form = document.createElement('form')

  form.method = 'POST'
  form.action = 'https://codepen.io/pen/define/'
  form.target = '_blank'
  form.style.display = 'none'

  const input = document.createElement('input')
  input.setAttribute('name', 'data')
  input.setAttribute('type', 'hidden')
  input.setAttribute('value', JSON.stringify(payload))

  form.appendChild(input)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
