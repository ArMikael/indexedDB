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
                var currentList, currentResourceType, currentGuid, currentObj;
                
                valDB = event.target.result;

                globalPropertiesList.forEach(function(key) {
                    var currentData = _globalData[key];
                    console.log("the key is: " + key);
                    
                    if (currentData) {
                            currentResourceType = currentData.byResourceType;
                            currentGuid = currentData.byGuid;
                            currentList = currentData.list;
                        currentObj = {
                            currentResourceType: currentResourceType,
                            currentGuid: currentGuid,
                            currentList: currentList

                        };



                        var objectStore = valDB.createObjectStore(key, { keyPath: "id" });
                        objectStore.createIndex("id", "id", { unique: true });

                        if (currentObj) {
                            if (currentObj.currentResourceType !== undefined) {
                                currentObj.currentResourceType.id = utilities.createGuid();
                                objectStore.put(currentObj.currentResourceType);
                            }
                            if (currentObj.currentGuid) {
                            
                            }
                            if (currentObj.currentList) {
                            
                            }
                        }


                        /*if (currentList.length > 0) {
                            for (var i = 0; i < currentList.length; i++) {
                                objectStore.put(currentList[i]);
                                console.log(currentList[i]);
                            }
                        } else {
                            console.log(currentList);
                            objectStore.put(currentList);
                        }*/
                        
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
}