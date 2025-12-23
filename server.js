import app, { ensureDBConnection } from './app.js';

const PORT = process.env.PORT || 5012;

// Start server only after database connection is established
const startServer = async () => {
  try {
    await ensureDBConnection();

    // Avoid binding a port on Vercel (serverless)
    if (process.env.VERCEL === '1') {
      return;
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

