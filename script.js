// Global Variables and Constants

const API_KEY = "feebf384a3764e132262b11f0d47a079";

const API_URL = "https://api.themoviedb.org/3/discover/movie?api_key=feebf384a3764e132262b11f0d47a079";

const SEARCH_URL = "https://api.themoviedb.org/3/search/movie?api_key=feebf384a3764e132262b11f0d47a079";

const DISCOVER_URL = "https://api.themoviedb.org/3/discover/movie?api_key=feebf384a3764e132262b11f0d47a079";

const BASE_URL = "https://api.themoviedb.org/3";

let pageNumber = 1;  // Keeps track of the current page number for paginated requests.
let totalPages = 0;  // The total number of pages available from the API.

const inputText = document.getElementById("input");
const showButton = document.getElementById("showButton");
const movieContainer = document.getElementById("movies");


// Fetch and display movies
async function fetchMovies(url) {
    try {
        const response = await fetch(`${url}&page=${pageNumber}`);  // Append the current page number to the API request.
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);  // Throw an error if something goes wrong.
        }
        const data = await response.json();  // Parse the response data as JSON.
        totalPages = data.total_pages;   // Set the total number of pages from the response.
        fetchPoster(data);

        if (pageNumber < totalPages) {
            showButton.style.display = "block";
        } else {
            showButton.style.display = "none";
        }
    } catch (error) {
        console.error(error.message);
    }
}


// Display movie posters and information
async function fetchPoster(data) {
    movieContainer.innerHTML = ""; // Clear existing movies for search or new pages

     // Handle the case where no movies are found:
    if(data.results.length === 0){
        const notFoundMovie = document.createElement("div");
        notFoundMovie.classList.add("no-movies"); // Add a class for styling.
        notFoundMovie.textContent = "NO movies found. Try Different Search";

        const homeButton = document.createElement("button");
        homeButton.textContent = "Home";
        homeButton.classList.add("home-button");

        homeButton.addEventListener("click", () => {
            window.location.href = "index.html";  // Redirect to the home page.
        });

        notFoundMovie.appendChild(homeButton);  // Append the "Home" button to the message.
        movieContainer.appendChild(notFoundMovie); // Append the message to the movie container

        setTimeout(() => {
            notFoundMovie.classList.add("show");   // Add a class to show the message with animation.
        }, 100);
    }

     // Get the first 10 movies to display:
    const moviesToDisplay = data.results.slice(0, 10);

    moviesToDisplay.forEach((movie) => {
        const posterPath = movie.poster_path;     // Get the movie poster path.

        if (posterPath) {
            const posterUrl = `https://image.tmdb.org/t/p/w500${posterPath}`; // Full URL for the poster image.
            const moviesDiv = document.createElement("div");
            moviesDiv.classList.add("movie");

            // Create a container for the title and rating:
            const titleAndRating = document.createElement("div");
            titleAndRating.classList.add("info");

            const title = document.createElement("h5");
            title.textContent = movie.title;

            const ratingDiv = document.createElement("h4");
            ratingDiv.textContent = `⭐: ${movie.vote_average}`;

            titleAndRating.appendChild(title);
            titleAndRating.appendChild(ratingDiv);

            // Create an img element for the poster.
            const imgDiv = document.createElement("img");
            imgDiv.src = posterUrl;
            imgDiv.alt = movie.title;


            const overlayDiv = document.createElement("div");
            overlayDiv.classList.add("overlay");

            const overviewDiv = document.createElement("p");
            overviewDiv.textContent = movie.overview;

            overlayDiv.appendChild(overviewDiv);
            moviesDiv.appendChild(imgDiv);
            moviesDiv.appendChild(titleAndRating);
            moviesDiv.appendChild(overlayDiv);

             // Add hover events to show/hide the overlay:
            moviesDiv.addEventListener("mouseenter", () => {
                overlayDiv.classList.add("show");
            });

            moviesDiv.addEventListener("mouseleave", () => {
                overlayDiv.classList.remove("show");
            });


             // Add a click event to open the movie details page:
            const movieUrl = `https://www.themoviedb.org/movie/${movie.id}`;
            moviesDiv.addEventListener("click", () => {
                window.open(movieUrl, "_blank"); // Open in a new tab.
            });
            movieContainer.appendChild(moviesDiv);
        }
    });
}

// Handle search functionality
async function searchMovie(query) {
    if (!query.trim()) {  // Check if the query is empty or only whitespace.
        alert("Enter a movie name!");
        return;
    }

    pageNumber = 1; // Reset page number for new search
    const searchUrl = `${SEARCH_URL}&query=${encodeURIComponent(query)}`;  // Build the search URL with the query.
    await fetchMovies(searchUrl);
}

// Add event listeners
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    const query = inputText.value;   // Get the user's input.
    searchMovie(query);
});

document.getElementById("showButton").addEventListener("click", () => {
    pageNumber++;  // Increment the page number to fetch the next set of movies.
    fetchMovies(`${DISCOVER_URL}`);   // Fetch the next page of movies.
});

// Initial load
fetchMovies(DISCOVER_URL); // Load the default discover movies.

// This is done because DISCOVER_URL more accurately reflects the purpose of the request.
// DISCOVER_URL indicates that this call is fetching movies for the initial page load (discovering trending or popular movies).
// Using a variable name like API_URL could be misleading because the term "API" is generic and does not specify which part of the API it is interacting with. In contrast, DISCOVER_URL clearly defines that this URL pertains to the "discover" endpoint.