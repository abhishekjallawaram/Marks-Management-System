const bcrypt = require('bcrypt');

async function hashAndVerifyPassword(password) {
  // Hashing the password
  const salt = await bcrypt.genSalt();
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Simulating password verification (e.g., during a login process)
  const plaintextPassword = 'yourPassword';
  const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);

  if (isMatch) {
    console.log('Passwords match.');
  } else {
    console.log('Passwords do not match.');
  }
}

// Example usage
const password = 'yourPassword';
hashAndVerifyPassword(password);
