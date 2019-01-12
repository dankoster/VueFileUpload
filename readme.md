# Understanding web file uploads (with Vue and Node)

## About
This code demonstrates how to handle file uploads from a web page. You don't ned much to get this going and you certianly don't need any fancy libraries. I'm using [Vue]() to hook the HTML and Javascript together and provide realtime feedback, but that's not necessary. Node provides us with a simple web server.

To send the files to the server, I'm just using a simple Javascript [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/FileGuide/FileUpDown). There are many other options such as JQuery and Angular which can send HTTP requests for you. In the end they all end up being wrappers around an XMLHttpRequest. 

Take note of the event handlers signed up to the request which give you information about the progress and status of each upload as it's happening. This allows you to create progress bars and such. More details [here](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Monitoring_progress).

I'm also using the new [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to request the list of uploaded files from the server, but that's not necessary (and not supported by all browsers). You can do this with another simple [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/FileGuide/FileUpDown).

## Prerequisites
1) Install NodeJS if you don't have it (https://nodejs.org)
2) Install Git if you don't have it (https://git-scm.com/)

## Run
1) Get the code from GitHub
	* Open a terminal to a folder where you put sample projects.
	* Execute the following command in that folder to get the code. This will create a folder named "VueFileUpload" and put the files inside.
		```
		git clone https://github.com/dankoster/VueFileUpload.git
		```
	* Navigate to the VueFileUpload folder in your terminal. 
	* Execute the command to install missing node modules. This will download the stuff node needs into a folder named "VueFileUpload/node_modules/"
		```
		npm install
		```

2) Run the server
	* Navigate to the VueFileUpload folder in your terminal. 
	* Execute the following command to start the server. 
		```
		node nodeApp.js
		```
		This will tell Node to run the nodeApp.js script, which starts a web server listening on port 3000.

3) Run the client
	* Open a web browser to http://localhost:3000
	* Choose some files to upload
	* When you click the Upload button the files you selected will be uploaded to VueFileUpload/Uploads/ and will appear on the page.
	* To prevent the uploads from happening immediately, you can throttle the upload speed using your browser's dev tools.
	
	Read about throttling for Chrome here: https://developers.google.com/web/tools/chrome-devtools/network-performance/network-conditions

