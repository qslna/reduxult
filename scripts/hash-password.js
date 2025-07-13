const bcrypt = require('bcryptjs');

const password = 'redux6666';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Original password:', password);
  console.log('Hashed password:', hash);
  console.log('\nUse this value for ADMIN_PASSWORD environment variable:');
  console.log(hash);
});