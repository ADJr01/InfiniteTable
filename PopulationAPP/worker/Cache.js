const populationAPI =  function (){
    async function getCountryList(){
        const countryList = await fetch(`https://d6wn6bmjj722w.population.io/1.0/countries`)
        return await countryList.json();
    }

    async function getPopulationInYearOfAnyCountry(country='Bangladesh',year=2000){
        try{
            const population = await fetch(`https://d6wn6bmjj722w.population.io:443/1.0/population/${year}/${country}/`);
            const populationJson = await population.json();
            return await populationJson
        }catch (e) {
            console.error(e);
            return false
        }
    }

    return {
        countryList: getCountryList,
        populationOfCountryOnYear:getPopulationInYearOfAnyCountry
    }
}


// worker.js
let db;
const dbName = "populationTable";
const storeName = "API_CALLS";

// Initialize IndexedDB
const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function (event) {
    db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "url" });
};

request.onsuccess = function (event) {
    db = event.target.result;
    self.postMessage({ status: "ready" });
};

request.onerror = function (event) {
    console.error("IndexedDB error:", event.target.errorCode);
};

// Function to check cache
function checkCache(url, callback) {
    const transaction = db.transaction([storeName], "readonly");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(url);

    request.onsuccess = function (event) {
        if (request.result) {
            callback(request.result.response);
        } else {
            callback(false);
        }
    };

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.errorCode);
        callback(false);
    };
}

// Function to cache response
function cacheResponse(url, response) {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    objectStore.put({ url, response });
}



// Handling incoming messages
self.onmessage = function (e) {
    const { key,country,year } = e.data;
    checkCache(key, async function (cache) {
        if (cache) {
            self.postMessage({key, data: cache});
        } else {
            let data = null;
            if (key === 'countryList') {
                 data = await populationAPI().countryList();
            }else{
                 data = await populationAPI().populationOfCountryOnYear(country,year);
            }
            if(!data){
                self.postMessage({key, data:null});
                throw new Error('Could not find country data');
            }
            cacheResponse(key,data);
            self.postMessage({key, data});
        }
    });
};
