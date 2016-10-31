(function () {
	'use strict';

	var db = new PouchDB('valerPDB');

	db.info().then(function (info) {
		console.log(info);
	})

})();