const Company = require("../model/Company");

let company1 = new Company(1, "Alfreds Futterkiste", "Maria Anders", "Germany");
let company2 = new Company(
  2,
  "Centro comercial Moctezuma",
  "Francisco Chang",
  "Mexico"
);
let company3 = new Company(3, "Ernst Handel", "Roland Mendel", "Autria");
let company4 = new Company(4, "Island Trading", "Helen Bennett", "UK");
let company5 = new Company(
  5,
  "Laughing Bacchus Winecellars",
  "Yoshi Tannamuri",
  "Cananda"
);
let company6 = new Company(
  6,
  "Magazzini Alimentari Riuniti",
  "Giovanni Rovelli",
  "Italy"
);

const data = [company1, company2, company3, company4, company5, company6];

module.exports = { data };
