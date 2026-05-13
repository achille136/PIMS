import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide all credentials"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
        "INSERT INTO users(username,email,password) VALUES (?,?,?)";

    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err
            });
        }

        res.status(201).json({
            message: "User created successfully!"
        });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            const user = rows[0];

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            req.session.user = user;

            res.json({
                message: "Login successful",
                user: req.session.user
            });
        }
    );
};
 
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }
        res.json({
            message: "Logout successful"
        });
    });
};

export { register, login, logout };