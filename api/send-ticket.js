export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { staff_id, name, department, phone, issue_type, sub_issue, sla_priority, description } = req.body;
  
  // Vercel จะดึง Token จาก Environment Variables ที่បងเพิ่งដាក់មិញនេះដោយស្វ័យប្រវត្តិ
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  let priorityIcon = slaPriority === "High" ? "🔴" : (slaPriority === "Medium" ? "🟡" : "⚫");

  const telegramText = 
    `<b>Name:</b> ${name}  |  <b>ID:</b> ${staff_id}\n` +
    `<b>Contact:</b> ${phone}  |  <b>Dept:</b> ${department}\n` +
    `🛠 <b>ISSUE DETAILS</b>\n` +
    `<b>Category:</b> ${issue_type} (${sub_issue})\n` +
    `<b>Priority:</b> ${priorityIcon} ${slaPriority}\n` +
    `<b>Description:</b>\n` +
    `<i>${description}</i>`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: telegramText, parse_mode: 'HTML' })
    });

    const data = await response.json();
    if (data.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, description: data.description });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}