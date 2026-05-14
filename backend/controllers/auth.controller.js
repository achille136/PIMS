import db from '../config/db.js';
import bcrypt from 'bcryptjs';

let strongPassword = (password) => {
    if (!password || password.length < 4) return false;
    return true;
};

let stripUser = (user) => {
    if (!user) return null;
    let { password, ...safe } = user;
    return safe;
};

let register = async (req, res) => {
    let { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide all credentials"
        });
    }

    if (!strongPassword(password)) {
        return res.status(400).json({
            message: "Password must be at least 4 characters"
        });
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let query =
        "INSERT INTO users(username,email,password) VALUES(?,?,?)";

    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.code === "ER_DUP_ENTRY" ? "Username or email already exists" : err.message
            });
        }

        res.status(201).json({
            message: "User created successfully!"
        });
    });
};

let login = (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            let user = rows[0];

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            let match = await bcrypt.compare(
                password,
                user.password
            );

            if (!match) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            req.session.user = stripUser(user);

            res.json({
                message: "Login successful",
                user: req.session.user
            });
        }
    );
};

let logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }
        res.clearCookie("connect.sid");
        res.json({
            message: "Logout successful"
        });
    });
};

let me = (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ message: "Not logged in" });
    }
    res.json({ user: req.session.user });
};

export { register, login, logout, me };
