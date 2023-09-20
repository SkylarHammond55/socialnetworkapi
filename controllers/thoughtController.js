const { Thought, User } = require('../models');

module.exports = {

    // Get all existing thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Get a single existing thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that id!' });
            }

            res.json(thought)
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id }},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but no user found with that id!'
                });
            }

            res.json(`Thought with id ${thought._id} created!`);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Update existing thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought exist with this id!' });
            }

            res.json(thought);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Delete existing thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought exist with this id!' });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Thought found but no user exist with this id!' });
            };

            res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Add a reaction to an existing thought
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a reaction from existing thought
    async removeReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: {reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought exist with this id!' });
            }
            
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}