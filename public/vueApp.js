var app = new Vue({
	el: '#app',
	data: {
		uploadedFiles: [],
		filesToUpload: [],
		uploadURL: '/upload',
		uploadedFilesURL: '/uploadedfiles'
	},
	mounted: function () {
		//Vue is ready to go and will execute this function once
		this.getUploadedFiles()
	},
	methods: {
		filesListChanged: function (evnt) {
			//The list of files to upload has changed
			for (var i = 0; i < evnt.srcElement.files.length; i++) {
				var file = evnt.srcElement.files[i]
				file.percentComplete = 0
				file.loadedMb = 0
				file.totalMb = (file.size / 1048576).toFixed(2)
				file.uploadResult = {
					Message: '',
					Complete: ''
				}
				this.filesToUpload.push(file)
			}
		},
		uploadFiles: function (evnt) {
			//User clicked the "Upload" button
			evnt.preventDefault();
			var scope = this;
			this.filesToUpload.forEach(function (file) {
				scope.sendFile(file);
			});
		},
		sendFile: function (file) {
			var formData = new FormData();
			var request = new XMLHttpRequest();

			//this is to help with some odd behaviour when there are errors
			var closure = {
				file, 
				previousPercent: 0,
				previousMb: 0
			}

			request.upload.addEventListener("progress", function (e) {
				closure.previousPercent = file.percentComplete
				closure.previousMb = file.loadedMb
				var percent = (e.loaded / e.total) * 100
				file.percentComplete = Math.round(percent)
				file.loadedMb = (e.loaded / 1048576).toFixed(2)
				file.totalMb = (e.total / 1048576).toFixed(2)
				console.log(file.name + ": " + percent)
				app.$forceUpdate()
			}, false);
			request.addEventListener("load", function (e) {
				console.log(event.target.responseText)
				file.uploadResult = event.target.responseText //JSON.parse(event.target.responseText)
				file.percentComplete = 100
				app.$forceUpdate()
				app.getUploadedFiles()
			}, false);
			request.addEventListener("error", function (e) {
				console.log({ error: "Upload Failed", file: closure.file, event: e });
				closure.file.error = "Error!"
				closure.file.percentComplete = closure.previousPercent
				closure.file.loadedMb = closure.previousMb
				app.$forceUpdate()
			}, false);
			request.addEventListener("abort", function (e) {
				console.log("Upload Aborted");
			}, false);

			formData.set('file', file);
			request.open("POST", this.uploadURL);
			request.send(formData);
		},
		getUploadedFiles: function () {
			var vueApp = this
			var request = new XMLHttpRequest();
			request.addEventListener("load", function () {
				var data = JSON.parse(this.responseText)
				data.forEach(function (file) {
					//upsert
					var index = vueApp.uploadedFiles.findIndex(name => name === file)
					if (index == -1) vueApp.uploadedFiles.push(file)
					else vueApp.uploadedFiles.splice(index, 1, file)
				})
			});
			request.open("GET", this.uploadedFilesURL);
			request.send();
		}
	}
})