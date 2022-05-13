const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { format } = require('date-fns');

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    country: {
        type: Number,
        required: true
    },
    city: {
        type: Number,
        required: true
    },
    sector: {
        type: Number,
        required: true
    },
    createdDate: { type: String, default: format(new Date(), 'yyyy-MM-dd HH:mm:ss') },
});

module.exports = mongoose.model('Job', jobSchema);
