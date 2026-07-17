import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "CineForge AI Skills",
  description: "Installable creative-web skills for AI coding agents.",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/guide/' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Installation', link: '/guide/installation' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Priyanshuf1/cineforge-ai-skills' }
    ]
  }
})
