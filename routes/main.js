const express = require('express');
const router = express.Router();

/* GET encrypt page. */
router.get('/', function (req, res, next) {
    res.render('main');
});

// router.post('/encrypt', upload.single("toEncrypt" /* name attribute of <file> element in your form */),
//     function (req, res) {
//     console.log(req.body);
//         const tempPath = req.file.path;
//         const encryptedPath = req.file.destination + "\\" + req.file.originalname.split('.')[0] + "_encrypted.dat";
//         const options = { algorithm: req.body.encryptionType };
//         const key = req.body.key;
//         console.log('Uploaded!');
//         encryptor.encryptFile(tempPath, encryptedPath, key, options, function(err) {
//             res.download(encryptedPath,  req.file.originalname.split('.')[0] + "_encrypted.dat", function (err) {
//                 console.log("Downloaded");
//                 if (err) {
//                     res.status(503).json({
//                         message: err.message
//                     });
//                 }
//                 fs.unlinkSync(encryptedPath);
//             });
//             console.log("Encrypted");
//             if(err) {
//                 res.status(503).json({
//                     message: err.message
//                 });
//             }
//             fs.unlinkSync(tempPath);
//         });
//
//     });
module.exports = router;

