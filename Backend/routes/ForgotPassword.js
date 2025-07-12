const express = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const router = express.Router()
const UserModal = require('../model/UserModal')
const SendEmail = require('../middleware/SendEmail')

const BASE_URI = 'http://localhost:3000'

// Send reset email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body
  try {
    const user = await UserModal.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'User not found with this email' })
    }

    // crypto.randomBytes(32)
    // Generates 32 random bytes (binary data) using Node.js's
    // This is cryptographically secure, meaning it's safe for sensitive purposes like password resets.
    // .toString('hex')
    // Converts the binary data into a hexadecimal string (0-9, a-f), which is easier to store and send in a

    // crypto for generating tokens.
    // bcrypt for storing & hashing passwords securely.

    // crypto.randomBytes(32): generates 32 secure random bytes.
    // .toString('hex'): converts it to a human-readable hex string.
    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token

    const expiryTime = Date.now() + 3600000 // 1 hour from now
    user.resetTokenExpiry = expiryTime

    await user.save()

    // partially secure, depending on how you:
    // Generate the token (jwt, random string, etc.)
    // Expire and validate the token
    // Use HTTPS (not HTTP) in production
    // Prevent token reuse
    const resetLink = `${BASE_URI}/reset-password?token=${token}`

    await SendEmail(
      user.email,
      'Reset your password',
      `Click on this link to reset your password: ${resetLink}.\nThis link will expire in 1 hour.`,
    )

    return res.status(200).json({ message: 'Reset link sent to email', token })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }

  // Security Considerations:
  // ✅ Token is random and secure (using crypto.randomBytes).
  // ✅ Token expires after 1 hour, reducing risk of misuse.
  // ✅ Token is stored in DB, so you can verify it later.
  // ⚠️ Token should be cleared after use, in the /reset-password/:token handler.
  // ✅ Ensure the reset link is served over HTTPS only in production.

  // 🔐 Forgot Password Flow (Summary)
  // User submits email via /forgot-password route.
  // Server checks if the user exists in the database.
  // If user exists:
  // A secure random token is generated using crypto.
  // Token and its 1-hour expiry are saved to the user’s DB record.
  // A password reset link is created:
  // https://yourdomain.com/reset-password/<token>
  // This link is emailed to the user.
  // User clicks the link → goes to the reset password page on the frontend.
  // On submitting a new password:
  // Server verifies token and expiry.
  // If valid, password is hashed and updated, and token is cleared.
})

router.post('/reset-password/:token', async (req, res) => {
  //  STEPS :
  // Validates the token
  // Hashes the new password
  // Updates the user password
  // Clears the reset token and expiry

  const { token } = req.params
  const { newPassword } = req.body
  try {
    const user = await UserModal.findOne({
      resetToken: token,

      //    This is a MongoDB query condition used to check if a token is still valid by comparing its expiry time to the current time.
      resetTokenExpiry: { $gt: Date.now() }, // $gt → This is a MongoDB operator meaning "greater than"
    })

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    // crypto for generating tokens.
    // bcrypt for storing & hashing passwords securely.

    // 10 is called the "salt rounds" or "cost factor"
    // It tells bcrypt how many times to process the data during hashing.
    // It applies a hashing algorithm to the password 10 times
    // Salt Rounds 	        Time to Hash	    Security Level
    // 8                    Fast    	        Medium
    // 10                   Good balance    	Strong
    // 12+                  Slower  	        Very Strong
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword

    // bcrypt.hash() is used to securely hash (encrypt) the new password before storing it in the database.
    // newPassword: This is the plain text password that the user entered.
    // 10: This is the salt rounds – the number of times the hashing process is applied.
    // A higher number is more secure but slower. 10 is a commonly used standard.
    user.resetToken = undefined // Invalidate reset token
    user.resetTokenExpiry = undefined // Remove token expiry time
    await user.save()

    return res.status(200).json({ message: 'Password reset successfully' })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }

  //   🔄 Reset Password Flow (Summary)
  // User clicks the password reset link with a token:
  // POST /reset-password/:token with { newPassword } in the body.
  // Server checks:
  // If a user exists with the given resetToken.
  // If the resetTokenExpiry is still valid (not expired).
  // If valid:
  // Hashes the newPassword using bcrypt.hash(newPassword, 10).
  // Updates the user’s password in the database.
  // Clears resetToken and resetTokenExpiry to prevent reuse.
  // Responds with a success message:
  // "Password reset successfully"
  // If invalid or expired token:
  // Responds with an error: "Invalid or expired token"
})

module.exports = router
