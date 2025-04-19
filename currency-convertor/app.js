import https from "https";
import readline from "readline";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();


// chalk Colors
let greenClr = chalk.bold.green;
let blueClr = chalk.blue;
let yellowClr = chalk.yellow;
let redClr = chalk.bold.red;


// Readline Interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const API_KEY = process.env.EXCHANGE_RATE_API;
let BASED_CURRENCY = "USD";
let apiPath = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASED_CURRENCY}`;







const check_currency_convertor = (apiPath) => {

    console.log(greenClr("\n=== Welcom To Currency Exchange ===\n"));
    

    https.get(apiPath,(res) => {
        // Data
        let data = "";
        res.on("data", (chunk) => data += chunk );

        // End
        res.on("end", () => {
            let ExchangeRate = JSON.parse(data).conversion_rates;
            let ExchangeRate_keys = Object.keys(ExchangeRate);
            console.dir(ExchangeRate_keys.sort(),  { maxArrayLength: null });
            rl.question(blueClr("Enter Based Code by given option: "), (baseCode) => {
                if(ExchangeRate_keys.includes(baseCode.toUpperCase())){
                    actual_currency_convertor(baseCode.toUpperCase());
                }else {
                    console.log(redClr("Invaild Base Code"));
                }
            });
            
        });

        // Error
        res.on("error", (err) => console.log(redClr("Error Fetching API: "), err.message) );
    });
};
check_currency_convertor(apiPath);








const actual_currency_convertor = (baseCode) => {
    BASED_CURRENCY = baseCode;
    apiPath = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASED_CURRENCY}`;

    https.get(apiPath, (res) => {
        // Data
        let data = "";
        res.on("data", (chunk) => data += chunk );

        // End
        res.on("end", () => {
            let ExchangeRate = JSON.parse(data).conversion_rates;
            let ExchangeRate_keys = Object.keys(ExchangeRate);
            rl.question(blueClr(`Enter ${yellowClr(BASED_CURRENCY)} amount: `), (amount) => {
                rl.question(blueClr("Enter Converting Country Code: "), (C_BaseCode) => {
                    let convertBaseCode = C_BaseCode.toUpperCase();
                    if(ExchangeRate_keys.includes(baseCode.toUpperCase())){
                        console.log(greenClr(`\n${yellowClr(amount)} ${BASED_CURRENCY} is around ${yellowClr((amount * ExchangeRate[convertBaseCode]).toFixed(2))} ${convertBaseCode}`));
                        rl.close();
                    }else{
                        console.log(redClr("Invaild Base Code"));
                    }
                })
            });
        });

        // Error
        res.on("error", (err) => console.log(redClr("Error Fetching API: "), err.message) );
    });
    
}
