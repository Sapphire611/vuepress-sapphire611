module.exports = {
  title: "Sapphire611",
  port: "8081",
  description: "Description ... ",
  themeConfig: {
    logo: '/img/logo.jpg',
    displayAllHeaders: false, // 默认值：false
    sidebar: ["/"],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Common', link: '/common/' },
      { text: 'Jenkins2Vuepress', link: '/jenkins2vuepress/' },
    ],
    sidebar: [
      '/',
      '/common/',
      '/jenkins2vuepress/',
    ]
  },
};
