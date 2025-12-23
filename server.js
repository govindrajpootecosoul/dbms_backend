const app = require('./api/index');
const { ensureDBConnection } = require('./api/index');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ensureDBConnection();
    app.listen(PORT, () => {
      console.log(`Local server running on ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

