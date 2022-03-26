const { User, Thought } = require('../models');

const userController = {

    // Get all users
    getAllUsers(req, res) {
        User.find()
            .then(dbUserData => res.json(dbUserData))
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },

    // Get one user
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
             })
             .populate ({
                 path: 'friends',
                 select: '-__v'
             })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Create a user
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
            
        });
    },

    // Update a user
    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then((user) => {
            !user
                ? res.status(404).json({
                    message: 'no user found'
                })
                : res.json({ message: 'user deleted'})
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
            
        })
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then((user) => {
            !user
                ? res.status(404).json({
                    message: 'no user found'
                })
                : res.json({ message: 'user deleted'})
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err);
            
        })
    },

    // Add a friend
    addFriend({params}, res) {
      User.findOneAndUpdate({_id: params.userId}, {$push: { friends: params.friendId}}, {new: false})
      .populate({path: 'friends', select: ('-__v')})
      .select('-__v')
      .then(dbUsersData => {
          if (!dbUsersData) {
              res.status(404).json({message: 'No other user with this particular ID!'});
              return;
          }
      res.json(dbUsersData);
      })
      .catch(err => res.json(err));
  },

    // Delete a friend
    deleteFriend({params}, res) {
        User.findOneAndUpdate({_id: params.userId}, {$pull: {friends: params.friendId}}, {new: true})
        .then((friend) =>
            !friend
            ? res
                .status(404)
                .json({ message: 'No friend found with that ID :(' })
            : res.json(friend))
            .catch(err => {
                console.log(err)
                res.status(400).json(err);
                
            })
    }
}

module.exports = userController;