const jwt = require("jsonwebtoken");

const auth = (req, res, next ) => {
    try {
        const token = req.header("x-auth-token");
        if (!token)
            return res.status(401).json({msg: "Not authentication token."});

        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        if (!verified)
            return res.status(401).json({msg: "Token verification falied."});

        res.user = verified.id;
        next();
    }catch (err) {
        res.status(500).json({error: err.mensage});
    }
};

module.exports = auth;