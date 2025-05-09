import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Add a root endpoint for health check
app.get('/', (req, res) => {
  res.json({ status: 'Telegram Post Maker API is running' });
});

// Route to post to Telegram
app.post('/api/post-to-telegram', async (req, res) => {
  try {
    const { message, channelId, parseMode } = req.body;
    
    if (!message || !channelId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and channelId are required' 
      });
    }

    // Get bot token from environment variable
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8173624776:AAHtvlHBD-6LD_MqZmcmJw9D2piMJwkg6lY';
    
    if (!botToken) {
      return res.status(500).json({ 
        success: false, 
        error: 'Bot token not configured' 
      });
    }

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(telegramUrl, {
      chat_id: channelId,
      text: message,
      parse_mode: parseMode || 'Markdown'  // Use parseMode from request or default to Markdown
    });

    if (response.data && response.data.ok) {
      console.log('Telegram API response:', response.data);
      return res.json({ 
        success: true, 
        message: 'Posted to Telegram successfully' 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to post to Telegram', 
        details: response.data 
      });
    }
  } catch (error) {
    console.error('Error posting to Telegram:', error.response?.data || error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Error posting to Telegram', 
      details: error.response?.data || error.message 
    });
  }
});

// Add a root POST endpoint to handle direct posts
app.post('/', async (req, res) => {
  try {
    const { message, channelId, parseMode } = req.body;
    
    if (!message || !channelId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and channelId are required' 
      });
    }

    // Get bot token from environment variable
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8173624776:AAHtvlHBD-6LD_MqZmcmJw9D2piMJwkg6lY';
    
    if (!botToken) {
      return res.status(500).json({ 
        success: false, 
        error: 'Bot token not configured' 
      });
    }

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(telegramUrl, {
      chat_id: channelId,
      text: message,
      parse_mode: parseMode || 'Markdown'  // Use parseMode from request or default to Markdown
    });

    if (response.data && response.data.ok) {
      console.log('Telegram API response:', response.data);
      return res.json({ 
        success: true, 
        message: 'Posted to Telegram successfully' 
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: 'Failed to post to Telegram', 
        details: response.data 
      });
    }
  } catch (error) {
    console.error('Error posting to Telegram:', error.response?.data || error.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Error posting to Telegram', 
      details: error.response?.data || error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});