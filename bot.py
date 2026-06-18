import json
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters

# 1. ដាក់លេខ Token របស់បងដែលបានមកពី BotFather នៅត្រង់នេះ
BOT_TOKEN = "8973791331:AAHfj99CoBj4nAOe2BDP_Pr4drnRwmHCFNo" 

# មុខងារនៅពេល User វាយពាក្យ /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # បង្កើតប៊ូតុងសម្រាប់ចុចបើក WebApp (ដូរតំណភ្ជាប់ទៅជា GitHub Pages របស់បង)
    webapp_button = InlineKeyboardButton(
        text="📱 Raise IT Ticket", 
        web_app=WebAppInfo(url="https://bongjerry25-ops.github.io/it-helpdesk/")
    )
    reply_markup = InlineKeyboardMarkup([[webapp_button]])
    
    await update.message.reply_text(
        "សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ IT Helpdesk!\nសូមចុចប៊ូតុងខាងក្រោមដើម្បីបង្កើតសំបុត្រកិច្ចការ៖",
        reply_markup=reply_markup
    )

# មុខងាររង់ចាំទទួលទិន្នន័យពី WebApp Form នៅពេល User ចុច Submit
async def web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    # ទាញយកទិន្នន័យ JSON ដែលផ្ញើមកពី Form
    data_json = update.effective_message.web_app_data.data
    data = json.loads(data_json)
    
    # រៀបចំទម្រង់សារដើម្បីបង្ហាញនៅលើ Telegram Chat
    ticket_msg = (
        "🎯 **ទទួលបាន IT Ticket ថ្មីមួយ!**\n"
        "---------------------------\n"
        f"👤 **ឈ្មោះបុគ្គលិក:** {data.get('name', 'មិនមាន')}\n"
        f"🏢 **ផ្នែក/Department:** {data.get('department', 'មិនមាន')}\n"
        f"🛠️ **ប្រភេទបញ្ហា:** {data.get('issue_type', 'មិនមាន')}\n"
        f"📝 **ការពិពណ៌នា:** {data.get('description', 'មិនមាន')}\n"
        "---------------------------\n"
        "⚡ *សូមផ្នែកបច្ចេកទេសប្រញាប់ពិនិត្យជូន!*"
    )
    
    # ផ្ញើសារត្រឡប់ទៅកាន់ User វិញ
    await update.message.reply_text(ticket_msg, parse_mode="Markdown")

def main() -> None:
    # ចាប់ផ្តើមដំណើរការកូដ Telegram Bot
    application = Application.builder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, web_app_data))

    print("🤖 Bot កំពុងដំណើរការហើយ... សូមទៅកាន់ Telegram រួចវាយ /start")
    application.run_polling()

if __name__ == "__main__":
    main()