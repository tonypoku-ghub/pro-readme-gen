const inquirer = require("inquirer");
const fs = require("fs");
const api = require("./api");

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

// build README text to be written to file
async function build(
  title,
  describe,
  install,
  usage,
  license,
  contributing,
  tests,
  username,
  email
) {
  console.log("build called");

  let license_json = await api.getLicenseDetail(license);
  let license_description = license_json.description;
  let license_html_url = license_json.html_url;
  let license_key = license_json.key.replaceAll("-", "_");
  let license_label = "license";

  console.log("license_description", license_description);
  console.log("license_html_url", license_html_url);
  console.log("license_key", license_key);
  console.log("license_label", license_label);

  fs.readFile("readme_github_template.md", "utf8", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      let template = data;

      // convert string to backtick template
      let buildStr = eval("`" + template + "`");

      writeToFile("GEN_README.md", buildStr);
    }
  });
}

// write README file
function writeToFile(fileName, data) {
  fs.writeFileSync(fileName, data);
}

// initialize app
async function init() {
  // temporary answers object for testing
  // let answers = {
  //   title: "one",
  //   describe: "two",
  //   install: "three",
  //   usage: "four",
  //   license: "five",
  //   contributing: "six",
  //   tests: "seven",
  //   username: "eight",
  //   email: "nine",
  // };

  //fetch licenses from Github
  github_licenses = await api.listLicenses();

  //console.log("Questions:", getQuestions());

  let questions = getQuestions();

  // Gather input from user
  inquirer
    .prompt(questions)
    .then((answers) => {
      console.log("Answers", answers);

      build(
        answers.title,
        answers.describe,
        answers.install,
        answers.usage,
        answers.license,
        answers.contribute,
        answers.tests,
        answers.username,
        answers.email
      );
    })
    .catch((error) => {
      console.log(error);
    });

  // console.log(Array.isArray(github_licenses));
}

// Function call to initialize app
init();
