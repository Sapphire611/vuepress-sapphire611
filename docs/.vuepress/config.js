module.exports = {
  title: "Sapphire611",
  port: "8081",
  theme: 'reco',
  description: "我其实姓柳，但大家喜欢叫我老李...? ",
  themeConfig: {
    logo: '/img/logo.jpg',
    displayAllHeaders: false, // 默认值：false
    repo: 'https://github.com/Sapphire611/vuepress-sapphire611',
    repoLabel: 'GitHub',
    sidebar: 'auto',
    nav: [
      {
        text: "Interview & Me",
        icon: "info",
        items: [
          { text: "About Me", link: "/aboutMe/", icon: "creative" },
          { text: "Interview", link: "/interview/", icon: "creative" },
        ],
      },
      {
        text: "Programming",
        icon: "info",
        items: [
          { text: "Jenkins2Vuepress", link: "/jenkins2vuepress/", icon: "creative" },
          { text: "Docker", link: "/docker/", icon: "creative" },
          { text: "Nginx", link: "/nginx/", icon: "creative" },
          { text: "Node 库相关", link: "/node/", icon: "creative" },
        ],
      },
    ],
  },
};
