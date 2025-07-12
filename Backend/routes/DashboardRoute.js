const express = require('express')
const StudentModal = require('../model/StudentModal')
const router = express.Router()

// GET STUDENTS PER COURSE
router.get('/get/student-per-course', async (req, res) => {
  try {
    // .aggregate() method in MongoDB (and Mongoose) is used to perform advanced data processing and transformations directly in the database — much more powerful than .find() or .count().

    // Use of .aggregate() when you want to:
    // Group data-	Count students in each course
    // Join collections-	Get course names from Courses while querying Students
    // Transform documents-	Add/remove/change fields in output
    // Filter, sort, paginate complex results-	Like WHERE, ORDER BY, etc.
    // Calculate statistics-	Averages, sums, counts, etc.

    // $group Stage: Groups students by course (assuming each student document has a course field with ObjectId).
    //     _id: "$course": Groups by the course ID.
    // studentCount: { $sum: 1 }: Counts the number of students in each course.

    // $lookup Stage: Groups students by course (assuming each student document has a course field with ObjectId).
    //   Purpose: Joins course details from the courses collection.
    // localField: "_id": The course ID from the grouped result.
    // foreignField: "_id": The course ID in the courses collection.
    // as: "courseInfo": The joined data will be added as an array under the courseInfo field.

    // $unwind Stage: Purpose: Converts the courseInfo array into a single object.
    // After this stage, instead of an array, courseInfo is a flat object.

    // $project Stage: Selects and renames the fields for the final output.
    // _id: 0: Excludes the _id field from the output.
    // courseId: Course ID from joined data.
    // courseName: Course name from joined data.
    // studentCount: 1: Keeps the count field as is.

    // Summary of this aggregation pipeline:
    // Groups students by course.
    // Joins course details from the courses collection.
    // Flattens the course info.
    // Projects a clean output with course ID, name, and number of students.

    const data = await StudentModal.aggregate([
      {
        $group: {
          _id: '$course',
          studentCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'courses', // MongoDB collection name (lowercase plural by default)
          localField: '_id',
          foreignField: '_id',
          as: 'courseInfo',
        },
      },
      { $unwind: '$courseInfo' },
      {
        $project: {
          _id: 0,
          courseId: '$courseInfo._id',
          courseName: '$courseInfo.name',
          studentCount: 1,
        },
      },
    ])
    res.status(200).json({
      message: 'Number of Students per course are fetched successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
module.exports = router
