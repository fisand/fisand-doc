module.exports = {
  lang: 'en-US',
  base: '/fisand-doc/',
  title: 'fisandoc',
  description: 'Vite & Vue powered static site generator.',
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://pt-starimg.didistatic.com/static/starimg/img/TvCSBVuy1Y1612669180297.jpeg'
      }
    ]
  ],
  themeConfig: {
    repo: 'https://github.com/zouhangwithsweet/fisand-doc',
    logo: 'https://pt-starimg.didistatic.com/static/starimg/img/TvCSBVuy1Y1612669180297.jpeg',
    docsBranch: 'feat_fisand_doc',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '为此文档提供修改建议',
    lastUpdated: true,
    nav: [
      {
        text: 'TypeScript',
        link: '/typescript'
      }
    ],
    codepen: true
  }
}
