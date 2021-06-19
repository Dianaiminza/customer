var  express =require ('express');
var multer =require ('multer');

var  config =require('../config');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

var upload = multer({ storage:storage });

var router=express.Router();

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});


module.exports=router; 