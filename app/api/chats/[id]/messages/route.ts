import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { headers } from 'next/headers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { id } = await params;

    const messages = await prisma.chatMessage.findMany({
      where: {
        chatId: id
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('MESSAGES_GET_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { id } = await params;
    const body = await req.json();
    const { content } = body;

    const chat = await prisma.chat.findUnique({
      where: { id }
    });

    if (!chat) {
      return new NextResponse('Chat not found', { status: 404 });
    }

    if (chat.buyerId !== session.user.id && chat.sellerId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const message = await prisma.chatMessage.create({
      data: {
        chatId: id,
        senderId: session.user.id,
        content
      }
    });

    // Update chat updatedAt
    await prisma.chat.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    // Determine receiver
    const receiverId = chat.buyerId === session.user.id ? chat.sellerId : chat.buyerId;

    // Trigger Pusher event for the specific chat
    await pusherServer.trigger(`chat-${id}`, 'new-message', message);
    
    // Trigger notification for receiver
    await pusherServer.trigger(`user-${receiverId}`, 'new-notification', {
      type: 'new_message',
      chatId: id
    });

    // Also create a database notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'new_message',
        content: `New message from ${session.user.name}`,
        link: `/chats/${id}`
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('MESSAGES_POST_ERROR', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
