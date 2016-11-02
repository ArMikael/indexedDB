
request.onupgradeneeded = function (event) {
       var devices = _globalData['devices'].list;
       console.log(devices);

       valDB = event.target.result;

       var objectStore = valDB.createObjectStore("devices", { keyPath: "id" });

       //for (var i = 0; i < devices.length; i++) {
       //    var device = devices[i];

       //    for (var prop in device) {
       //        console.log(prop, prop.value);
       //        objectStore.createIndex(prop, prop, { unique: false });
       //    }          
       //}

       objectStore.createIndex("id", "id", { unique: true });
       objectStore.createIndex("name", "name", { unique: false });
       objectStore.createIndex("vendor", "vendor", { unique: false });
       objectStore.createIndex("model", "model", { unique: false });
       objectStore.createIndex("firmware", "firmware", { unique: false });
       objectStore.createIndex("children", "children", { unique: false });
       objectStore.createIndex("credentials", "credentials", { unique: false });
       objectStore.createIndex("curCredentials", "curCredentials", { unique: false });
       objectStore.createIndex("enabled", "enabled", { unique: false });
       objectStore.createIndex("host", "host", { unique: false });
       objectStore.createIndex("httpsEnabled", "httpsEnabled", { unique: false });
       objectStore.createIndex("macAddr", "macAddr", { unique: false });
       objectStore.createIndex("parentId", "parentId", { unique: false });
       objectStore.createIndex("port", "port", { unique: false });
       objectStore.createIndex("providerId", "providerId", { unique: false });
       objectStore.createIndex("providerName", "providerName", { unique: false });
       objectStore.createIndex("serverType", "serverType", { unique: false });
       objectStore.createIndex("state", "state", { unique: false });
       objectStore.createIndex("version", "version", { unique: false });
       objectStore.createIndex("viewName", "viewName", { unique: false });

       objectStore.transaction.oncomplete = function (event) {
           var devicesObjStore = valDB.transaction('devices', 'readwrite')
               .objectStore('devices');

           for (var i = 0; i < devices.length; i++) {
               devicesObjStore.put(devices[i]);
               console.log(devices[i]);
           }

           var endIndexDb = new Date();

           var totalTime = endIndexDb - startIndexDb;
           console.log('Writing devices to indexedDB is completed. Total time: ' + totalTime + " ms");
       }

};