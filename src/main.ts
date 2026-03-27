import '@/styles/main.scss';
import '@/scripts/theme.ts';
import '@kuankuan/assist-2026/init';

import { createVaporApp } from 'vue';
import App from './App.vue';

const app = createVaporApp(App);

app.mount('#app');
