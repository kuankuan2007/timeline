import '@/styles/main.scss';

import { ViteSSG } from 'vite-ssg/single-page';
import App from './App.vue';

export const createApp = ViteSSG(
	App,
	async ({ app, initialState }) => {
		if (import.meta.env.SSR) {
			initialState.renderTime = Date.now();
		} else {
			await import('@kuankuan/assist-2026/init');
		}
		app.provide('renderTime', initialState.renderTime ?? Date.now());
	},
	{ hydration: !import.meta.env.DEV, useHead: false }
);
