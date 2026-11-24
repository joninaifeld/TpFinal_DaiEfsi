import { validateString } from "../helpers/valHelpers.js";

export const validateRegister = (req, res, next) => {
    const { username , email, password } = req.body;
    
    if (!validateString(username) || !validateString(email) || !validateString(password)) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o son inválidos' });
    }

    next();
};