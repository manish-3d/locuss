import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Avoid instantiating multiple instances in development
const globalForPusher = global as unknown as {
  pusherServer: PusherServer | undefined;
};

export const pusherServer =
  globalForPusher.pusherServer ??
  new PusherServer({
    appId: process.env.PUSHER_APP_ID || '',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '',
    secret: process.env.PUSHER_SECRET || '',
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    useTLS: true,
  });

if (process.env.NODE_ENV !== 'production') globalForPusher.pusherServer = pusherServer;

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'dummy_key',
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
  }
);
