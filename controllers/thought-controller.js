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
        Thought.findOne({ _id: params.thoughtId })
        .populate({ path: 'reactions', select: '-__v' })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'No thought found with this id'});
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
    addThought(req, res) {
        Thought.create(req.body)
          .then((thought) => res.json('thought created'))
          .catch((err) => res.status(500).json(err));
    },

    // Update a Thought
    updateThought({params, body}, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
        .then((Thought) => {
            !Thought
                ? res.status(404).json({
                    message: 'no Thought found'
                })
                : res.json({ message: 'Thought warped'})
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
            
        })
    },

    // delete Thought
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then((Thought) => {
            if (!Thought) {
                res.json("No user with that id")
            }
            res.json("Thought deleted")
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
            res.json("how THOUGHTful");
        })
        .catch(err => res.status(500).json(err));
    },

    // Delete a reaction
    removeReaction({ params }, res) {

        Thought.findByIdAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { runValidators: true, new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id' });
                return;
            }
            console.log(dbThoughtData)
            res.json("reaction deleted");
        })
        .catch(err => res.status(500).json(err));
    }
};

module.exports = thoughtController