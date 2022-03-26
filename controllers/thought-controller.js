const { User, Thought } = require('../models');

const thoughtController = {

    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find()
            .then(dbThoughtData => res.json(dbThoughtData))
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
    },

    // Get one thought
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({ 
            path: 'reactions', 
            select: '-__v'
         })
        .select('-__v')
        .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this id' });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Create a thought
    addThought({ body }, res) {
        Thought.create(body)
        .then(dbThoughtData => {
            User.findOneAndUpdate(
                { _id: bady.userId },
                { $push: { thoughts: dbThoughtData._id } },
                { new: true }
            )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
        })
        .catch(err => res.status(400).json(err));
    },

    // Update a Thought
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then((Thought) => {
            !Thought
                ? res.status(404).json({
                    message: 'no Thought found'
                })
                : res.json({ message: 'Thought deleted'})
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
            
        })
    },

    // delete Thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then((Thought) => {
            if (!Thought) {
                res.json("No use with that id")
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
            
        });
    },

    // Add a reaction
    addReaction({ params, body }, res) {
        
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $push: { reactions: body}},
            { new: true, runValidators: true}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    },

    // Delete a reaction
    removeReaction({ params }, res) {

        Thought.findByIdAndDelete(
            { _id: params.thoughtId},
            { $pull: { reaction: params.reactionId}}
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(500).json(err));
    }
};

module.exports = thoughtController