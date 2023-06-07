import express from "express";
import {
  getAllJob,
  createJob,
  updateJob,
  deleteJob,
  getSingleJob,
} from "../controllers/jobs.js";

const router = express.Router();

router.route("/").post(createJob).get(getAllJob);
router.route("/:id").get(getSingleJob).delete(deleteJob).patch(updateJob);

export default router;
