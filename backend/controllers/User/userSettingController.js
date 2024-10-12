const User = require('../../models/User/userModel'); // Adjust the path as necessary

exports.UpdateUserInformation = async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize an updates object
    const updates = {};

    // Update fields if they are provided in the request body
    if (req.body.firstname && req.body.firstname !== user.firstname) updates.firstname = req.body.firstname;
    if (req.body.lastname && req.body.lastname !== user.lastname) updates.lastname = req.body.lastname;
    if (req.body.gender && req.body.gender !== user.gender) updates.gender = req.body.gender;
    if (req.body.phoneNumber && req.body.phoneNumber !== user.phoneNumber) updates.phoneNumber = req.body.phoneNumber;
    if (req.body.streetAddress && req.body.streetAddress !== user.streetAddress) updates.streetAddress = req.body.streetAddress;
    if (req.body.municipality && req.body.municipality !== user.municipality) updates.municipality = req.body.municipality;
    if (req.body.barangay && req.body.barangay !== user.barangay) updates.barangay = req.body.barangay;
    if (req.body.zipCode && req.body.zipCode !== user.zipCode) updates.zipCode = req.body.zipCode;
    if (req.body.email && req.body.email !== user.email) updates.email = req.body.email;

    // Handle image upload
    if (req.file) {
      const imageBuffer = req.file.buffer; // Assuming you're using multer
      const base64Image = imageBuffer.toString('base64');
      updates.image = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    // Check if there are no changes
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No changes made to user information' });
    }

    // Update the user in the database
    await User.findByIdAndUpdate(userId, updates, { new: true });

    return res.status(200).json({ message: 'User information updated successfully', user: updates });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while updating user information', error: error.message });
  }
};