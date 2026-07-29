import nodemailer from 'nodemailer';

// Uses GMAIL_USER, GMAIL_APP_PASSWORD, MY_NOTIFICATION_EMAIL from process.env
// (already loaded by dotenv.config() at the top of your entry file, e.g. server.js)

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOrderEmail({ name, email, products, total }) {
  const productListHtml = products
    .map(p => `<li>${p.name} x${p.quantity} — €${p.price}</li>`)
    .join('');

  // Notification email to the shop owner
  await transporter.sendMail({
    from: `"Shop Notifications" <${process.env.GMAIL_USER}>`,
    to: process.env.MY_NOTIFICATION_EMAIL,
    subject: `🛒 New order from ${name}`,
    html: `
      <h2>New order received</h2>
      <p><strong>Customer:</strong> ${name} (${email})</p>
      <ul>${productListHtml}</ul>
      <p><strong>Total:</strong> €${total}</p>
    `,
  });

  // Confirmation email to the customer
  await transporter.sendMail({
    from: `"Your Shop" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Your order confirmation',
    html: `
      <h2>Thank you for your order, ${name}!</h2>
      <ul>${productListHtml}</ul>
      <p><strong>Total:</strong> €${total}</p>
      <p>We will contact you soon with shipping details.</p>
    `,
  });
}