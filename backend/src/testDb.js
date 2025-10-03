const connectDB = require('./config/db');

connectDB().then(() => {
  console.log('Connection test finished');
  process.exit(0);
});
