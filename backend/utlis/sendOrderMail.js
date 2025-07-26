const nodemailer = require('nodemailer');

const sendOrderMail = async ({ vendor, supplier, items, totalAmount, deliveryMethod, deliveryAddress }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemListHtml = items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>₹${item.pricePerUnit}</td>
        <td>₹${item.totalPrice}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h2>Order Confirmation from ${supplier.name}</h2>
      <p>Hello ${vendor.name},</p>
      <p>Your order has been successfully placed. Here are the details:</p>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Price/Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemListHtml}
        </tbody>
      </table>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <p><strong>Delivery Method:</strong> ${deliveryMethod}</p>
      ${deliveryAddress ? `<p><strong>Delivery Address:</strong> ${deliveryAddress}</p>` : ''}
      <p>Thank you for ordering from ${supplier.name}!</p>
    `;

    const mailOptions = {
      from: `"${supplier.name}" <${process.env.EMAIL_USER}>`,
      to: vendor.email,
      subject: `Your Order with ${supplier.name}`,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${vendor.email}`);
  } catch (error) {
    console.error("❌ Failed to send order email:", error);
  }
};

module.exports = sendOrderMail;
