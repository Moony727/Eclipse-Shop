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
 * Send order notification to Telegram with retry logic
 * @param message - Order details to send
 * @param maxRetries - Maximum number of retry attempts
 * @returns Promise<boolean> - Success status
 */
export async function sendTelegramNotification(
  message: TelegramMessage,
  maxRetries: number = 3
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // Skip if Telegram is not configured
  if (!botToken || !chatId) {
    console.warn("Telegram bot not configured. Skipping notification.");
    return false;
  }

  // Validate message
  if (!message.orderId || !message.customerName || !message.contactId) {
    console.error("Invalid message data for Telegram notification");
    return false;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const telegramMessage = formatOrderMessage(message);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
            disable_web_page_preview: true,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          console.log(`Telegram notification sent successfully for order ${message.orderId}`);
          return true;
        } else {
          console.error(`Telegram API returned error:`, result);
        }
      } else {
        const errorText = await response.text();
        console.error(`Telegram API HTTP error (${response.status}):`, errorText);
      }

      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff, max 5s
        console.log(`Retrying Telegram notification in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`Telegram notification timeout on attempt ${attempt}`);
      } else {
        console.error(`Failed to send Telegram notification on attempt ${attempt}:`, error);
      }

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`Failed to send Telegram notification after ${maxRetries} attempts for order ${message.orderId}`);
  return false;
}

/**
 * Format order details into a readable Telegram message
 * Minimize PII by masking contact information
 */
function formatOrderMessage(message: TelegramMessage): string {
  const contactLabel = message.contactType === 'whatsapp' ? '📱 WhatsApp' : '✈️ Telegram';

  // Mask contact ID to show only last 4 characters for privacy
  const maskedContact = message.contactId.length > 4
    ? '*'.repeat(message.contactId.length - 4) + message.contactId.slice(-4)
    : message.contactId;

  // Format items list with better formatting
  const itemsList = message.items.map((item, index) => {
    const itemTotal = (item.quantity * item.price).toFixed(2);
    return `${index + 1}. ${escapeHtml(item.productName.en)}\n   ${item.quantity}x × ${item.price.toFixed(2)} AZN = ${itemTotal} AZN`;
  }).join('\n\n');

  const totalFormatted = message.totalAmount.toFixed(2);

  return `
🛒 <b>NEW ORDER RECEIVED!</b>

👤 <b>Customer:</b> ${escapeHtml(message.customerName)}
${contactLabel}: <code>${maskedContact}</code>
🆔 <b>Order ID:</b> <code>${message.orderId}</code>
⏰ <b>Order Time:</b> ${message.orderDate}

📦 <b>Order Items:</b>
${itemsList}

💰 <b>TOTAL: ${totalFormatted} AZN</b>

<i>Please process this order promptly.</i>
  `.trim();
}

/**
 * Escape HTML characters to prevent formatting issues
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Send order status update to customer via Telegram (optional feature)
 * This would require the customer's Telegram ID
 */
export async function sendOrderStatusUpdate(
  customerTelegramId: string,
  orderId: string,
  status: string,
  maxRetries: number = 2
): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.warn("Telegram bot not configured.");
    return false;
  }

  if (!customerTelegramId || !orderId || !status) {
    console.error("Invalid parameters for status update");
    return false;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = `
🔔 <b>Order Status Update</b>

📦 <b>Order ID:</b> <code>${orderId}</code>
📊 <b>Status:</b> ${status.toUpperCase()}

<i>Thank you for your purchase!</i>
      `.trim();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

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
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.ok) {
          return true;
        }
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`Status update attempt ${attempt} failed:`, error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  return false;
}
