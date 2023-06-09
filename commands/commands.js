import chalk from "chalk";
import promptSync from "prompt-sync";
import { constantValues } from "../constants/consts.js";
import { shortcuts } from "../constants/shortcut.js";
import { listCategories } from "../api/category.js";
import { getJoke } from "../api/joke.js";
import * as fs from "fs";
import { finalData } from "../data/finalData.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const prompt = promptSync();

export const showAppTitle = () => {
    console.log("\n \n " + chalk.green(constantValues.title));
}

export const showWelcomeBanner = () => {
    console.log("\n \n" + chalk.bgGreen(constantValues.description) + "\n\n" + constantValues.jokeCategories + chalk.red(shortcuts.see_joke_categories) + "\n" + constantValues.exitProgram + chalk.red(shortcuts.exit_project) + "\n" + constantValues.viewJokesDatabase + chalk.red(shortcuts.view_jokes_database) + "\n" + constantValues.filterJokesByCategory + chalk.red(shortcuts.fliter_jokes) + "\n" + constantValues.askForHelp + chalk.red(shortcuts.ask_for_help) + "\n");
}

export const askName = () => {
    console.log(chalk.green("What is your name?"));
    let name = '';
    while (!name) {
        name = prompt(">>");
    }
    finalData.name = name;
    return name;
}

const userDetailsArray = [];
const storeData = () => {
    userDetailsArray.length = 0
    const checker = fs.existsSync(`${__dirname}/../files/${finalData.name}.json`)
    if (checker) {
        const content = fs.readFileSync(`${__dirname}/../files/${finalData.name}.json`, "utf-8")
        const parsedContent = JSON.parse(content);
        parsedContent.forEach(element => {
            userDetailsArray.push(element);
        });

        // userDetailsArray.push(content);
        userDetailsArray.push(finalData);
        fs.writeFileSync(`${__dirname}/../files/${finalData.name}.json`, JSON.stringify(userDetailsArray))

    } else {
        userDetailsArray.push(finalData);
        fs.writeFileSync(`${__dirname}/../files/${finalData.name}.json`, JSON.stringify(userDetailsArray));
    }

    console.log("\n" + "Your jokes are saved on " + chalk.blue(finalData.name) + chalk.blue(".json") + ". Please enter " + chalk.blue("view") + " to view the file.");
}

const readStoredData = () => {

    const storedData = fs.readFileSync(`${__dirname}/../files/${finalData.name}.json`, "utf-8");
    console.log(JSON.parse(storedData));
}

const filterJokes = () => {
    console.log(chalk.green("Enter a name to access the file saved on that name!"))
    const filterName = prompt(">>")
    const filterFileLocation = `${__dirname}/../files/${filterName}.json`;
    const filterFileExists = fs.existsSync(filterFileLocation);

    if (filterFileExists) {
        const filterReader = fs.readFileSync(filterFileLocation, "utf-8");
        const filterReaderArray = JSON.parse(filterReader);

        console.log(chalk.green(`Please enter a category within ${filterName}'s file.`))
        const filterCategory = prompt(">>");
        const categoryExists = filterReaderArray.some((singleEntry) => {
            return singleEntry.category == filterCategory ? true : false;
        })
        if (categoryExists) {
            const selectedCategory = filterReaderArray.filter((singleEntry) => {
                return singleEntry.category == filterCategory;
            })
            console.log("\n" + chalk.green(`Total jokes in ${filterCategory} category :`) + ` ${selectedCategory.length}`);
            console.log(selectedCategory);
        } else {
            console.log(chalk.red("Invalid category. Please try again!"))
        }
    } else {
        console.log(chalk.red(`There is no file saved on the name of ${filterName}. Please try again!!`))
    }


}


export const shortcutCommand = async () => {
    while (true) {
        const shortCommand = prompt(">");
        switch (shortCommand) {
            case "c":
                const category = await listCategories();
                if (category) {
                    await getJoke(category);
                    storeData();
                    break
                }
                break
            case "view":
                readStoredData();
                break
            case "filter":
                filterJokes();
                break
            case "help":
                showWelcomeBanner();
                break
            case "x":
                return
            default:
                showWelcomeBanner();
                break
        }

    }
}
export const createFileFolder = () => {
    const fileExistence = fs.existsSync(`${__dirname}/../files`, "utf-8");
    if (!fileExistence)
        fs.mkdirSync("files");
}
