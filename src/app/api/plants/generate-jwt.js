// generate-jwt.js
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'changeme';

const token = jwt.sign(
  { user: 'android-app' }, // payload, customize as needed
  secret,
  { expiresIn: '7d' }      // token valid for 7 days
);

console.log(token);