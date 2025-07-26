const User = require('../models/user.model.js');
const bcrypt = require("bcryptjs");
const generatejwt = require("../utlis/generatetoken.js");
const cloudinary = require("../utlis/cloudinary.js");

const signup = async (req, res) => {
  console.log(req.body);
  try {
    const { 
      role, 
      email, 
      password, 
      phone,
      name,
      foodType,
      businessName,
      ownerName,
      businessAddress,
      gstNumber,
      deliveryMethod,
      serviceArea
    } = req.body;

    // Basic validation
    if (!role || !email || !password || !phone) {
      return res.status(400).json({ 
        message: "Role, email, password, and phone are mandatory" 
      });
    }

    // Validate role
    if (!['vendor', 'supplier'].includes(role)) {
      return res.status(400).json({ 
        message: "Role must be either 'vendor' or 'supplier'" 
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters" 
      });
    }

    // Role-specific validation
    if (role === 'vendor') {
      if (!name || !foodType || !location) {
        return res.status(400).json({ 
          message: "Name, food type, and location are required for vendors" 
        });
      }
      
      // Validate location structure
      // if (!location.address || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      //   return res.status(400).json({ 
      //     message: "Location must include address, latitude, and longitude" 
      //   });
      // }
    }

    if (role === 'supplier') {
      if (!businessName || !ownerName || !businessAddress || !deliveryMethod || !serviceArea) {
        return res.status(400).json({ 
          message: "Business name, owner name, business address, delivery method, and service area are required for suppliers" 
        });
      }

      // Validate delivery method
      if (!['Delivery', 'Pickup', 'Both'].includes(deliveryMethod)) {
        return res.status(400).json({ 
          message: "Delivery method must be 'delivery', 'pickup', or 'both'" 
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists with this email" 
      });
    }

    // Create user object based on role
    const userData = {
      role,
      email,
      password, // Will be hashed by pre-save middleware
      phone
    };

    // Add role-specific data
    if (role === 'vendor') {
      userData.name = name;
      userData.foodType = foodType;
      userData.location = location;
      userData.loyaltyPoints = 0; // Default value
    }

    if (role === 'supplier') {
      userData.businessName = businessName;
      userData.ownerName = ownerName;
      userData.businessAddress = businessAddress;
      userData.deliveryMethod = deliveryMethod;
      userData.serviceArea = serviceArea;
      
      // GST number is optional
      if (gstNumber) {
        userData.gstNumber = gstNumber;
      }
    }

    // Create new user
    const newUser = new User(userData);
    await newUser.save();

    // Generate JWT token
    await generatejwt(newUser._id, res);

    // Prepare response data based on role
    let responseData = {
      id: newUser._id,
      role: newUser.role,
      email: newUser.email,
      phone: newUser.phone
    };

    if (role === 'vendor') {
      responseData = {
        ...responseData,
        name: newUser.name,
        foodType: newUser.foodType,
        location: newUser.location,
        loyaltyPoints: newUser.loyaltyPoints
      };
    }

    if (role === 'supplier') {
      responseData = {
        ...responseData,
        businessName: newUser.businessName,
        ownerName: newUser.ownerName,
        businessAddress: newUser.businessAddress,
        gstNumber: newUser.gstNumber,
        deliveryMethod: newUser.deliveryMethod,
        serviceArea: newUser.serviceArea
      };
    }

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      user: responseData
    });

  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ 
      message: "Internal server error" 
    });
  }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Generate JWT token
        await generatejwt(user._id, res);
        
        // Prepare response data based on role
        let responseData = {
            id: user._id,
            role: user.role,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt
        };

        if (user.role === 'vendor') {
            responseData = {
                ...responseData,
                name: user.name,
                foodType: user.foodType,
                location: user.location,
                loyaltyPoints: user.loyaltyPoints
            };
        }

        if (user.role === 'supplier') {
            responseData = {
                ...responseData,
                businessName: user.businessName,
                ownerName: user.ownerName,
                businessAddress: user.businessAddress,
                gstNumber: user.gstNumber,
                deliveryMethod: user.deliveryMethod,
                serviceArea: user.serviceArea
            };
        }

        return res.status(200).json({
            message: "Login successful",
            user: responseData
        });
        
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


