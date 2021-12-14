# Stats Final Project Code

Hello, this is the code for my final project.

In order to run this code you probably should download it and run it that way.

Required Python Packages: `Pandas,statsmodels,and MatPlotLib`

Required Node Packages: `fast-csv`

## Data Sources

- County FIPS ZIPCODE Crosswalk [kaggle](https://www.kaggle.com/danofer/zipcodes-county-fips-crosswalk)
- Wages Per ZIPCODE [kaggle](https://www.kaggle.com/pavansanagapati/us-wages-via-zipcode)
- Election Data [kaggle](https://www.kaggle.com/etsc9287/2020-general-election-polls)
- Gun Violence Data [kaggle](https://www.kaggle.com/jameslko/gun-violence-data)
- US Cities Data [GITHUB](https://github.com/kelvins/US-Cities-Database)

## Running

This is a largely manual effort unfortunately. You must use `finalParser.js` to parse all of the csv files into JSON data. Then make sure your json files are labled properly so `index.js` will be able to find them. Then you can run `index.js`. On my computer this task took about 5 minutes but it can take longer than that because this code is not optimized nor can it take advantage of multi-threading.

After running `index.js` you can now run `parseReverse.js` in order to convert that data back into csv.

**FINALLY** you can now run `final.py` and see all your pretty data in plots and also look at the console output for some regression things and ANOVA things.

## a note

I could have made this into just two files and made it super simple to run and only a single command to run it but that is not something I did. I also probably could have done it all in node.js if there was a good statistics package for node.js.

Thats all there is for these notes about the technical side of the code.
