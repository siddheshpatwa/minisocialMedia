const asynchandler = require("express-async-handler");
const Profile = require("../Models/Profile");
const User = require("../Models/Users");
const Post = require("../Models/Post");
const Users = require("../Models/Users");
//@desc    Create user profile
//@route   POST /api/users/profile/create
//@access  Private

const createProfile = asynchandler(async (req, res) => {
    const { bio, skills, socialLinks } = req.body;
    
    if (!bio || !skills) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const profileExists = await Profile.findOne({ userId: req.user._id });
    if (profileExists) {
        res.status(400);
        throw new Error("Profile already exists");
    }
     const user = await User.findById(req.user._id);
    
    const profile = await Profile.create({
      userId: user._id,
    name: user.name,
    email: user.email,
        bio,
        skills,
        socialLinks,
    });
    
    return res.status(201).json({
        message: "Profile created successfully",
        profile,
    });
})

const updateProfile = asynchandler(async (req, res) => {
     const profile = await Profile.findOne({ userId: req.user._id });
         const user = await Profile.findOne({ userId: req.user._id });

     if (!profile) {
        res.status(404);
        throw new Error("Profile not found");
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;  
    profile.name = req.body.name || profile.name;
    profile.email = req.body.email || profile.email;
    profile.bio = req.body.bio || profile.bio;
    profile.skills = req.body.skills || profile.skills;
    profile.socialLinks = req.body.socialLinks || profile.socialLinks;

  const updatedProfile = await profile.save();
  const updateUser= await user.save();
  res.status(200).json({ message: "Profile updated", profile: updatedProfile, user: updateUser });

})

//@desc    Get user profile
//@route   GET /api/users/profile/get
//@access  Private
const getProfile = asynchandler(async (req, res) => {
    const profile = await Profile.findOne({ userId: req.user._id });
    if (!profile) {
        res.status(404);
        throw new Error("Profile not found");
    }
    res.status(200).json({
        message: "Profile fetched successfully",
        profile,
    });
})
// const searchProfiles = async (req, res) => {
//   const { name, skill } = req.query;

//   const query = {};

//   if (name) {
//     query.name = { $regex: name, $options: 'i' }; // case-insensitive partial match
//   }

//   if (skill) {
//     query.skills = { $in: [new RegExp(skill, 'i')] }; // partial skill match
//   }

//   try {
//     const profiles = await Profile.find(query);
//     res.status(200).json(profiles);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };
const searchProfiles = async (req, res) => {
  const { search } = req.query;  // single search term

  if (!search) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const regex = new RegExp(search, 'i'); // case-insensitive regex

  try {
    const profiles = await Profile.find({
      $or: [
        { name: { $regex: regex } },
        { skills: { $regex: regex } }  // matches if any skill contains the search term
      ]
    });

    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
//post and profile search 
const getPublicProfileAndPosts = asynchandler (async (req, res) => {
    const userId = req.params.userId;

    // Get user details (without password and metadata)
    const user = await Profile.findOne( {userId }).select("name email profilePic bio skills ");

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    // Get all posts by the user
const posts = await Post.find({ userId:req.params.userId });

    res.status(200).json({
        message: "Public profile and posts fetched successfully",
        user,
        posts,
    });
});


module.exports = {
    createProfile,
    updateProfile,
    getProfile,
    searchProfiles,
    getPublicProfileAndPosts
}