const logout = async(req,res)=>{
try {   
    const options = {
        httpOnly : true,
        secure : true,
    };
        res.cookie("jwt","",options);
        res.status(200).json({message : "logged out succesfully"});
} catch (error) {
    console.log("error in logout controller" , error.message);
    res.status(500).json({message : "internal server error"});
    
}
    
}
const updateprofile = async (req, res) => {
    try {
        const { profilePic, ...otherFields } = req.body;
        const userid = req.user._id;

        // Get current user to determine role
        const currentUser = await User.findById(userid);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updateData = {};

        // Handle profile picture update
        if (profilePic) {
            const uploadedimage = await cloudinary.uploader.upload(profilePic);
            updateData.profilePic = uploadedimage.secure_url;
        }

        // Handle role-specific field updates
        if (currentUser.role === 'vendor') {
            // Vendor-specific fields that can be updated
            const { name, foodType, location, phone } = otherFields;
            
            if (name) updateData.name = name;
            if (foodType) updateData.foodType = foodType;
            if (phone) updateData.phone = phone;
            
            // Validate and update location if provided
            if (location) {
                if (location.address && typeof location.lat === 'number' && typeof location.lng === 'number') {
                    updateData.location = location;
                } else {
                    return res.status(400).json({ 
                        message: "Location must include address, latitude, and longitude" 
                    });
                }
            }
        }

        if (currentUser.role === 'supplier') {
            // Supplier-specific fields that can be updated
            const { 
                businessName, 
                ownerName, 
                businessAddress, 
                gstNumber, 
                deliveryMethod, 
                serviceArea,
                phone 
            } = otherFields;
            
            if (businessName) updateData.businessName = businessName;
            if (ownerName) updateData.ownerName = ownerName;
            if (businessAddress) updateData.businessAddress = businessAddress;
            if (gstNumber) updateData.gstNumber = gstNumber;
            if (serviceArea) updateData.serviceArea = serviceArea;
            if (phone) updateData.phone = phone;
            
            // Validate delivery method if provided
            if (deliveryMethod) {
                if (['delivery', 'pickup', 'both'].includes(deliveryMethod)) {
                    updateData.deliveryMethod = deliveryMethod;
                } else {
                    return res.status(400).json({ 
                        message: "Delivery method must be 'delivery', 'pickup', or 'both'" 
                    });
                }
            }
        }

        // Check if there are any fields to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                message: "No valid fields provided for update" 
            });
        }

        // Update user with new data
        const updatedUser = await User.findByIdAndUpdate(
            userid, 
            updateData, 
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from response

        // Prepare response data based on role
        let responseData = {
            id: updatedUser._id,
            role: updatedUser.role,
            email: updatedUser.email,
            phone: updatedUser.phone,
            profilePic: updatedUser.profilePic,
            createdAt: updatedUser.createdAt
        };

        if (updatedUser.role === 'vendor') {
            responseData = {
                ...responseData,
                name: updatedUser.name,
                foodType: updatedUser.foodType,
                location: updatedUser.location,
                loyaltyPoints: updatedUser.loyaltyPoints
            };
        }

        if (updatedUser.role === 'supplier') {
            responseData = {
                ...responseData,
                businessName: updatedUser.businessName,
                ownerName: updatedUser.ownerName,
                businessAddress: updatedUser.businessAddress,
                gstNumber: updatedUser.gstNumber,
                deliveryMethod: updatedUser.deliveryMethod,
                serviceArea: updatedUser.serviceArea
            };
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: responseData
        });

    } catch (error) {
        console.log("Error in updateprofile controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


const checkauth = async(req,res)=>{
    try {
       res.status(200).json(req.user);
        
    } catch (error) {
        console.log("error in checkauth controller ",error.message);
        res.status(500).json("internal server error");
    }
}

module.exports = {signup , login , logout , updateprofile,checkauth};