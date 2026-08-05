import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'yangontv_key',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    // If using Laravel Reverb or custom socket server, uncomment below:
    // wsHost: import.meta.env.VITE_PUSHER_HOST || window.location.hostname,
    // wsPort: import.meta.env.VITE_PUSHER_PORT || 8080,
    // wssPort: import.meta.env.VITE_PUSHER_PORT || 8080,
    // forceTLS: (import.meta.env.VITE_PUSHER_SCHEME || 'https') === 'https',
});

export default echo;
