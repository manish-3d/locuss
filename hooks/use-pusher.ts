import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { Channel } from 'pusher-js';

export function usePusherChat(chatId: string, onNewMessage?: (message: any) => void) {
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    if (!chatId) return;

    const pusherChannel = pusherClient.subscribe(`chat-${chatId}`);
    setChannel(pusherChannel);

    if (onNewMessage) {
      pusherChannel.bind('new-message', onNewMessage);
    }

    return () => {
      pusherChannel.unbind_all();
      pusherClient.unsubscribe(`chat-${chatId}`);
    };
  }, [chatId, onNewMessage]);

  return channel;
}

export function usePusherNotifications(userId: string, onNewNotification?: (notification: any) => void) {
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const pusherChannel = pusherClient.subscribe(`user-${userId}`);
    setChannel(pusherChannel);

    if (onNewNotification) {
      pusherChannel.bind('new-notification', onNewNotification);
    }

    return () => {
      pusherChannel.unbind_all();
      pusherClient.unsubscribe(`user-${userId}`);
    };
  }, [userId, onNewNotification]);

  return channel;
}
