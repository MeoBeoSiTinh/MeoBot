import puppeteer from "puppeteer";
import * as dotenv from "dotenv";

dotenv.config();
export const getPriceFromG2G = async (client, interaction) => {
  await interaction.deferReply();
  
  try {
    const url = process.env.G2G_URL; // Ensure this is set in your .env file

    const browser = await puppeteer.launch({
      headless: "new", // Using the new Headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { 
      waitUntil: "networkidle2",
      timeout: 30000
    });

    // Wait for the unit price section
    await page.waitForSelector('.unit-price-section.mb-2', { timeout: 20000 });
    
    // Extract price data - now getting both displayed and raw values
    const priceData = await page.$eval('.unit-price-section.mb-2', (container) => {
      const displayPrice = container.querySelector('#precheckout_ppu_amount')?.textContent.trim();
      const rawPrice = container.querySelector('#precheckout_ppu_amount')?.getAttribute('data-ppu');
      const currency = container.querySelector('span:not([id])')?.textContent.trim();
      
      return {
        displayPrice,
        rawPrice,
        currency: currency || 'VND'
      };
    });

    await browser.close();

    if (!priceData.displayPrice) {
      return interaction.editReply("Could not find the unit price information on the G2G website.");
    }

    // Format the response with more details
    await interaction.editReply({
      embeds: [{
        title: "Divine Orb Current Price",
        color: 0x5865F2,
        fields: [
          { 
            name: "Unit Price", 
            value: `${priceData.displayPrice} ${priceData.currency}`,
            inline: true 
          },
          { 
            name: "Raw Value", 
            value: priceData.rawPrice ? `${parseFloat(priceData.rawPrice).toFixed(2)} ${priceData.currency}` : 'N/A',
            inline: true 
          },
          { 
            name: "Source", 
            value: `[View Listing](${url})`,
            inline: false 
          }
        ],
        footer: { 
          text: `Last updated at ${new Date().toLocaleTimeString()}` 
        },
        thumbnail: {
          url: "https://webimg.secondhandapp.com/w-i-mgl/5f22d71a0e0e67395b4e8a63"
        }
      }]
    });
    
  } catch (error) {
    console.error("Error fetching price from G2G:", error);
    await interaction.editReply({
      embeds: [{
        color: 0xED4245,
        title: "⚠️ Price Check Failed",
        description: "Couldn't retrieve the current price. This might be because:\n\n• The website structure changed\n• G2G is temporarily unavailable\n• Our bot got rate-limited",
        fields: [{
          name: "Technical Details",
          value: `\`\`\`${error.message.substring(0, 1000)}\`\`\``
        }]
      }],
      ephemeral: true
    });
  }
};