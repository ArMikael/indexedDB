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
			var devID = '10.10.16.95';
			var devName = 'vicon-nvr';
			var newDevice = {
					deviceID: '10.20.30.101',
					type: 'cam',
					name: 'riche-cam'
				};

			valDB = event.target.result;
			var devStore = valDB.transaction(["devices"], "readwrite").objectStore("devices");


			// getDevice(devStore, devID);
			// shortGetDevice(devStore, devID);
			// getDeviceByName(devStore, devName);
			// addDevice(devStore, newDevice); // Return error if the key is already exist
			setDevice(devStore, newDevice); // Updates existing key if it is already exist in db
			// removeDevice(devStore, devID);
			// getAllDevices(devStore);
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
		function getDevice(devStore, devID) {
			var request = devStore.get(devID);

			request.onsuccess = function(event) {
				console.log('Get Device success: ', request.result.name);
			};

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};
		};

		// Shorter version of getting data
		function shortGetDevice(devStore, devID) {
			devStore.get(devID).onsuccess = function(event) {
				console.log("Name for devicesID " + devID + " is " + event.target.result.name);
			};

			devStore.get(devID).onerror = function(event) {
				console.log('Error: ', err.target.error);
			};
		};

		// Get device by name
		function getDeviceByName(devStore, devName) {
			var index = devStore.index("name");

			index.get(devName).onsuccess = function(event) {
				console.log("Got device by name: " + devName + " ID is: " + event.target.result.deviceID);
			};
		};

		// Setting new device to database (If key already exist - return error)
		function addDevice(devStore, devObj) {
			var request = devStore.add(devObj); 

			request.onsuccess = function(event) {
				console.log('Adding device is completed: ' + event.target.result);
			};

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};
		};

		// Setting new device to database (If key already exist - update existing key)
		function setDevice(devStore, devObj) {
			var request = devStore.put(devObj); 

			request.onsuccess = function(event) {
				console.log('Setting device is completed: ' + event.target.result);
			};

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};
		};


		// Removing objects from DB
		function removeDevice(devStore, devID) {
			var request = devStore.delete(devID);

			request.onsuccess = function(event) {
				// event.target.result doesn't works, because the device is already deleted
				console.log('Device ' + devID + ' was removed from database'); 
			};

			request.onerror = function(err) {
				console.log('Error: ', err.target.error);
			};
		};


		// Get all devices using Cursor() method
		function getAllDevices(objStore) {
			var devices = [];

			objStore.openCursor().onsuccess = function(event) {
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