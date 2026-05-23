/*
import Company from "../models/Company.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName ) {
      return res.status(400).json({ message: "Company name is required",
      success: false ,
     });
    }
    let company = await Company.findOne({name: companyName});
    if(company){
      return res.status(400).json({ message: "You can't register same company twice",
      success: false ,
     });
    };
    company = await Company.create({name: companyName,
      userId: req.id,
    });

    return res.status(201).json({ message: "Company registered successfully",
    success: true ,
    company,
   });
  } catch (error) {
    console.log(error);
  }
};

export const getCompanyDetails = async (req, res) => {
  try {
    const userId = req.id;// Assuming the user ID is stored in req.id by the authentication middleware
    const company = await Company.findOne({userId});
    if(!company){
      return res.status(404).json({ message: "Company not found",
      success: false ,
     });
    }
  } catch (error) {
    console.log(error);
  }
}

//get company details by id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if(!company){
      return res.status(404).json({ message: "Company not found",
      success: false ,
     });
    }
    return res.status(200).json({ message: "Company details fetched successfully",
    success: true ,
    company,
   });
  } catch (error) {
    console.log(error);
  }
}

//update company details
export const updateCompanyDetails = async (req, res) => {
  try {
    const companyId = req.params.id;
    const { name, description, website, location, logo } = req.body;
    let company = await Company.findById(companyId);
    if(!company){
      return res.status(404).json({ message: "Company not found",
      success: false ,
     });
    }
    if(company.userId.toString() !== req.id){
      return res.status(401).json({ message: "Unauthorized",
      success: false ,
     });
    }
    company.name = name || company.name;
    company.description = description || company.description;
    company.website = website || company.website;
    company.location = location || company.location;
    company.logo = logo || company.logo;

    await company.save();

    return res.status(200).json({ message: "Company details updated successfully",
    success: true ,
    company,
   });
  } catch (error) {
    console.log(error);
  }
}
*/


//copy 



import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        // idhar cloudinary ayega
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
    
        const updateData = { name, description, website, location, logo };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}