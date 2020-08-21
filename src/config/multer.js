const multer = require('multer');
const path = require('path'); // encontrar arquivo
const crypto = require('crypto'); // cria uma hash eleatorio para cada upload

const localStorage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, path.resolve(__dirname, '..','..','tmp', 'uploads'));
  },
  filename: (req, file, cb) =>{
    crypto.randomBytes(16, (error, hash) =>{
      if (error){
        cb(error);
      }

      file.key = `${hash.toString('hex')}-${file.originalname}`;
      cb(null, file.key);
    });
  },

});

module.exports ={
  dest:path.resolve(__dirname, '..','..','tmp', 'uploads'),
  storage: localStorage,
};
