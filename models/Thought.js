const { Schema, model } = require('mongoose');
const moment = require('moment');


const thoughtSchema = new Schema(
    {
      thoughtText: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
          type: Date,
          default: Date.now,
          get: (time) => moment(time).format('MMM DD, YYYY [at] hh:mm a')
      },
      username: {
          type: String,
          required: true
      }
    },
    {
      toJSON: {
        virtuals: true,
        getters: true 
      },
      id:false
    }
  );

  thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought',thoughtSchema);

module.exports = Thought