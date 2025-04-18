import fs from "fs";
import path from "path";
import readline from "readline";
import chalk from "chalk";


// chalk Instance
let brownChalk = chalk.hex("#e17055");
let orangeChalk = chalk.hex("#e67e22");



// Global Varaibles
let isWindow = true;
let isMac = false;
const dirname = import.meta.dirname;




// cli setup
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});



// Create File
function createFile(dirname, file){
    fs.writeFile(path.join(dirname, file), `File is created by cli`, "utf-8", (err) => {
        if(err) {
            console.log(chalk.red("While creating file: "), err.message);
            return def_Fun_Run();
        }
        console.log(chalk.bold.bgGreen("-- Successfully Created --"));
        def_Fun_Run();
    });
}   

// Read File
function readFile() {
    terminal.question(chalk.blue(`Enter File Path: (eg: ${chalk.yellow("(file.txt)")} or ${chalk.yellow("(folder/file.txt)")}) `), (filePath) => {
        let fullPath = path.join(dirname, filePath);
        
        fs.readFile(fullPath, "utf-8", (err, fileContent) => {
            if(err) {
                 console.log(chalk.red("Error Reading File: ", err.message));
                 return def_Fun_Run();
            }
            console.log(brownChalk(fileContent));
            def_Fun_Run();
        });
    });
}


// updateFile
function updateFile(){
    terminal.question(chalk.blue(`Enter File Path: (eg: ${chalk.yellow("(file.txt)")} or ${chalk.yellow("(folder/file.txt)")}) `), (filePath) => {
        let selectedPath = path.join(dirname,filePath);
        fs.readFile(selectedPath, "utf-8", (err, fileContent) => {
            if(err) return console.log(chalk.red("Error Reading File: ", err.message));
            terminal.question(chalk.blue("Add Content: "), (content) => {
                fs.writeFile(selectedPath, `${content}`, "utf-8", (err) => {
                    if(err) {
                        console.log(chalk.red("Error Updating File: ", err.message));
                        return def_Fun_Run();
                    }
                    console.log(chalk.bold.bgGreen("-- Successfuly Updated --"));
                    def_Fun_Run();
                })
            });
        }) 
    });
};


// deleteFile
function deleteFile(){
    terminal.question(orangeChalk("Enter File Path To Delete: "), (filePath) => {
        if(filePath === "./app.js" || "app.js"){
            console.log(chalk.red("Sorry, Can't Delete The Main File !"));
            def_Fun_Run();
        }else {
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(chalk.red("Error Deleting File"), err.message);
                    return def_Fun_Run();
                }  
                console.log(chalk.bold.bgGreen("-- Successfully Deleted --"));
                def_Fun_Run();
            });
        }
    });
};






const mainHandler = (option) => {
    if(option === "1" || option === "create"){
        terminal.question(chalk.blue(`Enter File Name: (eg: ${chalk.yellow("(file.txt)")} or ${chalk.yellow("(folder/file.txt)")}) `), (fileName) => {
            let filePath = fileName.split("");
            if(!filePath.includes(".")){
                console.log(chalk.red("Add . (eg: file.txt)"));
                defaultMain();
                return;
            }
            if(filePath[0] === ".") filePath.shift();
            if(filePath[0] === "/" || filePath[0] === "\\") filePath.shift();
            let folderPathLastIndex = filePath.lastIndexOf("/");
            let folder = filePath.join("").substring(0, folderPathLastIndex);
            let file = filePath.join("").substring(folderPathLastIndex+1)
            if(isWindow) folder.replaceAll("/","\\");
            if(isMac) folder.replaceAll("\\","/");
            if(filePath.includes("/") || filePath.includes("\\")){
                let customPath = path.join(dirname, folder);
                fs.mkdir(customPath, { recursive: true }, (err) => {
                    if(err) console.log(chalk.red("While creating file: "), err.message);
                    createFile(customPath, file);
                });
                return;
            }
            createFile(dirname, file);
        });
    }
    else if(option === "2" || option === "read"){
        readFile()
    }
    else if(option === "3" || option === "update"){
        updateFile()
    }
    else if(option === "4" || option === "delete"){
        deleteFile();
    }
    else if(option === "5" || option === "exit"){
        console.log(chalk.yellow("You Are Free Now !"));
        terminal.close();
    }
    else{
        console.log(chalk.red("Invaild Option !"));
        def_Fun_Run();
    }
};








// default function
function defaultMain(){
    console.log(chalk.yellow.bold("\nWelcome To File CRUD App\n"));
    console.log(`1) Create File: ${chalk.blue("(create)")}`);
    console.log(`2) Read File: ${chalk.blue("(read)")}`);
    console.log(`3) Update File: ${chalk.blue("(update)")}`);
    console.log(`4) Delete File: ${chalk.blue("(delete)")}`);
    console.log(`5) exit from app ${chalk.blue("(exit)")}`);
    console.log("\n");
    // handler
    terminal.question("Enter Given Option: ", mainHandler)
};
defaultMain();


// after 1s run default fun
function def_Fun_Run(){
    setTimeout(() => defaultMain(),1000);
}