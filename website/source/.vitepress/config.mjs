import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Rabto AI Skills",
  description: "Installable creative-web skills for AI coding agents.",
  base: '/rabto/',
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
          { text: 'Installation', link: '/guide/installation' },
          { text: 'CLI Reference', link: '/guide/cli' },
          { text: 'Supported Agents', link: '/guide/agents' },
          { text: 'Presets', link: '/guide/presets' },
          { text: 'Skills Structure', link: '/guide/skills' },
          { text: 'Security Architecture', link: '/guide/security' },
          { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          { text: 'Contributing', link: '/guide/contributing' },
          { text: 'Limitations', link: '/guide/limitations' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Priyanshuf1/rabto' }
    ]
  }
})
