"use strict"

const apiKey = `faHkbRfTCXd5AvlkoAligiRfbRoGjUpWOZdpT6ZE`;
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

    for (let i = 0; i < responseJson.data.length; i++) {
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

      
      fetch(url, options)
       .then(response => {
           if(response.ok) {
               return response.json();
           } else {
               throw new Error(response.statusText);
           }
       })
       .then(responseJson => displayResults(responseJson, maxResults))
       .catch(err => {
           $("#error-message").text(`Something went wrong: ${err.message}`);
       });
  }

  function getInput() {
     $("#searchState").on("click", function(event) {
         event.preventDefault();
         $(".results-list").empty();

         const state = $("input#input-state").val();
         let maxResults = $("input#input-number").val();

         if (maxResults === "") {
            maxResults = 10;
         } 

         if (state === "") {
             return alert("You must list a state")
         }

         if (state.length > 2) {
             return alert("Please use state abbreviation");
         }

         getParkInfo(state, maxResults);
     }) 
  }

  $(getInput);