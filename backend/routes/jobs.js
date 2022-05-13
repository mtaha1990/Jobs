const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

router.route('/getJobs').get(jobsController.getAllJobs);
router.route('/getJob/:id').get(jobsController.getJob);
router.route('/postJob').post(jobsController.createNewJob);
router.route('/updateJob/:id').put(jobsController.updateJob);
router.route('/deleteJob/:id').delete(jobsController.deleteJob);

module.exports = router;
