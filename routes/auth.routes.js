const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');

const {
  validateSignup
} = require('../validation/validations');

const router = express();

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {

  const {
    userName,
    userEmail,
    userPassword,
    userBirthDate,
    userZipCode
  } = req.body;


  const validationErrors = validateSignup(userName, userEmail, userPassword, userBirthDate, userZipCode);

  if (Object.keys(validationErrors).length > 0) {
    return res.render('signup', validationErrors);
  }

  try {

    const userFromDb = await User.findOne({
      email: userEmail
    });

    if (userFromDb) {
      return res.render('signup', {
        userEmailErrors: ['E-mail pertence a outra conta']
      });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(userPassword, salt);

    await User.create({
      name: userName,
      email: userEmail,
      password: encryptedPassword,
      birthDate: userBirthDate,
      zipCode: userZipCode
    });

    res.redirect('/vaccines');
  } catch (error) {
    console.log('ERRRO NA ROTA /signup -> ', error)
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const {
      userEmail,
      userPassword
    } = req.body;

    const userFromDb = await User.findOne({
      email: userEmail
    });

    if (!userFromDb) {
      return res.render('login', {
        userEmailErrors: ['Verifique suas credenciais'],
        userPasswordErrors: ['Verifique suas credenciais']
      });
    }

    const isPasswordValid = bcrypt.compareSync(userPassword, userFromDb.password); 

    if (!isPasswordValid) {
      return res.render('login', {
        userEmailErrors: ['Verifique suas credenciais'],
        userPasswordErrors: ['Verifique suas credenciais']
      });
    }


    req.session.currentUser = userFromDb;

    res.redirect('/vaccines/user');

  } catch (error) {
    console.log(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();

  res.redirect('/login');
});

module.exports = router;