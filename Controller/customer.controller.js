const getMyProfile = async (req, res) => {
  res.status(200).json({
    message: "Customer profile retrieved successfully",
    customer: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      onboardingMethod: req.user.onboardingMethod,
      onboardingStatus: req.user.onboardingStatus,
      isVerified: req.user.isVerified,
    },
  });
};

module.exports = getMyProfile;
