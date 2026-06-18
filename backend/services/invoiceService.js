import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate a PDF invoice for an order
 */
export const generateInvoicePDF = (order, orderId) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = path.join(process.cwd(), 'public', 'invoices');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true });
      }

      const fileName = `invoice_${orderId}.pdf`;
      const filePath = path.join(invoiceDir, fileName);

      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // --- Header / Brand ---
      doc
        .fontSize(20)
        .text('GLASS SHOP E-COMMERCE', { align: 'left' })
        .fontSize(10)
        .text('Premium E-Commerce Platform', { align: 'left' })
        .text('123 Cyberpunk Boulevard, Suite 300', { align: 'left' })
        .text('support@glassshop.com | +1 800-GLASS-SHOP', { align: 'left' })
        .moveDown();

      // --- Invoice Meta Info ---
      doc
        .fontSize(14)
        .text('INVOICE', { align: 'right' })
        .fontSize(10)
        .text(`Invoice Number: INV-${orderId.substring(0, 8).toUpperCase()}`, { align: 'right' })
        .text(`Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, { align: 'right' })
        .text(`Payment Method: ${order.paymentMethod}`, { align: 'right' })
        .text(`Status: PAID`, { align: 'right' })
        .moveDown(2);

      // --- Customer Address ---
      const addr = order.shippingAddress;
      doc
        .fontSize(12)
        .text('Bill To:', { underline: true })
        .fontSize(10)
        .text(`${order.user && typeof order.user === 'object' ? order.user.name : 'Valued Customer'}`)
        .text(`${addr.street}`)
        .text(`${addr.city}, ${addr.state} - ${addr.zip}`)
        .text(`${addr.country}`)
        .moveDown(2);

      // --- Items Table Header ---
      let y = doc.y;
      doc
        .fontSize(10)
        .text('Item Description', 50, y, { width: 250 })
        .text('Qty', 300, y, { width: 50, align: 'right' })
        .text('Price', 380, y, { width: 80, align: 'right' })
        .text('Total', 480, y, { width: 80, align: 'right' });

      doc.moveTo(50, y + 15).lineTo(560, y + 15).stroke();
      doc.moveDown();

      // --- Items List ---
      y = doc.y + 10;
      order.items.forEach((item) => {
        doc
          .fontSize(10)
          .text(item.name, 50, y, { width: 250 })
          .text(item.quantity.toString(), 300, y, { width: 50, align: 'right' })
          .text(`INR ${item.price.toFixed(2)}`, 380, y, { width: 80, align: 'right' })
          .text(`INR ${(item.quantity * item.price).toFixed(2)}`, 480, y, { width: 80, align: 'right' });
        y += 20;
      });

      doc.moveTo(50, y).lineTo(560, y).stroke();
      y += 15;

      // --- Summary ---
      doc
        .fontSize(10)
        .text('Subtotal:', 380, y, { width: 80, align: 'right' })
        .text(`INR ${order.subtotal.toFixed(2)}`, 480, y, { width: 80, align: 'right' });
      y += 15;

      if (order.discountAmount > 0) {
        doc
          .text('Discount:', 380, y, { width: 80, align: 'right' })
          .text(`- INR ${order.discountAmount.toFixed(2)}`, 480, y, { width: 80, align: 'right' });
        y += 15;
      }

      doc
        .fontSize(12)
        .text('Grand Total:', 380, y, { width: 80, align: 'right', bold: true })
        .text(`INR ${order.total.toFixed(2)}`, 480, y, { width: 80, align: 'right', bold: true });

      // --- Footer ---
      doc
        .fontSize(10)
        .text('Thank you for shopping with us!', 50, 700, { align: 'center', width: 500 })
        .text('If you have any questions, please contact our support team.', { align: 'center', width: 500 });

      doc.end();

      writeStream.on('finish', () => {
        resolve(`/invoices/${fileName}`);
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
