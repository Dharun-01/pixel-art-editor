import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [react()],
	base: './',
	build: {
		target: 'esnext',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				editor: resolve(__dirname, 'editor.html'),
			},
		},
	},
});
