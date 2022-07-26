const autometa_options = {
  site: {
    name: 'Sapphire611',
  },
  canonical_base: 'https://sapphire611.github.io/',
};

module.exports = {
  title: "Sapphire611",
  port: "8081",
  theme: "reco",
  description: "我叫柳李逸，我妈不姓李，谢谢🙏 ",
  head: [
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],

  themeConfig: {
    logo: "/img/logo.jpg",
    displayAllHeaders: false, // 默认值：false
    repo: "https://github.com/Sapphire611/vuepress-sapphire611",
    repoLabel: "GitHub",
    sidebar: "auto",
    type: "blog",
    authorAvatar: "/img/logo.jpg",
    valineConfig: {
      appId: 'qVOKjVcg4c9wX0WR4ObcpJQr-gzGzoHsz',// your appId
      appKey: 'oWlaFMHfMPLqnnBaV30iNkMo', // your appKey
    },
    nav: [
      {
        text: "About Me",
        icon: "info",
        text: "About Me",
        link: "/aboutMe/",
        icon: "reco-other",
      },
    ],

    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "Category", // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "Tag", // 默认文案 “标签”
      },
      socialLinks: [
        // 信息栏展示社交信息
        { icon: "reco-github", link: "https://github.com/sapphire611" },
        { icon: "reco-bilibili", link: "https://space.bilibili.com/17383192" },
        {
          icon: "reco-zhihu",
          link: "https://www.zhihu.com/people/liu-li-yi-30",
        },
      ],
    },
    record: "沪ICP备2021035470号-1",
    recordLink: "https://beian.miit.gov.cn/",
    startYear: "2021",
    author: "Sapphire611",
    codeTheme: "tomorrow", // default 'tomorrow'
  },

  plugins: [
    [
      "meting",
      {
        meting: {
          server: "netease",
          type: "playlist",
          mid: "7195949476",
        },
        aplayer: {
          lrcType: 3,
        },
      },
    ],
    ["ribbon"],
    [
      'vuepress-plugin-sponsor',
      {
        theme: 'simple',
        alipay: '/img/alipay.png',
        wechat: '/img/wechat.png',
        duration: 2000
      }
    ],
    ['autometa', autometa_options],
    ['sitemap', {
      hostname: "https://www.sapphire611.com/",
      // 排除无实际内容的页面
      exclude: ["/404.html"]
    }
    ],
    [
      'vuepress-plugin-baidu-autopush'
    ]
  ],

  configureWebpack: {
    node: {
      global: true,
      process: true
    },
  },
  
};
