const fs = require("fs");
console.time("ParseData");
console.time("Total");

var zipCounty = JSON.parse(fs.readFileSync("zipCounty.json"));
var gunData = JSON.parse(fs.readFileSync("gunData.json"));
var cityCounty = JSON.parse(fs.readFileSync("cityCounty.json"));
var electionData = JSON.parse(fs.readFileSync("countyElection.json")).filter(
  function (result) {
    return result.total_votes20 != "";
  }
);
var zipMoney = JSON.parse(fs.readFileSync("zipMoney.json")).filter(function (
  result
) {
  return result.TotalWages != "" && result.EstimatedPopulation != "";
});
console.timeEnd("ParseData");
console.log("loaded data");

/**
 * Creates a JSON array with all the fips codes and no duplicates
 * @returns [array]
 */
function createListofFIPS() {
  let allFips = [];
  for (let i = 0; i < zipCounty.length; i++) {
    const element = zipCounty[i];
    allFips.push(element.STCOUNTYFP);
  }
  let listofFips = [...new Set(allFips)];
  return listofFips;
}

/**
 * Given a city and a state this function returns with the FIPS code of the county that that city is in.
 * @param {*} city
 * @param {*} statename
 * @returns
 */
function cityToCountyCode(city, statename) {
  let cityLookup = cityCounty;
  let fipsLookup = zipCounty;
  let fips;
  let found = [];

  if (statename.length == 2) {
    found = cityLookup.filter(function (result) {
      return result.STATE_CODE == statename && result.CITY == city;
    });
  } else {
    found = cityLookup.filter(function (result) {
      return result.STATE_NAME == statename && result.CITY == city;
    });
  }
  if (found.length > 0) {
    let county = found[0].COUNTY + " County";
    let state = found[0].STATE_CODE;
    fips = fipsLookup.filter(function (result) {
      return result.COUNTYNAME == county && result.STATE == state;
    });
    if (fips.length > 0) {
      return fips[0].STCOUNTYFP;
    }
  }
  return null;
}

function addFipsToGunData(gundata) {
  let data = gundata;
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    element.FIPS = cityToCountyCode(element.city_or_county, element.state);
  }
  return data;
}

function addFipsToElection(election, counties) {
  let unmatched = 0;
  let foundMatch = 0;

  for (let i = 0; i < election.length; i++) {
    const element = election[i];
    let fips = null;
    let countyName = element.county + " County";
    let found = counties.filter(function (result) {
      return (
        result.COUNTYNAME.includes(element.county) &&
        result.STATE == element.state
      );
    });
    if (found.length == 0) {
      unmatched++;
      fips = cityToCountyCode(element.county, element.state);
      if (!null) {
        foundMatch++;
      }
    } else {
      fips = found[0].STCOUNTYFP;
    }
    element.FIPS = fips;
  }
  console.log("number of unmatched counties: " + unmatched);
  let percent = (unmatched / election.length) * 100;
  console.log(
    percent + "% of unmatched counties: " + unmatched + "/" + election.length
  );
  console.log(
    "Found Match for: " + foundMatch + " counties that were actually cities"
  );

  return election;
}

function addFipsToMoney(money, counties) {
  let unmatched = 0;
  for (let i = 0; i < money.length; i++) {
    let element = money[i];
    let zipcode = element.Zipcode;
    let fips = counties.filter((x) => x.ZIP == zipcode);

    try {
      element.FIPS = fips[0].STCOUNTYFP;
    } catch (error) {
      element.FIPS = zipcode;
      unmatched++;
    }

    element.avgWage =
      Number(element.TotalWages) / Number(element.EstimatedPopulation);
  }
  console.log("number of unmatched zipcodes: " + unmatched);
  let percent = (unmatched / money.length) * 100;
  console.log(
    percent +
      "% percent of zipcodes did not match." +
      unmatched +
      "/" +
      money.length
  );

  return money;
}
/**
 * returns the average value of a key in the array
 * @param {[JSON]} array
 * @param {String} key
 * @returns
 */
function calculateAverageValue(array, key) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    total += Number(element[key]);
  }
  if (total == 0 || total == null) {
    console.debug(total);
  }
  return total / array.length;
}

function getAverageWage(fipscode, money) {
  let found = money.filter((wage) => wage.FIPS == fipscode);
  let avgWage = calculateAverageValue(found, "avgWage");
  return avgWage;
}

function getPopulation(fipscode, election) {
  let pop = null;
  let found = election.filter((Population) => Population.FIPS == fipscode);
  if (found.length == 1) {
    pop = found[0].TotalPop;
  }
  return pop;
}

function getVotePercent(fipscode, election) {
  let votePercent = null;
  let found = election.filter((Population) => Population.FIPS == fipscode);
  if (found.length == 1) {
    votePercent = found[0].percentage20_Joe_Biden;
  }
  return votePercent;
}

function getGunIncidents(fips, gundatawithfips) {
  let found = gundatawithfips.filter((incident) => incident.FIPS == fips);
  return found.length;
}

function createEndArray(fipsdata, moneydata, electiondata, gundata) {
  let endProduct = [];
  for (let i = 0; i < fipsdata.length; i++) {
    const fips = fipsdata[i];
    const avgWage = getAverageWage(fips, moneydata);
    const pop = getPopulation(fips, electiondata);
    const votePercent = getVotePercent(fips, electiondata);
    const gunEvents = getGunIncidents(fips, gundata);

    endProduct[i] = {
      FIPS: fips,
      gunEvents: gunEvents,
      population: pop,
      percentVotedBiden: votePercent,
      averageWage: avgWage,
    };
  }
  return endProduct;
}

function makeEndProduct() {
  console.time("computeFips");
  let listofFips = createListofFIPS();
  console.log("FipsList Created");
  let moneyFipsied = addFipsToMoney(zipMoney, zipCounty);
  console.log("Money Fips Created");
  let electionFipsied = addFipsToElection(electionData, zipCounty);
  console.log("Election Fips Created");
  let gunFipsied = addFipsToGunData(gunData);
  console.log("Gun Fips Created");
  console.log("FipsComputed");
  console.timeEnd("computeFips");

  console.time("endProduct");
  let end = createEndArray(
    listofFips,
    moneyFipsied,
    electionFipsied,
    gunFipsied
  );
  console.timeEnd("endProduct");
  console.log("endProduct Created");
  console.log("Writing to file....");
  fs.writeFileSync("endProduct.json", JSON.stringify(end));
  console.log("DONE!!");
  console.timeEnd("Total");
}

makeEndProduct();
