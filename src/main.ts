import '@/styles/main.scss';
import '@/scripts/theme.ts';

import { createVaporApp } from 'vue';
import App from './App.vue';

const app = createVaporApp(App);

app.mount('#app');
