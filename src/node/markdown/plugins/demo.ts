import MarkdownIt from 'markdown-it'
import minimist from 'minimist'
import { MarkdownParsedData } from '../markdown'
import { highlight } from './highlight'
import fs from 'fs'
import { resolve } from 'path'
import klawSync from 'klaw-sync'

const argv: any = minimist(process.argv.slice(2))
const command = argv._[0]
const root = argv._[command ? 1 : 0]
const anchor = '&-&'
const RE = /^<(script|style)(?=(\s|>|$))/i
const DEMO_RE = /^<demo\s+.+\s?\/?>?/
const DEMOS_RE = /^<demo-wrapper\s+.+\s?\/?>?/
const DEMO_PATH_RE = /src=("|').*("|')/

export function demoPlugin(md: MarkdownIt, resolver: any) {
  md.renderer.rules.html_inline = (tokens: any, idx: any) => {
    const content = tokens[idx].content
    const data = (md as any).__data as MarkdownParsedData
    const fisand_components =
      data.fisand_compnent || (data.fisand_compnent = [])
    return replaceContent(content, fisand_components)
  }

  md.renderer.rules.html_block = (tokens: any, idx: any) => {
    const content = tokens[idx].content
    const data = (md as any).__data as MarkdownParsedData
    const hoistedTags = data.hoistedTags || (data.hoistedTags = [])
    const fisand_components =
      data.fisand_compnent || (data.fisand_compnent = [])
    if (RE.test(content.trim())) {
      hoistedTags.push(content)
      return ''
    } else {
      return replaceContent(content, fisand_components)
    }
  }
}

function replaceContent(
  content: string,
  fisand_components: MarkdownParsedData['fisand_compnent']
) {
  if (DEMO_RE.test(content.trim()) || DEMOS_RE.test(content.trim())) {
    const demoPath = getDemoTruePath(content.trim())
    if (!demoPath) return content

    const { demoCodeStrs, demoCodeRaws, truePath } = demoFileHtmlStr(demoPath)
    const name = 'comp' + (Math.random() * 10000).toFixed(0)

    fisand_components!.push({
      name,
      path: truePath,
      glob: !truePath.endsWith('.vue')
    })

    return content.replace(
      DEMO_RE.test(content.trim()) ? '<demo' : '<demo-wrapper',
      `${DEMO_RE.test(content.trim()) ? '<demo' : '<demo-wrapper'}
        htmlStrs="${
          Array.isArray(demoCodeStrs) ? demoCodeStrs.join(anchor) : demoCodeStrs
        }"
        codeStrs="${
          Array.isArray(demoCodeRaws) ? demoCodeRaws.join(anchor) : demoCodeRaws
        }"
        ${DEMO_RE.test(content.trim()) ? `:demo="${name}"` : ':demos="demos"'}
      `
    )
  }
  return content
}

function getDemoTruePath(content: string) {
  const demoPath = content.match(DEMO_PATH_RE)?.[0]?.split('"')[1]
  return demoPath
}

function demoFileHtmlStr(path: string) {
  const truePath =
    path.startsWith('./') || path.startsWith('../')
      ? resolve(root, path)
      : resolve(process.cwd(), path)

  if (!truePath.endsWith('.vue')) {
    const demoEntries = klawSync(path, {
      nodir: true,
      depthLimit: 0
    })
      .filter((p) => p.path.endsWith('.vue'))
      .map((p) => p.path)

    const demoCodeStrs = demoEntries.map((p: string) => {
      const codeStr = fs.readFileSync(p, 'utf-8')
      const htmlStr = encodeURIComponent(highlight(codeStr, 'vue'))

      return htmlStr.replace(/\'/g, '&')
    })

    const demoCodeRaws = demoEntries.map((p: string) => {
      return encodeURIComponent(fs.readFileSync(p, 'utf-8')).replace(/\'/g, '&')
    })

    return { demoCodeStrs, demoCodeRaws, truePath }
  } else {
    const content = fs.readFileSync(truePath, 'utf-8')
    const htmlStr = encodeURIComponent(highlight(content, 'vue')).replace(
      /\'/g,
      '&'
    )
    return {
      demoCodeStrs: htmlStr,
      demoCodeRaws: encodeURIComponent(content).replace(/\'/g, '&'),
      truePath
    }
  }
}
