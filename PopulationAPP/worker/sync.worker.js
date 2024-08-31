const cacheWorker = new Worker('/PopulationAPP/worker/Cache.js');
function waitForCacheToBeReady(worker) {
    return new Promise((resolve,reject) => {
        worker.onmessage = function (e) {
            if (e.data.status === "ready") {
                resolve(true);
            }
            resolve(false);
        };
    });
}
function keyWiseValue(key,data){
    const keyArray = key.split('_');
    if(keyArray.length !==2)throw new Error('Failed to build user data')
    const country_name = keyArray[0];
    const year = keyArray[1];
    return {country:country_name,year}
}

class PopulationRecord{
    CONTINENTS_WITH_COUNTRIES = {
        Africa: [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
            "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
            "Congo", "Democratic Republic of the Congo", "Djibouti", "Egypt",
            "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon",
            "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya",
            "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali",
            "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
            "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles",
            "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan",
            "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
        ],
        Asia: [
            "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan",
            "Brunei", "Cambodia", "China", "Cyprus", "Georgia", "India", "Indonesia",
            "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait",
            "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia",
            "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan", "Palestine",
            "Philippines", "Qatar", "Russia", "Saudi Arabia", "Singapore", "South Korea",
            "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor-Leste",
            "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"
        ],
        Europe: [
            "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus",
            "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus",
            "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia",
            "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kazakhstan",
            "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
            "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway",
            "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia",
            "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City"
        ],
        North_America: [
            "Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Canada",
            "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "El Salvador",
            "Grenada", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico",
            "Nicaragua", "Panama", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
            "Trinidad and Tobago", "United States"
        ],
        South_America: [
            "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador",
            "Guyana", "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"
        ],
        Oceania: [
            "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia",
            "Nauru", "New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands",
            "Tonga", "Tuvalu", "Vanuatu"
        ],
        Antarctica: [] // No countries, only territories or scientific stations.
    };
    CONTINENT_LIST = Object.keys(this.CONTINENTS_WITH_COUNTRIES)
    constructor(startYear,endYear){
        this.totalEventFired = 0;
        if(endYear<startYear)throw new Error('Range Error');
        this.ContinetalData = {};
        this.StartYear = startYear;
        this.EndYear = endYear;
        this.YEARLY_TOTAL_OF_CONTINENTS = {}
        waitForCacheToBeReady(cacheWorker).then(resolve=>{
            cacheWorker.postMessage( {key:'countryList'})
            this.totalEventFired+=1;
            cacheWorker.onmessage= e=>{
                try{
                    this.totalEventFired-=1;
                    if(e.data.key==='countryList'){
                        const {countries} = e.data.data;
                        this.CONTINENT_LIST.forEach(continent=>{
                            this.ContinetalData[continent] = {};
                        })
                        this.CONTINENT_LIST.forEach(continent=>{
                            this.ContinetalData[continent] = {};
                        })
                        countries.forEach(country => {
                            for (let i = 0; i < this.CONTINENT_LIST.length; i++) {
                                const continent = this.CONTINENT_LIST[i];
                                if(this.CONTINENTS_WITH_COUNTRIES[continent].includes(country)){
                                    this.ContinetalData[continent][country]={};
                                    break;
                                }
                            }
                            for (let j = this.StartYear; j <=this.EndYear; j++) {
                                cacheWorker.postMessage( {key:`${country}_${j}`,country,year:j})
                                this.totalEventFired+=1;
                            }
                        });

                    }else{
                        //getting other key values;
                        const key = e.data.key;
                        const data = e.data.data;
                        if(!data)return
                        const {country,year} = keyWiseValue(key)
                        for (let i = 0; i < this.CONTINENT_LIST.length; i++) {
                            const continent = this.CONTINENT_LIST[i];
                            let continentTotal = 0;
                            if(this.CONTINENTS_WITH_COUNTRIES[continent].includes(country)){
                                const dataOfTheYear = {}
                                dataOfTheYear.total = data.reduce((accumulator, current) => accumulator + current.total, 0);
                                dataOfTheYear.year=year;
                                dataOfTheYear.data = data;
                                this.ContinetalData[continent][country][year]=dataOfTheYear;
                                continentTotal+=Number(dataOfTheYear.total);
                                this.setYearlyTotal(continent,year,continentTotal);
                                break;
                            }
                        }

                        if(this.totalEventFired===0){
                            postMessage({status: true,type:'complete', recordClass: populationRecord});
                        }
                    }

                }catch (e) {
                    console.error('error: ',e)
                }
            }
        })
    }

    setYearlyTotal(continentName,year,total){
         if(!this.YEARLY_TOTAL_OF_CONTINENTS[continentName])this.YEARLY_TOTAL_OF_CONTINENTS[continentName]={}
         if(!this.YEARLY_TOTAL_OF_CONTINENTS[continentName][year])this.YEARLY_TOTAL_OF_CONTINENTS[continentName][year]=0;
        this.YEARLY_TOTAL_OF_CONTINENTS[continentName][year]+=total;
    }

    get CONTINENTS(){
            return this.CONTINENT_LIST;
    }



}
let populationRecord =null;
self.onmessage = async e => {
    const {command,range} = e.data
    !populationRecord && (populationRecord= new PopulationRecord(range.start, range.end))
    if (!command) throw new Error("Command not found.Worker Exit");
    if (command === "init") {
        postMessage({status: true,type:'init', recordClass: populationRecord});
    }else if(command==="update"){
        postMessage({status: true,type:'update', recordClass: populationRecord});
    }
};