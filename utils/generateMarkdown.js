const fs = require("fs");
const { builtinModules } = require("module");
const api = require("../api");

// TODO: Create a function that returns a license badge based on which license is passed in
// If there is no license, return an empty string
function renderLicenseBadge(license, license_html_url) {
  return license
    ? `[![license](https://img.shields.io/badge/license-${license}-a2a429.svg)](${license_html_url})`
    : "";
}

// This function was not needed since a Github API is used to fetch the license link
//function renderLicenseLink(license) {}

// This function was not needed since a Github API is used to fetch the license link
//function renderLicenseSection(license) {}

// Function to generate markdown for README
async function generateMarkdown(data) {
  let markdown = await build(data);

  // console.log("Markdown-gen", markdown);

  return markdown;
}

async function build(answers) {
  let buildStr = "";

  let title = answers.title;
  let describe = answers.describe;
  let install = answers.install;
  let usage = answers.usage;
  let license = answers.license;
  let contributing = answers.contribute;
  let tests = answers.tests;
  let username = answers.username;
  let email = answers.email;

  console.log("build called");

  let license_json = await api.getLicenseDetail(license);

  //console.log("license_json", license_json);
  let license_description = license_json.description;
  let license_html_url = license_json.html_url;
  let license_key = license_json.key.replaceAll("-", "_");
  let license_badge = renderLicenseBadge(license_key, license_html_url);

  let template = fs.readFileSync("readme_github_template.md", {
    encoding: "utf8",
    flag: "r",
  });

  // convert string to backtick template
  buildStr = eval("`" + template + "`");

  return buildStr;
}

module.exports = { generateMarkdown };
