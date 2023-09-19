
const { User, Thought } = require('../models');

// export all functions for routes
module.exports = {

    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that id!' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

     // update existing user
     async updateUser(req, res) {
      try {
          const user = await User.findOneAndUpdate(
              { id: req.params.userId },
              { $set: req.body },
              { runValidators: true, new: true},
          );

          if (!user) {
              return res.status(404).json({ message: 'No user with this id!' });
          }

          res.json(user);
      } catch (err) {
          console.log(err);
          res.status(500).json(err);
      }
  },

    // delete user and associated thoughts
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with that id!' });
            }

            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted!'});
        } catch (err) {
            res.status(500).json(err);
        }
    },
};