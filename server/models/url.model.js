const mongoose = require('mongoose')
/**
 * URL Model Schema
 */

const UrlSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    full_link: {
        type: String,
        index: { unique: true },
        match: /^((ftp|http|https):\/\/){0,1}(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
        required: true
    },
    created_time: {
        type: Date,
        default: new Date()
    }
})



/**
 * @typedef Url
 */
module.exports = mongoose.model('Url', UrlSchema)