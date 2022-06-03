const fetch = require("node-fetch");

async function listLicenses() {
  const res = await fetch("https://api.github.com/licenses");
  //.then((res) => res.text())
  // .then((text) => console.log(text));

  const json = await res.json();

  return json;
}

async function getLicenseDetail(license) {
  const res = await fetch(`https://api.github.com/licenses/${license}`);
  //.then((res) => res.text())
  // .then((text) => console.log(text));

  const json = await res.json();

  //console.log("License Detail:", json);

  return json;
}
//listLicenses().then((json) => console.log(json));
module.exports = { listLicenses, getLicenseDetail };
