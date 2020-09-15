const userModels = require("../models/userModels");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/auth");
const validator = require("validator");
const nodemailer = require("nodemailer");
const router = require ("express").Router();
const User = require ("../models/userModels");


let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
    user: "rennanboy45@gmail.com",
    pass: process.env.EMAIL_KEY
    }
});


router.post("/register", async (req, res) => {

    try {
        const { email, password, passwordCheck} = req.body;

        if (!email || !password || !passwordCheck)
            return res.status(400).json({msg: "Not all fields have been entred."});
        if (!validator.isEmail(email))
            return res.status(400).json({msg: "The email is not valid."});
        if (!validator.isAlphanumeric(password))
            return res.status(400).json({msg: "The password is not alphanumeric"});
        if (password.length < 6)
            return res.status(400).json({msg: "The passaword needs to be at least 6 characters long."});
        if (password !== passwordCheck)
            return res.status(400).json({msg: "Enter the same password twice for verification."});
        
        const existingUser = await userModels.findOne({email : email})
        if(existingUser)
            return res.status(400).json({msg: "An account with this email already exists."});

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        
        const newUser = new User({
            email,
            password: passwordHash,
        });
        
        const savedUser = await newUser.save();

        crypto.randomBytes(8, (err, buffer) => {
            if (err){
                console.log(err)
            }
            const token = buffer.toString("hex")


            newUser.resetTokenConfirmation = token;
            newUser.expireTokenConfirmation = Date.now() + 3600000;
            newUser.save().then((result) => {
               let mailOptions = {
                   from: "rennanboy45@gmail.com",
                   to: newUser.email,
                   subject: `Confimation Token`,
                   html: `<h5> Insert the Key on the user page to activate the accountant ${token}</h5> `,
               };
               
               transporter.sendMail(mailOptions)
                })

        })

        res.json(savedUser);


        
    }catch (err) {
        res.status(500).json({error: err.mensage});
    }


    
});

router.post("/login", async(req, res) =>{
    try{
        const {email, password} = req.body;
        if (!email || !password)
            return res.status(400).json({msg: "Not all fields have been entred."});
        
        const user = await User.findOne({email : email});
        if(!user)
            return res.status(400).json({msg: "No account found."});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
            return res.status(400).json({msg: "Invalid credentials."});

        const token = jwt.sign({id : user._id}, process.env.JWT_TOKEN);

        res.json({
            token,
            user: {
                id: user._id,
                admin: user.admin,
                accountKeyConfirmed: user.accountKeyConfirmed,
            },
        });   
    }catch(err) {
        res.status(500).json({error: err.mensage});
    }
});

router.delete("/delete", authentication, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    }catch (err) {
        res.status(500).json({error: err.mensage});
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try{
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_TOKEN);
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    }catch (err) {
        res.status(500).json({error: err.mensage});
    }
})

router.get("/", authentication, async (req, res) => {
    const user = await User.findById(req.user);
        
    res.json({
        user: {
            id: user._id,
            admin: user.admin,
            accountKeyConfirmed: user.accountKeyConfirmed,
        },
    });
})

router.post("/resetPassword", (req, res) => {

    const {email} = req.body;
    crypto.randomBytes(32, (err, buffer) => {
        if (err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email: email})
        .then(user => {
            if(!user){
                return res.status(422).json({error: "User dont exists"});
            }
            user.resetToken = token;
            user.expireToken = Date.now() + 3600000;
            user.save().then((result) => {
               res.json({mensage: "Check you email!"})
               let mailOptions = {
                   from: "rennanboy45@gmail.com",
                   to: user.email,
                   subject: `Password Reset Link`,
                   html: `<h5> Click on the <a href = "http://104.131.46.234:3000/resetPassword/${token}" >link</a> </h5> `,
               };
               
               transporter.sendMail(mailOptions, function(error) {
                   if (error) {
                       throw error;
                   } else {
                       console.log("Email successfully sent!");
                   }
               });
                })
                
            })
        })
})

