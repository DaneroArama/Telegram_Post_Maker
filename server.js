import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize dotenv
dotenv.config();

const app = express();
// Make sure we use the PORT from environment variable
const PORT = process.env.PORT || 3001;
console.log(`Using port: ${PORT}`);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'dist' directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Add a health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Add a root endpoint for basic connectivity check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Telegram Post Maker API is running' });
})

// Route to post to Telegram
app.post('/api/post-to-telegram', async (req, res) => {
  try {
    console.log('Received request to /api/post-to-telegram');
    const { message, channelId, parseMode } = req.body;
    
    if (!message || !channelId) {
      console.log('Missing required fields:', { message: !!message, channelId: !!channelId });
      return res.status(400).json({ 
        success: false, 
        error: 'Message and channelId are required' 
      });
    }

    // Get bot token from environment variable
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.error('Bot token not configured in environment variables');
      return res.status(500).json({ 
        success: false, 
        error: 'Bot token not configured' 
      });
    }

    console.log(`Sending message to channel: ${channelId}`);
    
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
      console.error('Failed Telegram response:', response.data);
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

// Add another endpoint for /post-to-telegram
app.post('/post-to-telegram', async (req, res) => {
  try {
    console.log('Received request to /post-to-telegram');
    const { message, channelId, parseMode } = req.body;
    
    if (!message || !channelId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message and channelId are required' 
      });
    }

    // Get bot token from environment variable
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.error('Bot token not configured in environment variables');
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
      console.error('Failed Telegram response:', response.data);
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

// Catch-all route to serve the React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Create server and handle port in use errors
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Add graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});