import { createServer as createViteServer, ServerOptions } from 'vite'
import path from 'path'
import WindiCSS from 'vite-plugin-windicss'
import aspectRatio from 'windicss/plugin/aspect-ratio'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
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
        extensions: ['vue', 'md', 'svg'],
        dirs: [path.resolve(__dirname, '../client/theme-default/components')],
        include: [/\.vue$/, /\.md$/],
        resolvers: [
          IconsResolver({
            componentPrefix: ''
          })
        ]
      }),
      Icons(),
      WindiCSS({
        config: {
          extract: {
            include: [
              '**/*.md',
              '**/*.vue',
              `${process.cwd()}/**/*.md`,
              `${process.cwd()}/**/*.vue`
            ]
          },
          attributify: true,
          plugins: [aspectRatio],
          preflight: false
        }
      })
    ],
    server: {
      ...serverOptions,
      fs: {
        allow: ['..']
      }
    }
  })
}
