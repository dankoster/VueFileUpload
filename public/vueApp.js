var app = new Vue({
	el: '#app',
	data: {
		uploadedFiles: [],
		filesToUpload: [],
		uploadURL: '/upload',
		uploadedFilesURL: '/uploadedfiles'
	},
	mounted: function () {
		this.getUploadedFiles()
	},
	methods: {
		update: function (obj, prop, event) {
			//https://stackoverflow.com/a/46925611
			Vue.set(obj, prop, event.target.value);
		},
		filesListChanged: function (evnt) {
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
			evnt.preventDefault();
			var scope = this;
			this.filesToUpload.forEach(function (file) {
				scope.sendFile(file);
			});
		},
		sendFile: function (file) {
			var formData = new FormData();
			var request = new XMLHttpRequest();

			request.upload.addEventListener("progress", function (e) {
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
				console.log("Upload Failed");
				debugger
			}, false);
			request.addEventListener("abort", function (e) {
				console.log("Upload Aborted");
				debugger
			}, false);

			formData.set('file', file);
			request.open("POST", this.uploadURL);
			request.send(formData);
		},
		getUploadedFiles: function () {
			var scope = this
			fetch(this.uploadedFilesURL)
				.then(response => {
					response.json().then(function (data) {
						data.forEach(function (file) {
							//upsert
							var index = scope.uploadedFiles.findIndex(name => name === file)
							if (index == -1)
								scope.uploadedFiles.push(file)
							else
								scope.uploadedFiles.splice(index, 1, file)
						})
					})
				})
				.catch(error => { console.log(error) })
		}
	}
})