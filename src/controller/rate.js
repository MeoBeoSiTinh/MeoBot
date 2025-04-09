import { google } from "googleapis";
import * as dotenv from "dotenv";

dotenv.config();

export const rate = async (client, interaction) => {
  try {
    // Authenticate with the Google Sheets API
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to your service account JSON file
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Define the spreadsheet ID
    const spreadsheetId = process.env.GOOGLE_SHEET_ID; // Add your spreadsheet ID to the .env file

    // Get metadata about the spreadsheet to find the first sheet
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Get the first sheet's ID
    const Sheet = metadata.data.sheets[1]; // Access the first sheet
    const SheetId = Sheet.properties.sheetId; // Sheet ID (numeric)
    const SheetTitle = Sheet.properties.title; // Sheet title (string)

    const range = `${SheetTitle}!A6:C10`; // Adjust the range as needed

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return interaction.reply("No data found in the Google Sheet.");
    }

    // Extract the header (first row) and the data (remaining rows)
    const headers = rows[0]; // First row as headers
    const dataRows = rows.slice(1); // Remaining rows as data

    // Build a table-like structure for the reply
    let replyMessage = "Rate poe theo golden horse:\n";
    replyMessage += headers.join(" | ") + "\n"; // Add headers as the first row
    replyMessage += "-".repeat(headers.join(" | ").length) + "\n"; // Add a separator line

    dataRows.forEach((row) => {
      // Ensure the row has the same number of columns as the headers
      const paddedRow = headers.map((_, index) => row[index] || "N/A");

      // Add the row to the reply message
      replyMessage += paddedRow.join(" | ") + "\n";
    });

    await interaction.reply(replyMessage);
  } catch (error) {
    console.error("Error accessing Google Sheets:", error);
    await interaction.reply("An error occurred while accessing the Google Sheet.");
  }
};