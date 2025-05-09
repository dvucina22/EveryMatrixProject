const userModel = require('../models/userModel');

exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.getUserInfo(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

exports.updateUser = async (req, res) => {
    try {
      const profile_picture = req.file ? `/uploads/${req.file.filename}` : req.body.profile_picture || null;
  
      const updatedUser = await userModel.updateUserInfo(req.params.id, {
        ...req.body,
        profile_picture
      });
  
      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user' });
    }
  };
  
  

exports.getMe = async (req, res) => {
    try {
      const user = await userModel.getUserInfo(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching user data' });
    }
  };


  