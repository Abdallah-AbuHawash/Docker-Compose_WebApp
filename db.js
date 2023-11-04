const mongoose = require('mongoose');
require('dotenv').config();


const dbURI = process.env.DB_URI;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectWithRetry = () => {
  return mongoose.connect(dbURI, options) // Return the promise from mongoose.connect
    .catch(err => {
      console.error('Failed to connect to MongoDB on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    });
};

module.exports = (app) => {
  connectWithRetry()
    .then(() => {
      console.log('MongoDB connected...');
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    })
    .catch(err => { // It's also good to have a catch block here to handle any errors.
      console.error('Failed to start the server:', err);
    });
};