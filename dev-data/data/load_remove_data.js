const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Tour = require('../../models/tourModel');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const DB = process.env.DATABASE_URL.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log('connect success'))
  .catch(console.log.bind(console, 'connect error'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const loadData = async () => {
  try {
    const tour = await Tour.create(tours);
    if (tour) {
      console.log('LOAD SUCCESS');
    }
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

const removeData = async () => {
  try {
    const tour = await Tour.deleteMany();
    if (!tour) {
      console.log('REMOVE SUCCESS');
    }
  } catch (error) {
    console.error(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  loadData();
} else if (process.argv[2] === '--delete') {
  removeData();
}
