import { createServer as createViteServer, ServerOptions } from 'vite'
import path from 'path'
import WindiCSS from 'vite-plugin-windicss'
import aspectRatio from 'windicss/plugin/aspect-ratio'
import Components from 'vite-plugin-components'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import { resolveConfig } from './config'
import { createVitePressPlugin } from './plugin'

export async function createServer(
  root: string = process.cwd(),
  serverOptions: ServerOptions = {}
) {
  const config = await resolveConfig(root)

  return createViteServer({
    root: config.srcDir,
    base: config.site.base,
    // logLevel: 'warn',
    plugins: [
      ...createVitePressPlugin(root, config),
      Components({
        dirs: [path.resolve(__dirname, '../theme/components')],
        customLoaderMatcher: (id) => id.endsWith('.md'),
        customComponentResolvers: [
          ViteIconsResolver({
            componentPrefix: ''
          })
        ]
      }),
      Icons(),
      WindiCSS({
        config: {
          extract: {
            include: ['**/*.md', '**/*.vue']
          },
          attributify: true,
          plugins: [aspectRatio],
          preflight: false
        }
      })
    ],
    server: serverOptions
  })
}