router.post("/newPassword", (req, res) => {
    try{
        const { newPassword, token } = req.body;
    
        if (!validator.isAlphanumeric(newPassword))
            return res.status(400).json({msg: "The password is not alphanumeric"});
        if (newPassword.length < 6)
            return res.status(400).json({msg: "The passaword needs to be at least 6 characters long."});

        User.findOne({resetToken: token, expireToken:{$gt:Date.now()}})
        .then(async (user) => {
            if(!user){
                return res.status(422).json({error: "Try again sesion expired"})
            }
        
            const hashedpasword = await bcrypt.hash(newPassword, 10)
                user.password = hashedpasword;
                user.resetToken = undefined;
                user.expireToken = undefined;
                user.save().then((saveduser) => {
                    res.json({mensage: "password updated success"});
                })  
        })
    }catch (err) {
        res.status(500).json({error: err.mensage});
    }

    

})

router.post("/confirmationToken", (req, res) => {
    const { token, id } = req.body;  
    try {
    User.findById(id)        
        .then(async (user) => {

            if(!user){
                return res.status(422).json({error: "Try again sesion expired"})
            }
            if (user.resetTokenConfirmation === token)
                user.accountKeyConfirmed = true;
                user.save()
                return res.status(200).json({user:user});
            })
    }catch(err){
        res.status(500).json({error: err.mensage});
    }


})

router.post("/emailChange", (req, res) => {
    const {newEmail, id} = req.body;

    try {
        User.findById(id)        
            .then(async (user) => {
    
                if(!user){
                    return res.status(422).json({error: "Try again sesion expired"})
                }
                    crypto.randomBytes(8, (err, buffer) => {
                        if (err){
                            console.log(err)
                        }

                        const token = buffer.toString("hex")
                        user.email = newEmail;
                        user.resetTokenConfirmation = token;
                        user.expireTokenConfirmation = Date.now() + 3600000;
                        user.accountKeyConfirmed = false;
                        user.save().then((result) => {
                        let mailOptions = {
                            from: "rennanboy45@gmail.com",
                            to: user.email,
                            subject: `Confimation Token`,
                            html: `<h5> Insert the Key on the user page to activate the accountant ${token}</h5> `,
                        };
                
                        transporter.sendMail(mailOptions)
                        })
                    });
            
                return res.status(200).json({user:user});
            })

        }catch(err){
            res.status(500).json({error: err.mensage});
        }
})

router.post("/newToken", (req, res) => {
    const {id} = req.body;

    try {
        User.findById(id)        
            .then(async (user) => {  
                if(!user){
                    return res.status(422).json({error: "Try again sesion expired"})
                }

                    crypto.randomBytes(8, (err, buffer) => {
                        if (err){
                            console.log(err)
                        }

                        const token = buffer.toString("hex")
                        user.resetTokenConfirmation = token;
                        user.expireTokenConfirmation = Date.now() + 3600000;
                        user.save().then((result) => {
                        let mailOptions = {
                            from: "rennanboy45@gmail.com",
                            to: user.email,
                            subject: `Confimation Token`,
                            html: `<h5> Insert the Key on the user page to activate the accountant ${token}</h5> `,
                        };
                
                        transporter.sendMail(mailOptions)
                        })
                });
                           
                return res.status(200).json({user:user});
            })

        }catch(err){
            res.status(500).json({error: err.mensage});
        }
})

router.post("/personalData", async (req, res) => {
    try { 
        const {userName, userBirth, userCPF, userAddress, userBiography, id} = req.body;
        if (!userName || !userBirth || !userCPF || !userAddress)
            return res.status(400).json({msg: "Not all fields have been entred."}); 
                
        if (userCPF < 11)
            return res.status(400).json({msg: "The CPF is not valid."});
        console.log(req.body)
        
        User.findById(id)
        .then((user) => {
            user.userName = userName;
            user.userBirth= userBirth;
            user.userCPF= userCPF;
            user.userAddress= userAddress;
            user.userBiography= userBiography;
            user.save().then(() => {
                return res.json(user) 
                })
        })                      

    }catch (err){
        console.log(err)
        return res.status(500).json({error: err.mensage});
    }
})

router.post("/workstation", (req, res) => {

})

router.post("/meeting", (req, res) => {

})

router.post("/workstationAdmin", (req, res) => {

})

router.post("/meetingAdmin", (req, res) => {

})


module.exports = router;