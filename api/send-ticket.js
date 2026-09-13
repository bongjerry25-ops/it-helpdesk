export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { staff_id, name, department, phone, issue_type, sub_issue, sla_priority, description } = body;
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    let priorityIcon = slaPriority === "High" ? "🔴" : (slaPriority === "Medium" ? "🟡" : "⚫");

    const telegramText = 
      `<b>Name:</b> ${name || 'N/A'}  |  <b>ID:</b> ${staff_id || 'N/A'}\n` +
      `<b>Contact:</b> ${phone || 'N/A'}  |  <b>Dept:</b> ${department || 'N/A'}\n` +
      `🛠 <b>ISSUE DETAILS</b>\n` +
      `<b>Category:</b> ${issue_type || 'N/A'} (${sub_issue || 'មិនមាន'})\n` +
      `<b>Priority:</b> ${priorityIcon} ${slaPriority || 'N/A'}\n` +
      `<b>Description:</b>\n` +
      `<i>${description || 'N/A'}</i>`;

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: telegramText, parse_mode: 'HTML' })
    });

    const data = await response.json();
    
    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, description: data.description || "Telegram API Error" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}