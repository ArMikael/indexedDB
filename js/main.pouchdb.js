(function () {
	'use strict';

	var db = new PouchDB('vPDB');

	db.info().then(function (info) {
		console.log(info);
	})

	// PouchDB.debug.enable('*');

	var deviceObj;

	for (var i = 0; i < 100; i++) {
		deviceObj = {
			"_id": "id" + i,
			"deviceID": "dev_id" + i,
			"type": "camera_" + i,
			"name": "sony-" + i
		};

		db.put(deviceObj);
	}

	db.get('id13').then(function (doc) {
		console.log(doc);
	});

})();

