import { validateString } from "../helpers/valHelpers.js";

export const validateUser = (req, res, next) => {
    const { username , password } = req.body;
    
    if (!validateString(username) || !validateString(password)) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    next();
};