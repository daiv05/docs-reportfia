import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'ReportFIA — Documentación de HU',
  description: 'Historias de usuario del sistema ReportFIA',
  base: process.env.VITEPRESS_BASE || '/',
  
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Historias de Usuario', link: '/historias-usuario/' }
    ],

    sidebar: {
      '/historias-usuario/': [
        {
          text: 'Historias de Usuario',
          items: [
            { text: 'Introducción', link: '/historias-usuario/' },
            { text: '01 - Autenticación y Seguridad', link: '/historias-usuario/01-autenticacion-seguridad' },
            { text: '02 - Reportes', link: '/historias-usuario/02-reportes' },
            { text: '03 - Mantenimientos', link: '/historias-usuario/03-mantenimientos' },
            { text: '04 - Recursos Humanos', link: '/historias-usuario/04-recursos-humanos' },
            { text: '05 - Bitácora y Auditoría', link: '/historias-usuario/05-bitacora-auditoria' },
            { text: '06 - Estadísticas', link: '/historias-usuario/06-estadisticas' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: '' }
    ]
  }
})
