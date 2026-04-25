import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import Transaction from "../models/Transaction.js";
import { asyncHandler } from "../middleware/async.middleware.js";
import { formatCurrency } from "../utils/currency.js";

async function fetchTransactions(userId) {
  return Transaction.find({ userId }).sort({ date: -1, createdAt: -1 });
}

export const exportPdf = asyncHandler(async (req, res) => {
  const transactions = await fetchTransactions(req.user._id);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=expense-report.pdf");

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(20).text("Expense Tracker Report");
  doc.moveDown();

  transactions.forEach((item) => {
    doc
      .fontSize(11)
      .text(
        `${new Date(item.date).toLocaleDateString("en-IN")} | ${item.type.toUpperCase()} | ${item.category} | ${formatCurrency(item.amount)} | ${item.note || "-"}`
      );
  });

  doc.end();
});

export const exportExcel = asyncHandler(async (req, res) => {
  const transactions = await fetchTransactions(req.user._id);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Transactions");

  worksheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Type", key: "type", width: 12 },
    { header: "Category", key: "category", width: 18 },
    { header: "Amount", key: "amount", width: 14 },
    { header: "Tags", key: "tags", width: 24 },
    { header: "Note", key: "note", width: 30 }
  ];

  transactions.forEach((item) => {
    worksheet.addRow({
      date: new Date(item.date).toLocaleDateString("en-IN"),
      type: item.type,
      category: item.category,
      amount: formatCurrency(item.amount),
      tags: item.tags.join(", "),
      note: item.note
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=expense-report.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});
