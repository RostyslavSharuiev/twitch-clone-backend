import { User } from '@/src/generated/prisma/client';
import type { SessionMetadata } from '@/src/shared/types/session-metadata.types';

export const MESSAGES = {
  welcome:
    `<b>👋 Welcome to Twitch clone bot!</b>\n\n` +
    `To receive notifications and improve your platform experience, let’s link your Telegram account with Twitch clone.\n\n` +
    `Click the button below and go to the <b>Notifications</b> section to complete the setup.`,

  authSuccess: `🎉 You have successfully logged in, and your Telegram account is now linked with Twitch clone!\n\n`,

  invalidToken: '❌ Invalid or expired token.',

  profile: (user: User, followersCount: number) =>
    `<b>👤 User's profile:</b>\n\n` +
    `👤 User name: <b>${user.username}</b>\n` +
    `📧 Email: <b>${user.email}</b>\n` +
    `👥 Followers count: <b>${followersCount}</b>\n` +
    `📋 Bio: <b>${user.bio || 'Not added'}</b>\n\n` +
    `🔧 Click the button below to open settings.`,

  follows: (user: User) =>
    `📺 <a href="https://twitchClone.com/${user.username}">${user.username}</a>`,

  resetPassword: (token: string, metadata: SessionMetadata) =>
    `<b>🔒 Password reset</b>\n\n` +
    `You have requested a password reset on the <b>Twitch clone</b> platform .\n\n` +
    `To create a new password, please follow the link below:\n\n` +
    `<b><a href="https://twitchClone.com/password/recovery/${token}">Reset password</a></b>\n\n` +
    `📅 Request date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>\n\n` +
    `🖥️ <b>Request Information::</b>\n\n` +
    `🌎 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
    `📱 <b>Operating system:</b> ${metadata.device.os}\n` +
    `🌐  <b>Browser:</b> ${metadata.device.browser}\n` +
    `🖥️ <b>IP address:</b> ${metadata.ip}\n\n` +
    `If you did not make this request, please ignore this message.\n\n` +
    `Thank you for using <b>Twitch clone</b>! 🚀`,

  deactivate: (token: string, metadata: SessionMetadata) =>
    `<b>⚠️ Account deactivation request</b>\n\n` +
    `You have initiated a request to deactivate your account on the <b>Twitch clone</b> platform.\n\n` +
    `To complete the transaction, please confirm your request by entering the following confirmation code:\n\n` +
    `<b>Confirmation code: ${token}</b>\n\n` +
    `📅 Request date: <b>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</b>\n\n` +
    `🖥️ <b>Request Information::</b>\n\n` +
    `🌎 <b>Location:</b> ${metadata.location.country}, ${metadata.location.city}\n` +
    `📱 <b>Operating system:</b> ${metadata.device.os}\n` +
    `🌐  <b>Browser:</b> ${metadata.device.browser}\n` +
    `🖥️ <b>IP address:</b> ${metadata.ip}\n\n` +
    `<b>What happens after deactivation?</b>\n\n` +
    `1. You will be automatically logged out and lose access to your account.\n` +
    `2. If you do not cancel the deactivation within 7 days, your account will be <b>permanently deleted</b> along with all your information, data, and subscriptions.\n\n` +
    `⏳ <b>Please note:</b> If you change your mind within 7 days, you can contact our support team to restore access to your account before it is completely deleted.\n\n` +
    `Once your account is deleted, it will be impossible to restore it, and all data will be lost without the possibility of recovery.\n\n` +
    `If you change your mind, simply ignore this message. Your account will remain active.\n\n` +
    `Thank you for using <b>Twitch clone</b>! We're always happy to see you on our platform and hope you'll stay with us. 🚀\n\n` +
    `Sincerely,\n` +
    `Twitch clone Team`,

  accountDeleted:
    `<b>⚠️ Your account has been completely deleted</b>.\n\n` +
    `Your account has been completely wiped from the Twitch clone database. All your data and information have been permanently deleted. ❌\n\n` +
    `🔒 You will no longer receive notifications in Telegram and by email.\n\n` +
    `If you want to return to the platform, you can register using the following link:\n` +
    `<b><a href="https://twitchClone.com/account/create">Register for Twitch clone</a></b>\n\n` +
    `Thank you for being with us! We'll always be happy to see you on the platform. 🚀\n\n` +
    `Sincerely,\n` +
    `Twitch clone Team`,

  streamStart: (channel: User) =>
    `<b>🔥 The ${channel.displayName} channel has started broadcasting!</b>\n\n` +
    `Watch here: <a href="https://twitchClone.com/${channel.username}">Jump to stream</a>`,

  newFollowing: (follower: User, followersCount: number) =>
    `<b>You have a new subscriber!</b>\n\n` +
    `This is user <a href="https://twitchClone.com/${follower.username}">${follower.username}</a>\n\n` +
    `The total number of subscribers on your channel is: ${followersCount}`,
};
