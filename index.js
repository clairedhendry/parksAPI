"use strict"

const apiKey = ``;
const searchURL = `https://developer.nps.gov/api/v1/parks`;

const options = {
    headers: new Headers({
      "Accept": `application/json`})
  };


function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }


function displayResults(responseJson) {
    $(".results-list").empty();

    console.log(responseJson);

    for (let i = 0; responseJson.data.length; i++) {
        $(".results-list").append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].description}</p>
            <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
            </li>`
        )
    };

    $(".results-list").removeClass("hidden");

};


function getParkInfo(state, maxResults) {

    const queryField = `fullName%2C%20description%2C%20url`;

      const params = {
        stateCode: state,
        limit: maxResults,
        fields: queryField,
        api_key: apiKey,
      }

      const queryString = formatQueryParams(params);
      const url = searchURL + `?` + queryString;

      console.log(url);

      fetch(url, options)
       .then(response => {
           if(response.ok) {
               return response.json();
           } throw new Error(response.statusText);
       })
       .then(responseJson => displayResults(responseJson))
       .catch(err => {
           $("#error-message").text(`Something went wrong: ${err.message}`);
       });
  }

  function getInput() {
     $("#searchState").on("click", function(event) {
         event.preventDefault();
         const state = $("input#input-state").val();
         const maxResults = $("input#input-number").val();

         if(maxResults === "") {
             alert("You must set a number")
         }

         getParkInfo(state, maxResults);
     }) 
  }

  $(getInput);