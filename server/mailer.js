import nodemailer from 'nodemailer';

const BRAND_NAME = 'PARTYTIME';
const BRAND_COLOR = '#2563eb';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function buildEmailHtml({ title, bodyHtml }) {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; padding: 24px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
      <tr>
        <td style="background-color: ${BRAND_COLOR}; padding: 24px; text-align: center;">
          <span style="font-weight: bold; text-transform: uppercase; color: #111827; font-size: 22px; letter-spacing: 1px;">${BRAND_NAME}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 24px;">
          <h1 style="margin: 0 0 16px; font-size: 20px; color: #111827;">${title}</h1>
          ${bodyHtml}
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 24px; background-color: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af;">
          <strong>PARTYTIME</strong> — you are receiving this email because of a recent order in my portfolio App.
        </td>
      </tr>
    </table>
  </div>
  `;
}

function buildProductListHtml(products) {
  const rows = products
    .map(
      (p) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151;">${p.name}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: center;">x${p.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #374151; text-align: right;">€${p.price}</td>
      </tr>`
    )
    .join('');

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0; font-size: 14px;">
      ${rows}
    </table>
  `;
}

export async function sendOrderEmail({ name, email, products, total }) {
  const productListHtml = buildProductListHtml(products);

  // Notification email to the shop owner
  const ownerBodyHtml = `
    <p style="color: #374151; font-size: 14px; margin: 0 0 8px;">
      <strong>Customer:</strong> ${name} (${email})
    </p>
    ${productListHtml}
    <p style="font-size: 16px; font-weight: bold; color: #111827; text-align: right;">
      Total: €${total}
    </p>
  `;

  await transporter.sendMail({
    from: `"Shop Notifications" <${process.env.GMAIL_USER}>`,
    to: process.env.MY_NOTIFICATION_EMAIL,
    subject: `🛒 New order from ${name}`,
    html: buildEmailHtml({
      title: 'New order received',
      bodyHtml: ownerBodyHtml,
    }),
  });

  // Confirmation email to the customer
  const customerBodyHtml = `
    <p style="color: #374151; font-size: 14px; margin: 0 0 8px;">
      Thank you for your order! Here is a summary:
    </p>
    ${productListHtml}
    <p style="font-size: 16px; font-weight: bold; color: #111827; text-align: right;">
      Total: €${total}
    </p>
    <p style="color: #6b7280; font-size: 13px; margin-top: 16px;">
      Thanks for testing my app!
    </p>
  `;

  await transporter.sendMail({
    from: `"Your Shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your order confirmation',
    html: buildEmailHtml({
      title: `Thank you for your order, ${name}!`,
      bodyHtml: customerBodyHtml,
    }),
  });
}
