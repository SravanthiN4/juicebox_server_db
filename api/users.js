const express = require('express');
const usersRouter = express.Router();
const {getAllUsers, getUserByUserName,createUser, getUserById, updateUser} = require('../db')
const jwt = require('jsonwebtoken');
const {requireActiveUser} = require('./util')


usersRouter.use((req,res,next) => {
    console.log("A request is being made to the /users");
    next();

});

usersRouter.get('/', async (req,res) => {
    const users = await getAllUsers();
    res.send({
        users
    });
});

usersRouter.post('/login',async(req,res,next) => {
    

   const {username,password} = req.body;
  

   // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUserName(username);


    if (user && user.password == password) {
      // create token & return to user
      const token = jwt.sign({id:user.id, username},process.env.JWT_SECRET,{expiresIn:'1w'});
      console.log(token);
      res.send({message: "you're logged in!",token });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post('/register',async(req,res,next) => {
    const {username,password,name,location} = req.body;
    try {
        const _user = await getUserByUserName(username);
        if(_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            });

        }

        const user = await createUser({
            username,
            password,
            name,
            location,
    
        })

        const token = jwt.sign(
            {
                id:user.id,
                username
            }, process.env.JWT_SECRET,{
                expiresIn:'1w'
            }
        )

        res.send({
            message: "thank you for signing up",
            token
        })
        
    } catch ({ name, message }) {
        next({ name, message })
      } 
})

usersRouter.delete('/:userId',async(req,res,next) => {
    try {
        const userById = await getUserById(req.params.userId);
        console.log(userById);
       if(userById && userById.active && userById.id === req.user.id){
            const updatedUser = await updateUser(userById.id, {active:false});
            res.send({user:updatedUser});
        } else {
            next(userById ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a user which is not yours"
            }: {
                name: "UserNotFoundError",
                message: "That user does not exist"
            })
        }
        
    } catch ({ name, message }) {
        next({ name, message })
      }
})

usersRouter.patch('/:userId',async(req,res,next) => {
    const {userId} = req.params;
    const {name, location, active} = req.body;

    const updateFields = {};

    if(name) {
        updateFields.name = name;
    }
    if(location) {
        updateFields.location = location;
    } 
    if(active) {
        updateFields.active = active;
    }
    try {
        const originalUser = await getUserById(userId);
        if(originalUser.id === req.user.id) {
            const updatedUser = await updateUser(userId,updateFields);
            res.send({user : updatedUser})
        } else {
            next({
                name: 'UnauthorizedUserError',
                message:'You cannot update a user that is not yours'
            })
        }
        
    } catch ({name,message}) {
        next({
            name, message
        })
        
    }

})




module.exports = usersRouter;