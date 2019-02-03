const Car = require('../models/Car');
const Rent = require('../models/Rent');

module.exports = {
    addGet: (req, res) => {
        res.render('car/add');
    },
    addPost: (req, res) => {
        const info = req.body;
        console.log(info);
        try{
            const newCar = Car.create({
                model: info.model,
                image: info.image,
                pricePerDay: info.pricePerDay  
              })
            res.redirect('/');
        }
        catch(e){
            console.log(e);
        }
    },
    allCars: (req, res) => {
        Car.find({ isRented: false }).then((cars) => {
            res.render('car/all', { cars });
        })
        .catch((err) => console.log(err));
    },
    rentGet: (req, res) => {
        const id = req.params.id;
        Car.findById(id)
        .then((car) => {
            res.render('car/rent', car);
        })
    },
    rentPost: (req, res) => {
        const car = req.params.id;
        const owner = req.user._id;
        const days = Number(req.body.days);

        Rent.create({ days, car, owner})    
        .then(() => {
            Car.findById(car)
            .then((c) => {
                c.isRented = true;
                return c.save();
            }).then(() => {
                res.redirect('/car/all');
            })
        }).catch(console.error);
    },
    editGet: (req, res) => {
        console.log(req.body);
        Car.findById(req.body._id)
        .then((car) => {
            res.render('car/edit', car)
        })
    },
    editPost: (req, res) => {
        const id = req.params.id;
        const model = req.body.model;
        const image = req.body.image;
        const pricePerDay = req.body.pricePerDay;
        Car.findByIdAndUpdate(id, {model, image, pricePerDay})
        .then(() => {
            res.redirect('/car/all')
        }).catch((err) => {
            console.log(err);
        })        
    },
    seeRents: (req, res) => {
        let id = req.user._id
        Rent.find({ owner: id }).populate('owner').populate('car').then(
            cars => {
                res.render('user/rented', {cars})
            })
    }
}