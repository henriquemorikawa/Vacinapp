const express = require('express');
const {
  format
} = require('date-format-parse');

const Vacc = require('../models/Vaccine');
const User = require('../models/User');

const fileUploader = require('../config/cloudinary.config');

const router = express();

router.get('/', (req, res) => {
  const {
    vaccineName
  } = req.query;

  Vacc.find({
      owner: req.session.currentUser._id,
      name: {
        $regex: new RegExp(vaccineName, 'i')
      }
    })
    .then(vaccinesFromDatabase => {
      res.render('user', {
        vaccines: vaccinesFromDatabase,
        currentUser: req.session.currentUser
      });
    });
});

router.get('/map', (req, res) => {

  User.find()
  .then(() =>{
    let zipCode = req.session.currentUser.zipCode
    res.render('map', { zipCode });
  })
  .catch(error =>{
    console.log(error)
  })
});

router.get('/tables', (req, res) => {
  res.render('tables');
});

router.get('/medicine', (req, res) => {
  Vacc.find()
  .then(vaccine =>{
    res.render('medicine', { vaccine });
  })
  .catch(error =>{
    console.log(error)
  })
});

router.get('/data', (req, res) => {
  res.render('data');
});

router.get('/travel', (req, res) => {
  res.render('travel');
});

router.get('/user', (req, res) => {
  const id = req.session.currentUser._id
  User.findById(id)
  .then(user =>{
    let name = user.name,
        birthDate = user.birthDate,
        genre = user.genre,
        zipCode = user.zipCode

    res.render('user', { name, birthDate, genre, zipCode });
    // console.log(user)
  })
  .catch(error =>{
    console.log(error)
  })
});

router.post('/user', (req, res, next) =>{

  const { name, birthDate, genre, zipCode } = req.body 
  const id = req.session.currentUser._id
  console.log(req.body)

  User.findByIdAndUpdate(id, { name, birthDate, genre, zipCode}, {new: true})
  .then(() =>{
    res.redirect('/vaccines/user')
  })
  .catch(error =>{
    next()
    console.log(error)
  })
})

router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

router.get('/new', (req, res) => {
  res.render('newVaccine');
});

router.get('/:vaccineId', (req, res) => {
  const {
    vaccineId
  } = req.params;

  Vacc.findById(vaccineId).populate('owner')
    .then(vaccineFromDatabase => {
      const birthDateParsed = format(vaccineFromDatabase.birthDate, 'YYYY-MM-DD');

      const mongoDbObject = vaccineFromDatabase.toJSON();

      const newObject = {
        ...mongoDbObject,
        birthDate: birthDateParsed
      };

      const typesValues = [{
          value: 'dog',
          text: 'Cachorro'
        },
        {
          value: 'cat',
          text: 'Gato'
        },
        {
          value: 'parrot',
          text: 'Papagaio'
        },
      ];

      const vaccineIndex = typesValues.findIndex((vaccineOption) => {
        return vaccineOption.value === vaccineFromDatabase.types;
      });

      const foundvaccineValue = typesValues[vaccineIndex];
      typesValues.splice(vaccineIndex, 1);
      typesValues.unshift(foundvaccineValue);

      res.render('vaccineDetail', {
        vaccine: newObject,
        typesValues,
        vaccinetypesText: typesValues[vaccineIndex].text,
        currentUser: req.session.currentUser
      });
    });
});


router.post('/new', fileUploader.single('vaccineImage'), (req, res) => {

  const {
    vaccineName,
    vaccinetypes,
    vaccineBirthDate
  } = req.body;

  const newVaccine = {
    name: vaccineName,
    image: req.file.path,
    types: vaccinetypes,
    birthDate: vaccineBirthDate,
    owner: req.session.currentUser._id,
  };

  Vacc.create(newVaccine)
    .then(() => {
      res.redirect('/vaccines');
    })
    .catch(error => console.log(error));

});

router.post('/edit/:vaccineId', (req, res) => {
  const {
    vaccineName,
    vaccineImage,
    vaccinetypes,
    vaccineBirthDate
  } = req.body;
  const {
    vaccineId
  } = req.params;

  Vacc.findByIdAndUpdate(vaccineId, {
      name: vaccineName,
      image: vaccineImage,
      types: vaccinetypes,
      birthDate: vaccineBirthDate
    })
    .then(() => {
      res.redirect(`/vaccines/${vaccineId}`);
    })
    .catch(error => console.log(errror));

});

module.exports = router;