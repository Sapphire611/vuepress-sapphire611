module.exports = {
  title: "Sapphire611",
  port: "8081",
  description: "Description ... ",
  themeConfig: {
    logo: '/img/logo.jpg',
    displayAllHeaders: false, // 默认值：false
    sidebar: ["/"],
    nav: [
      { text: 'HomePage', link: '/' },
      {
        text: "Life & Me",
        icon: "info",
        items: [
          { text: "About Me", link: "/aboutMe/", icon: "creative" },
        ],
      },
      {
        text: "Programming",
        icon: "info",
        items: [
          { text: "Jenkins2Vuepress", link: "/jenkins2vuepress/", icon: "creative" },
          { text: "Docker", link: "/docker/", icon: "creative" },
          { text: "Node 库相关", link: "/node/", icon: "creative" },
        ],
      },
    ],
    sidebar: [
      '/',
      '/aboutMe/',
      '/jenkins2vuepress/',
      "/docker/",
      "/node/"
    ]
  },
};
