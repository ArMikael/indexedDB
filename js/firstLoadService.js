function fnMainResolve(response) {

    function saveToIndexedDb(_globalData) {
    	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        //var globalPropertiesList = Object.getOwnPropertyNames(_globalData);

        //globalPropertiesList.forEach(function(key) {
        //    var currentData = _globalData[key];
        //    console.log("the key is: " + key);
        //    if (currentData) {
        //        if (!currentData.list) {
        //            console.log(currentData);
        //            return;
        //        }
        //        for (var resourceId in currentData) {
        //            if (typeof currentData[resourceId] !== 'function') {
        //                console.log(currentData[resourceId]);
        //            }

        //        }
        //    }
        //});

        var startIndexDb = new Date();

        if (indexedDB) {
            var request = indexedDB.open('test3DB', 1);
            var valDB;

            request.onerror = function (err) {
                console.log('Error: ', err.target.error);
            };

            request.onsuccess = function (event) {
                valDB = event.target.result;

                //getAllDevices(valDB);
            };

            request.onupgradeneeded = function (event) {
                var resourcesList = ["devices", "exportList", "nvrs", "proxys", "schedules", "rules"];
                valDB = event.target.result;

                for (var item = 0; item < resourcesList.length; item++) {
                    var listName = resourcesList[item];
                    var currentList = _globalData[listName].list;
                    var objectStore = valDB.createObjectStore(listName, { keyPath: "id" });

                    objectStore.createIndex("id", "id", { unique: true });

                    for (var i = 0; i < currentList.length; i++) {
                        objectStore.put(currentList[i]);
                        console.log(currentList[i]);
                    }
                }

                var endIndexDb = new Date();

                var totalTime = endIndexDb - startIndexDb;
                console.log('Writing devices to indexedDB is completed. Total time: ' + totalTime + " ms");

                // streams -byGuid
            }
        } 
    };

    saveToIndexedDb(globalDataAccessPoint);
}