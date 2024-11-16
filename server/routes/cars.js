const multer = require('multer');
const path = require('path');
const router = require('./auth');
const auth = require('../middleware/auth');
const Car = require('../models/Car');


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, 'car-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).array('images', 10);

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) return cb(null, true);
  cb('Error: Images Only!');
}

router.post('/', auth, upload, async (req, res) => {
  try {
    console.log('Uploaded Files:', req.files);
    console.log('Request Body:', req.body);
    console.log('Authenticated User:', req.user);
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const imagesPaths = req.files?.map((file) => file.path) || [];

    const car = new Car({
      ...req.body,
      images: imagesPaths,
      user: req.user._id,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(400).json({ error: error.message });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', auth, async (req, res) => {
  const keyword = req.query.keyword;
  try {
    const cars = await Car.find({
      user: req.user._id,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { 'tags.car_type': { $regex: keyword, $options: 'i' } },
        { 'tags.company': { $regex: keyword, $options: 'i' } },
        { 'tags.dealer': { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const car = await Car./* findOne */findById({ _id: req.params.id, user: req.user._id });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id', auth, upload, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.length) {
      updates.images = req.files.map(file => file.path);
    }
    
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true }
    );
    
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports=router;