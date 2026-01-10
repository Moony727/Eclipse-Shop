/**
 * Telegram Bot Integration for Order Notifications
 * This runs server-side only to keep the bot token secure
 */

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  originalPrice: number;
  productName: {
    en: string;
    ru: string;
    az: string;
  };
}

interface TelegramMessage {
  orderId: string;
  customerName: string;
  contactId: string;
  contactType: 'whatsapp' | 'telegram';
  items: OrderItem[];
  totalAmount: number;
  orderDate: string;
}

/**
 * Send order notification to Telegram
 * @param message - Order details to send
 * @returns Promise<boolean> - Success status
 */
export async function sendTelegramNotification(
  message: TelegramMessage
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Skip if Telegram is not configured
  if (!botToken || !chatId) {
    console.warn("Telegram bot not configured. Skipping notification.");
    return false;
  }

  try {
    const telegramMessage = formatOrderMessage(message);

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: "HTML",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Telegram API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}

/**
 * Format order details into a readable Telegram message
 * Minimize PII by masking contact information
 */
function formatOrderMessage(message: TelegramMessage): string {
  const contactLabel = message.contactType === 'whatsapp' ? 'Whatsapp' : 'Telegram';
  // Mask contact ID to show only last 4 characters for privacy
  const maskedContact = message.contactId.length > 4
    ? '*'.repeat(message.contactId.length - 4) + message.contactId.slice(-4)
    : message.contactId;

  // Format items list
  const itemsList = message.items.map((item, index) =>
    `${index + 1}. ${item.productName.en} (x${item.quantity}) - ${(item.quantity * item.price).toFixed(2)} AZN`
  ).join('\n');

  return `
🛒 <b>New Order!</b>
👤 Name: ${message.customerName}
📞 ${contactLabel}: ${maskedContact}
🆔 Order ID: ${message.orderId}
⏰ Order Time: ${message.orderDate}

📦 <b>Items:</b>
${itemsList}

💰 <b>Total: ${message.totalAmount.toFixed(2)} AZN</b>
  `.trim();
}

/**
 * Send order status update to customer via Telegram (optional feature)
 * This would require the customer's Telegram ID
 */
export async function sendOrderStatusUpdate(
  customerTelegramId: string,
  orderId: string,
  status: string
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.warn("Telegram bot not configured.");
    return false;
  }

  try {
    const message = `
🔔 <b>Order Status Update</b>

📦 Order ID: ${orderId}
📊 Status: ${status.toUpperCase()}

Thank you for your purchase!
    `.trim();

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: customerTelegramId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Failed to send status update:", error);
    return false;
  }
}
