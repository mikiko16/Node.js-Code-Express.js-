const encryption = require('../util/encryption');
const User = require('../models/User');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },
    registerPost: async (req, res) => {
        const reqUser = req.body;

        if(!reqUser.password || !reqUser.repeatPassword) {
            reqUser.error = 'Please fill all fields';
            res.render('user/register', reqUser);
            return;
        }

        if(reqUser.password !== reqUser.repeatPassword){
            reqUser.error = 'Password must match!';
            res.render('user/register', reqUser);
            return;
        }

        const salt = encryption.generateSalt();
        const hashedPass = encryption.generateSalt(salt, reqUser.password);

        try{
            const user = await User.create({
                username: reqUser.username,
                hashedPass,
                salt,
                firstName: reqUser.firstName,
                lastName: reqUser.lastName,
                roles: ['User']
            });
            req.logIn(user, (err) => {
                if(err){
                    reqUser.error = err;
                    res.render('user/register', reqUser);
                    return;
                }
                else{
                    res.redirect('/')
                }
            })
        }catch(err){
            reqUser.error = err;
            res.render('user/register', reqUser);
        }
    },
    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    },
    loginGet: (req, res) => {
        res.render('user/login')
    },
    loginPost: async (req, res) => {
        const reqUser = req.body;

        try{
            const user = await User.findOne({ username: reqUser.username });
            
            if(!user){
                reqUser.error = 'Invalid username!';
                res.render('user/login', reqUser);
                return;
            }
            if(user.authenticate(reqUser.password)){
                reqUser.error = 'Invalid password';
                res.render('user/login', reqUser);
                return;
            }
            req.logIn(user, (err) => {
                if(err){
                    reqUser.error = err;
                    res.render('user/login',reqUser);
                }
                else{
                    res.redirect('/');
                }
            })
        }catch(e){
            reqUser.error = e;
            res.render('user/login', reqUser);
        }
    }
};