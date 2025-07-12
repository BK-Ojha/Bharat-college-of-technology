// // Multer is a Node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// // Setup multer to Handle File Uploads

// const multer = require('multer')
// //  "path" is used to extract the file extension.
// const path = require('path')

// // fs stands for File System
// // fs module provides functions to interact with the file system — allowing you to:
// // Read files
// // Write to files
// // Create/delete files or folders
// // Rename/move files
// // Check if a file or folder exists
// // And more...
// const fs = require('fs')

// // Accepted file types
// const FILE_TYPE = /jpg|jpeg|png/

// // multer.diskStorage : This tells multer to store files on the disk (rather than in memory or elsewhere).
// const storage = multer.diskStorage({
//   // req: the HTTP request object.
//   // file: the uploaded file object.
//   // cb: callback function; the first argument is for error (null here), and the second is the path to save the file.
//   // In this case, files will be stored in the uploads/ directory.

//   destination: function (req, file, cb) {
//     //   uploads/
//     // ├── admins/
//     // └── students/

//     let uploadPath = 'uploads/students' // default
//     const role = req.body.role || req.user?.role
//     console.log('Role detected in upload:', role)

//     if (role === 'admin') {
//       uploadPath = 'uploads/admins' // Save admins image  in 'uploads/students' folder
//     }
//     // create a folder (directory) if not exist
//     const finalPath = path.join(__dirname, '..', uploadPath)
//     fs.mkdirSync(finalPath, { recursive: true })
//     console.log('Saving file to :', finalPath)
//     cb(null, finalPath)

//     // create a folder (directory) synchronously.
//     // fs.mkdirSync(uploadPath, { recursive: true })
//     // cb(null, uploadPath)
//   },

//   // This function customizes the file name of uploaded files.
//   // Date.now() ensures uniqueness by including the current timestamp.
//   // Math.random() * 1e9 adds a random number for more uniqueness.
//   // path.extname(file.originalname) gets the original file extension, like .jpg, .png.
//   // For example, a file could be saved as: 1722231902341-381237849.jpg
//   // filename: function (req, file, cb) {
//   //   const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9)
//   //   cb(null, uniqueSuffix + path.extname(file.originalname))
//   // },

//   filename: function (req, file, cb) {
//     const ext = path.extname(file.originalname)
//     const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 1e9)}${ext}`
//     cb(null, uniqueName)
//   },
// })

// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname).toLowerCase()

//   const mimetype = FILE_TYPE.test(file.mimetype)
//   const extname = FILE_TYPE.test(ext)
//   if (mimetype && extname) {
//     cb(null, true)
//   } else {
//     cb(new Error('Only JPG, JPEG, and PNG files are allowed'))
//   }
// }

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
// })

// module.exports = upload

// Multer is a Node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
// Setup multer to Handle File Uploads

const multer = require('multer')
//  "path" is used to extract the file extension.
const path = require('path')

// fs stands for File System
// fs module provides functions to interact with the file system — allowing you to:
// Read files
// Write to files
// Create/delete files or folders
// Rename/move files
// Check if a file or folder exists
// And more...
const fs = require('fs')

// Accepted file types
const FILE_TYPE = /jpg|jpeg|png/

// multer.diskStorage : This tells multer to store files on the disk (rather than in memory or elsewhere).
const storage = multer.diskStorage({
  // req: the HTTP request object.
  // file: the uploaded file object.
  // cb: callback function; the first argument is for error (null here), and the second is the path to save the file.
  // In this case, files will be stored in the uploads/ directory.

  destination: function (req, file, cb) {
    //   uploads/
    // ├── admins/
    // └── students/

    let uploadPath = 'uploads/students' // default
    // Optional: use specific logic to distinguish student vs admin upload
    const isUpdatingstudent =
      req.originalUrl.includes('/admin/update-student') ||
      req.baseUrl.includes('/admin/update-student')

    if (!isUpdatingstudent) {
      const role = req.body.role || req.user?.role
      console.log('Role detected in upload:', role)

      if (role === 'admin') {
        uploadPath = 'uploads/admins' // Save admins image  in 'uploads/students' folder
      }
    }

    // create a folder (directory) if not exist
    const finalPath = path.join(__dirname, '..', uploadPath)
    fs.mkdirSync(finalPath, { recursive: true })
    console.log('Saving file to :', finalPath)
    cb(null, finalPath)

    // create a folder (directory) synchronously.
    // fs.mkdirSync(uploadPath, { recursive: true })
    // cb(null, uploadPath)
  },

  // This function customizes the file name of uploaded files.
  // Date.now() ensures uniqueness by including the current timestamp.
  // Math.random() * 1e9 adds a random number for more uniqueness.
  // path.extname(file.originalname) gets the original file extension, like .jpg, .png.
  // For example, a file could be saved as: 1722231902341-381237849.jpg
  // filename: function (req, file, cb) {
  //   const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9)
  //   cb(null, uniqueSuffix + path.extname(file.originalname))
  // },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}_${Math.floor(Math.random() * 1e9)}${ext}`
    cb(null, uniqueName)
  },
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase()

  const mimetype = FILE_TYPE.test(file.mimetype)
  const extname = FILE_TYPE.test(ext)
  if (mimetype && extname) {
    cb(null, true)
  } else {
    cb(new Error('Only JPG, JPEG, and PNG files are allowed'))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
})

module.exports = upload
