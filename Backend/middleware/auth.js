const jwt = require('jsonwebtoken')
const UserModal = require('../model/UserModal')
const JWT_SECRET = process.env.JWT_SECRET

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith(`Bearer `)) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await UserModal.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Invalid token user' })
    }
    req.user = user
    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized', error: error.message })
  }
}

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
module.exports = { authenticateUser, authorizeAdmin }
