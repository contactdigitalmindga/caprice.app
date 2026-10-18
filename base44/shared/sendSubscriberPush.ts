export async function sendSubscriberPush(base44, { title, content, dryRun = false, subscribersOnly = false }) {
  let offset = 0, eligible = 0, sent = 0, failed = 0;
  const query = { push_notifications_enabled: subscribersOnly ? true : { $ne: false } };
  do {
    const users = await base44.asServiceRole.entities.User.filter(query, '-created_date', 100, offset);
    eligible += users.length;
    if (!dryRun) {
      for (let i = 0; i < users.length; i += 6) {
        const results = await Promise.allSettled(users.slice(i, i + 6).map(user => base44.asServiceRole.integrations.Core.SendPushNotification({
          user_id: user.id, title, content,
          action_label: 'Découvrir le menu',
          action_url: 'https://caprice-app.base44.app/menu'
        })));
        for (const result of results) {
          if (result.status === 'fulfilled') sent++;
          else { failed++; console.error('Notification non envoyée:', String(result.reason?.message || result.reason)); }
        }
      }
    }
    if (users.length < 100) break;
    offset += users.length;
  } while (true);
  return { eligible, sent, failed };
}