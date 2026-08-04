import { Markup } from 'telegraf';

export const BUTTONS = {
  authSuccess: Markup.inlineKeyboard([
    [
      Markup.button.callback('📋 My subscriptions', 'follows'),
      Markup.button.callback('👤 Show profile', 'me'),
    ],
    [Markup.button.url('🌐 Go to site', 'https://twitchClone.com')],
  ]),
  profile: Markup.inlineKeyboard([
    Markup.button.url(
      '⚙️ Account settings',
      'https://twitchClone.com/dashboard/settings'
    ),
  ]),
};
