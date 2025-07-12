const express = require("express")
const FeesApplyModal = require("../model/FeesApplyModal")
const router = express.Router()


router.get("/get/fees-collection", async(req,res)=>{
  // GET /api/fees/collection?type=monthly
  const {type}=req.query
  let groupFormat
  switch(type){
    case "monthly":
      groupFormat = { year: { $year: "$applied_at" },
      month: { $month: "$applied_at" } };
      break;
      case "quarterly":
        groupFormat = {
          year: { $year: "$applied_at" },
          quarter: {
            $ceil: { $divide: [{ $month: "$applied_at" }, 3] }
          }
        };   
      break;
      case "yearly":
      groupFormat = { year: { $year: "$applied_at" } };
      break;

      default:
        return res.status(400).json({error: "Invalid type. Use monthly, quarterly, or yearly"})
  }
  try {
    // aggregate() method is used to:
    // Group data (like SQL’s GROUP BY)
    // Calculate totals, averages, counts, etc.
    // Filter, sort, or reshape data
    // Join collections ($lookup)
    // Perform date/math/string operations
    const result = await FeesApplyModal.aggregate([
      {
        $group: {
          _id: groupFormat,
          total_fees_applied: {$sum: "$final_amount"},
          count: { $sum: 1}
        }
      },
      {$sort: { "_id.year":1, "_id.month":1, "_id.quarter":1}}
    ])
    return res.status(200).json({message:"Fees collection fetched successfully", fees_collection:result})
  } catch (error) {
    return res.status(500).json({message:"Server error", error:error.message})
  }
})

module.exports=router