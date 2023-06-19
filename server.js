const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();
const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log('connect success'))
  .catch(console.log.bind(console, 'connect error'));

app.listen(process.env.PORT, () => {
  console.log(`APP_LISTEN ${process.env.PORT}...`);
});
process.on('uncaughtException', (err) => {
  console.log('🤡 uncaughtException', err.message);
  app.delete();
  setTimeout(() => process.exit(1), 1000);
});
process.on('unhandledRejection', (err) => {
  console.log('🤡 unhandledRejection', err.message);
  app.delete();
  setTimeout(() => process.exit(1), 1000);
});
