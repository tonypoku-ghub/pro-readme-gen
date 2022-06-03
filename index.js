const inquirer = require("inquirer");
const fs = require("fs");
const api = require("./api");
const utils = require("./utils/generateMarkdown");

// Licenses imported from github api
let github_licenses;

// Questions for user input
function getQuestions() {
  const questions = [
    { type: "input", message: "Project title", name: "title" },
    {
      type: "input",
      message: "Describe your project",
      name: "describe",
    },
    {
      type: "input",
      message: "Install instructions",
      name: "install",
    },
    { type: "input", message: "Usage instruction", name: "usage" },
    { type: "input", message: "Contributing Guidelines", name: "contribute" },
    { type: "input", message: "Test Instruction", name: "tests" },
    {
      type: "list",
      message: "Which license ",
      name: "license",
      choices: parseChoices(),
    },
    { type: "input", message: "Github user name", name: "username" },
    { type: "input", message: "Your email", name: "email" },
  ];

  return questions;
}

// generate an array of choices (object)
function parseChoices() {
  // console.log("parseChoices", Array.isArray(github_licenses));
  // console.log("parseChoices", github_licenses);

  return github_licenses.map((lic) => {
    return { name: lic.name, value: lic.key, short: lic.name };
  });
}

// write README file
function writeToFile(fileName, data) {
  fs.writeFileSync(fileName, data);
}

// initialize app
async function init() {
  //fetch licenses from Github
  github_licenses = await api.listLicenses();

  //console.log("Questions:", getQuestions());

  let questions = getQuestions();

  // Gather input from user
  let answers = await inquirer.prompt(questions);
  console.log("Answers", answers);

  let markdown = await utils.generateMarkdown(answers);

  console.log("Markdown", markdown);

  // console.log("buildStr", buildStr);
  writeToFile("GEN_README.md", markdown);
}

// Function call to initialize app
init();
