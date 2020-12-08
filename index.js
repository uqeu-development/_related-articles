var convertCsvToJson = require("convert-csv-to-json")

let fileInput = "https://image.uniqlo.com/UQ/ST3/eu/imagesother/2020/dev/related-articles/related-articles.csv"

fetch('https://image.uniqlo.com/UQ/ST3/eu/imagesother/2020/dev/related-articles/related-articles.csv')
    .then(response => response.text())
    .then(data => {
        // Do something with your data
        console.log(data);
    });

let json = convertCsvToJson.getJsonFromCsv(fileInput);
for (let i = 0; i < json.length; i++) {
    console.log(json[i])
}