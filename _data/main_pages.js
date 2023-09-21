

module.exports = async function () {

  // return [
  //   { "name": "Bulbasaur" },
  //   { "name": "Ivysaur" },
  //   { "name": "Venusaur" }
  // ]
    // TODO change it to strapi server
  const result = await fetch('https://e2260277-21dc-41fe-8c3d-55637e7b4fb4.mock.pstmn.io/pages');
  return (await result.json());
};