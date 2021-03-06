(function(){
	'use strict';

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

	console.log('IndexedDB support: ', indexedDB);

	// Removing database from browser - indexedDB.deleteDatabase("valerusDB") 
	// Type in browser console: indexedDB.deleteDatabase("valerusDB") 

	if (indexedDB) {
		var request = indexedDB.open('valerusDB', 9);
		var valDB;

		request.onerror = function(err) {
			console.log('Error: ', err.target.error);
		};

		request.onsuccess = function(event) {
			var devID = '140.20.162.33';
			var devName = 'vicon-nvr';
			var newDevice = {
					deviceID: '10.20.30.99',
					type: 'cam',
					name: 'simco-cam'
				};

			valDB = event.target.result;

			getDevice(valDB, devID);
			shortGetDevice(valDB, devID);
			getDeviceByName(valDB, devName);
			addDevice(valDB, newDevice); // Return error if the key is already exist
			// setDevice(valDB, newDevice); // Updates existing key if it is already exist in db
			// removeDevice(valDB, devID);
			getAllDevices(valDB);
		};

		request.onupgradeneeded = function(event) { 
			valDB = event.target.result;
			var target = event.target;

			var devices = [{
					deviceID: '122.13.16.192',
					type: 'camera',
					name: 'sony-lineum'
				}, {
					deviceID: '140.20.162.33',
					type: 'camera',
					name: 'sharp-ostro'
				}, {
					deviceID: '10.10.16.95',
					type: 'nvr',
					name: 'vicon-nvr'
				}];


			// Creating objectStores for this database - alternative to tables in nosql databases
			var objectStore = valDB.createObjectStore("devices", {keyPath: "deviceID"});

			objectStore.createIndex("name", "name", { unique: false });
			objectStore.createIndex("type", "type", { unique: false });
			objectStore.createIndex("deviceID", "deviceID", { unique: true });

			objectStore.transaction.oncomplete = function(event) {
				var devicesObjectStore = valDB.transaction('devices', 'readwrite').objectStore('devices');

				for (var dev in devices) {
					devicesObjectStore.add(devices[dev]);
				};

				console.log('Transaction completed');
			};

			// console.log(objectStore);
			console.log(valDB.objectStoreNames); // objectStoreNames - list of all objectStores in indexedDB
		};


		// Getting data from database 
		function getDevice(db, devID) {
			var transaction = db.transaction(["devices"], "readonly");
			var objectStore = transaction.objectStore("devices");
			var request = objectStore.get(devID);

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};

			request.onsuccess = function(event) {
				console.log('Get Device success: ', request.result.name);
			};
		};

		// Shorter version of getting data
		function shortGetDevice(db, devID) {
			db.transaction("devices").objectStore("devices").get(devID).onsuccess = function(event) {
				console.log("Name for devicesID " + devID + " is " + event.target.result.name);
			};
		};

		// Get device by name
		function getDeviceByName(db, devName) {
			var transaction = db.transaction(["devices"], "readonly");
			var objectStore = transaction.objectStore("devices");
			var index = objectStore.index("name");

			index.get(devName).onsuccess = function(event) {
				console.log(devName + " ID is: " + event.target.result.deviceID);
			};
		};

		// Removing objects from DB
		function removeDevice(db, devID) {
			var request = db.transaction(["devices"], "readwrite")
	            .objectStore("devices")
	            .delete(devID);

			request.onsuccess = function(event) {
				// event.target.result doesn't works, because the device is already deleted
				console.log('Device ' + devID + ' was removed from database'); 
			};

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};
		};

		// Setting new device to database (If key already exist - return error)
		function addDevice(db, devObj) {
			var request = db.transaction(["devices"], "readwrite")
	            .objectStore("devices")
	            .add(devObj); 

			request.onsuccess = function(event) {
				console.log('Adding device is completed: ' + event.target.result);
			};

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};
		};

		// Setting new device to database (If key already exist - update existing key)
		function setDevice(db, devObj) {
			var request = db.transaction(["devices"], "readwrite")
	            .objectStore("devices")
	            .put(devObj); 

			request.onsuccess = function(event) {
				console.log('Setting device is completed: ' + event.target.result);
			};

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};
		};

		// Get all devices using Cursor() method
		function getAllDevices(db) {
			var devices = [];

			var devStore = db.transaction(["devices"], "readwrite").objectStore("devices");

			devStore.openCursor().onsuccess = function(event) {
				var cursor = event.target.result;

				if (cursor) {
					console.log(cursor.value);
					devices.push(cursor.value);
					cursor.continue();
				} else {
					console.log("Got all devices: " + devices);
				}
			};
		};

	}



})();
