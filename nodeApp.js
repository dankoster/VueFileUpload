const express = require('express')
const Busboy = require('busboy');
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3000
const uploadPath = 'uploads'

app.use(express.static('public')) //automatically serves ./public/index.html
app.use('/'+uploadPath, express.static(uploadPath))

app.get('/uploadedfiles', function (req, res) {
	if (fs.existsSync(uploadPath)) {
		fs.readdir(uploadPath, (err, files) => {
			res.send(files)
		})
	}
	else {
		res.send([])
	}
})

app.post('/upload', function (req, res) {
	var busboy = new Busboy({ headers: req.headers });
	busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
		console.log({ filename, filename, encoding, mimetype })
		if (!fs.existsSync(uploadPath))
			fs.mkdir(uploadPath, (err) => { if (err) throw err })
		var saveToPath = path.join(uploadPath, path.basename(filename))
		file.pipe(fs.createWriteStream(saveToPath));
	});
	busboy.on('finish', function () {
		res.writeHead(200, { 'Connection': 'close' });
		res.end('uploaded');
	});
	req.pipe(busboy)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))