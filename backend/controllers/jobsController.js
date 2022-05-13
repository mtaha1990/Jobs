const Job = require('../model/Job');
const { format } = require('date-fns');
const data_per_page = 10;


const getAllJobs = async (req, res) => {
    var condiition = {};
    if (req?.query?.title) {
        condiition['title'] = { $regex: '.*' + req.query.title + '.*' };
    }
    if (req?.query?.sector && JSON.parse(req.query.sector).length > 0) {
        condiition['sector'] = { $in: JSON.parse(req.query.sector) };
    }
    if (req?.query?.country && JSON.parse(req.query.country).length > 0) {
        condiition['country'] = { $in: JSON.parse(req.query.country) };
    }
    if (req?.query?.city && JSON.parse(req.query.city).length > 0) {
        condiition['city'] = { $in: JSON.parse(req.query.city) };
    }
    var skip = (req.query.page - 1) * data_per_page;
    const jobs = await Job.find(condiition).sort([['createdDate', -1]]).skip(skip).limit(data_per_page);
    if (!jobs) return res.status(204).json({ 'message': 'No jobs found.' });
    const total_records = await Job.find(condiition).sort([['createdDate', -1]]).count();
    const total_pages = Math.ceil(total_records / data_per_page);
    res.json({ data: jobs, total_pages: total_pages });
}


const createNewJob = async (req, res) => {
    //console.log(req.body.title)
    if (!req?.body?.title) {
        return res.status(400).json({ 'message': 'Title is required' });
    }
    if (!req?.body?.desc) {
        return res.status(400).json({ 'message': 'description is required' });
    }
    else if (!req?.body?.country || req?.body?.country == 0) {
        return res.status(400).json({ 'message': 'Country is Required' });
    }
    else if (!req?.body?.city || req?.body?.city == 0) {
        return res.status(400).json({ 'message': 'City is Required' });
    }
    else if (!req?.body?.sector || req?.body?.sector == 0) {
        return res.status(400).json({ 'message': 'Sector is Required' });
    }

    try {
        const result = await Job.create({
            title: req.body.title,
            desc: req.body.desc,
            country: req.body.country,
            city: req.body.city,
            sector: req.body.sector,
            createdDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}



const updateJob = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const job = await Job.findOne({ _id: req.params.id }).exec();
    if (!job) {
        return res.status(204).json({ "message": `No job matches ID ${req.params.id}.` });
    }
    if (req.body?.title) job.title = req.body.title;
    if (req.body?.desc) job.desc = req.body.desc;
    if (req.body?.country) job.country = req.body.country;
    if (req.body?.city) job.city = req.body.city;
    if (req.body?.sector) job.sector = req.body.sector;
    const result = await job.save();
    res.json(result);
}


const deleteJob = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Job ID required.' });

    const job = await Job.findOne({ _id: req.params.id }).exec();
    if (!job) {
        return res.status(204).json({ "message": `No job matches ID ${req.params.id}.` });
    }
    const result = await job.deleteOne(); //{ _id: req.body.id }
    res.json(result);
}



const getJob = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Job ID required.' });

    const job = await Job.findOne({ _id: req.params.id }).exec();
    if (!job) {
        return res.status(204).json({ "message": `No job matches ID ${req.params.id}.` });
    }
    res.json(job);
}



module.exports = {
    getAllJobs,
    createNewJob,
    updateJob,
    deleteJob,
    getJob
}
