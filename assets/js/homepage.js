/* Created by Anthony Hall */
/* Updated on March 27, 2023 */

var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");

// This is the value to update.
var repoSearchTerm = document.querySelector("#repo-search-term");
var subTitleTextEl = document.querySelector(".subtitle");

var languageButtonsEl = document.querySelector("#language-buttons");

// repoSearchTerm.textContent = "";
// subTitleTextEl.textContent = "";

var formSubmitHandler = function(event) {
    event.preventDefault();
    // get value from input element
    var username = nameInputEl.value.trim();
    // repoSearchTerm.textContent = "Searching...";
    // subTitleTextEl.textContent = "Searching..."

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    }
};

var displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    // clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    // loop over repos
    for (var i = 0; i < repos.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;
    
        // create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    
        // create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;
    
        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);
    
        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// Get repos by language
var getFeaturedRepos = function(language) {
    // Construct the API URL var
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";
    
    console.log(apiUrl);
    console.log(language);
    
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: GitHub user not found.');
        }
    });
};

// Get All the Repos By Users
var getUserRepos = function(user) {

    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
     
    // make a request to the url
    fetch(apiUrl)
        .then(function(response) {
            // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub user not found.");
            };
        })
        .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to GitHub");
        });
};

var buttonClickHandler = function(event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);
    if (language) {
        getFeaturedRepos(language);
      
        // clear old content
        repoContainerEl.textContent = "";
      }
};


userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);