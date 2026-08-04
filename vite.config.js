import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        experience: resolve(__dirname, 'experience.html'),
        qatesting: resolve(__dirname, 'qa-testing.html'),
        pmdetails: resolve(__dirname, 'pm-details.html'),
        projects: resolve(__dirname, 'projects.html'),
        webdev: resolve(__dirname, 'web-dev.html'),
        blog: resolve(__dirname, 'blog.html'),
        blogdetail: resolve(__dirname, 'blog-detail.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
