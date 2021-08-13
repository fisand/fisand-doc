import MarkdownIt from 'markdown-it'
import { MarkdownParsedData } from '../markdown'
import { highlight } from './highlight'
import fs from 'fs'
import klawSync from 'klaw-sync'

const anchor = '&-&'

export function demoPlugin(md: MarkdownIt, resolver: any) {
  const RE = /^<(script|style)(?=(\s|>|$))/i
  const DEMO_RE = /^<demo\s+.+\s?\/?>?/
  const DEMO_PATH_RE = /src=("|').*("|')/

  md.renderer.rules.html_block = (tokens: any, idx: any) => {
    const content = tokens[idx].content
    const data = (md as any).__data as MarkdownParsedData
    const hoistedTags = data.hoistedTags || (data.hoistedTags = [])

    if (RE.test(content.trim())) {
      hoistedTags.push(content)
      return ''
    } else {
      if (DEMO_RE.test(content.trim())) {
        const demoPath = getDemoTruePath(content.trim())
        if (!demoPath) return content
        const { demoCodeStrs, demoCodeRaws } = demoFileHtmlStr(demoPath)
        const name = 'comp' + (Math.random() * 100).toFixed(0)
        const item = `
          <script>
          import { markRaw } from 'vue'
          import demo from '${demoPath}'
          export default {
            data() {
              return { ${name}: markRaw(demo) }
            }
          }
          </script>
          `
        if (!hoistedTags.includes(item)) {
          hoistedTags.push(item)
        }

        return content.replace(
          '<demo',
          `<demo
            htmlStrs="${
              Array.isArray(demoCodeStrs)
                ? demoCodeStrs.join(anchor)
                : demoCodeStrs
            }"
            codeStrs="${
              Array.isArray(demoCodeRaws)
                ? demoCodeRaws.join(anchor)
                : demoCodeRaws
            }"
            :demo="${name}"
          `
        )
      }

      return content
    }
  }

  function getDemoTruePath(content: string) {
    const demoPath = content.match(DEMO_PATH_RE)?.[0]?.split('"')[1]
    return demoPath
  }

  function demoFileHtmlStr(path: string) {
    if (!path.endsWith('.vue')) {
      const demoEntries = klawSync(path, {
        nodir: true,
        depthLimit: 0
      })
        .filter((p) => !p.path.endsWith('index.vue'))
        .map((p) => p.path)

      const demoCodeStrs = demoEntries.map((p: string) => {
        const codeStr = fs.readFileSync(p, 'utf-8')
        const htmlStr = encodeURIComponent(highlight(codeStr, 'vue'))

        return htmlStr.replace(/\'/g, '&')
      })

      const demoCodeRaws = demoEntries.map((p: string) => {
        return encodeURIComponent(fs.readFileSync(p, 'utf-8')).replace(
          /\'/g,
          '&'
        )
      })

      return { demoCodeStrs, demoCodeRaws }
    } else {
      return {
        demoCodeStrs: '',
        demoCodeRaws: ''
      }
    }
  }
}
