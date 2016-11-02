function fnMainResolve(response) {

//*** START indexedDB Sandbox 
function saveToIndexedDb(_globalData) {
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    if (indexedDB) {
        var startIndexDb = new Date();
        var request = indexedDB.open('test4DB', 2);
        var valDB;

        request.onerror = function(err) {
            console.log('Error: ', err.target.error);
        };

        request.onsuccess = function(event) {
            valDB = event.target.result;

            //getAllDevices(valDB);
        };

        request.onupgradeneeded = function(event) {
            var globalPropertiesList = Object.getOwnPropertyNames(_globalData);

            valDB = event.target.result;

            globalPropertiesList.forEach(function(key) {
                var currentData = _globalData[key];
                console.log("the key is: " + key);

                if (currentData) {
                    if (!currentData.list) {
                        console.log(currentData);
                        return;
                    }

                    var objectStore = valDB.createObjectStore(key, { keyPath: "id" });
                    objectStore.createIndex("id", "id", { unique: true });

                    var currentList = currentData.list;

                    for (var i = 0; i < currentList.length; i++) {
                        objectStore.put(currentList[i]);
                        console.log(currentList[i]);
                    }
                }
            });

            var endIndexDb = new Date();

            var totalTime = endIndexDb - startIndexDb;
            console.log('Writing devices to indexedDB is completed. Total time: ' + totalTime + " ms");
        }
    }
};

saveToIndexedDb(globalDataAccessPoint);
//** END indexedDB Sandbox 
