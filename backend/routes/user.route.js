/*
import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { login, register, updateProfile } from '../controllers/user.controller.js';

// ✅ FIX: Added curly braces around { singleUpload }
import { singleUpload } from '../middlewares/multer.js'; 

const router = express.Router();

router.route('/register').post(singleUpload, register);
router.route('/login').post(login);
router.route('/profile/update').post(isAuthenticated, singleUpload, updateProfile);

export default router;

*/

import express from 'express';
import isAuthenticated from "../middlewares/isAuthenticated.js";
// ✅ FIX: Added 'logout' to your controller imports
import { login, logout, register, updateProfile } from '../controllers/user.controller.js'; 
import { singleUpload } from '../middlewares/multer.js'; 

const router = express.Router();

router.route('/register').post(singleUpload, register);
router.route('/login').post(login);

// ✅ FIX: Added the missing logout route here!
router.route('/logout').post(logout); 

router.route('/profile/update').post(isAuthenticated, singleUpload, updateProfile);

export default router;