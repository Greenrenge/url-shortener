const mongoose = require('mongoose')

const IdentifierModel = new mongoose.Schema({
    _id: {
        type: String
    },
    seq: {
        type: Number
    }
})

IdentifierModel.statics = {
    async getIncrementNumber(id) {
        const update = {
            $inc: {
                seq: 1
            }
        }
        const options = {
            upsert: true,
            new: true
        }
        const counter = await this.findByIdAndUpdate(id, update, options).exec()
        if (counter) {
            return `${counter.seq}`
        }
    }
}

module.exports = mongoose.model('Identifier', IdentifierModel)