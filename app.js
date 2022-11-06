const moviesContainer = document.querySelector(".content");
const searchBar = document.querySelector(".search-bar");
let currentPage;

async function getMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1`
  );
  const data = await response.json();
  const movies = data.results;
  const imgPath = "https://image.tmdb.org/t/p/w1280";

  movies.forEach((movie) => {
    addMovieToBody(movie, imgPath);
  });

  pagination(data);
}
async function getMoviesSpecialPage() {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1${currentPage}`
  );
  const data = await response.json();
  const movies = data.results;
  const imgPath = "https://image.tmdb.org/t/p/w1280";

  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    addMovieToBody(movie, imgPath);
  });
}
async function getMoviesBySearch() {
  const searchValue = await searchBar.value;
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="${searchValue}"`
  );
  const data = await response.json();
  const movies = data.results;
  const imgPath = "https://image.tmdb.org/t/p/w1280";
  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    addMovieToBody(movie, imgPath);
  });
}

searchBar.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    getMoviesBySearch();
  }
});

function addMovieToBody(movie, imgPath) {
  let { title, poster_path, overview, vote_average } = movie;
  let imgSrc = `${imgPath}${poster_path}`;

  if (!poster_path) {
    imgSrc = `${"https://images.pexels.com/photos/3747159/pexels-photo-3747159.jpeg"}`;
  }

  let film = `
        <div class="movie">
            <div class="movie-cover">
                <img src="${imgSrc}" alt="">
            </div>
            <div class="movie-rate">
                <p class="movie-title">${title}</p>
                <p class="rate">${vote_average}</p>
            </div>
            <div class="movie-overview">
                <h3>Overview</h3>
                <p class="overview">${overview}</p>
            </div>
        </div>
    `;
  moviesContainer.innerHTML += film;
}

// pagination

function pagination(data) {
  let previous = document.querySelector(".pagination .prevBtn");
  let next = document.querySelector(".pagination .nextBtn");
  let pages = document.querySelector(".pages");

  // add pages in pagination section
  let totalPages = data.total_pages;
  let totalResults = data.total_results;
  let totalOfPages = Math.floor(totalResults / totalPages);
  for (let i = 1; i < totalOfPages; i++) {
    let page = `<span class="page-number" data-number="${i}">${i}</span>`;
    pages.innerHTML += page;
  }

  // change current page by clicking in next and prev buttons
  let paginationPages = [...pages.children];
  currentPage = 1;
  paginationPages[currentPage - 1].classList.add("current");

  next.addEventListener("click", () => {
    currentPage++;
    changeCurrentPage();
    disableButtons();
    getMoviesSpecialPage();
  });

  previous.addEventListener("click", () => {
    currentPage--;
    changeCurrentPage();
    disableButtons();
    getMoviesSpecialPage();
  });

  // change currentPage when click in the page number
  function clickInThePagenumber() {
    paginationPages.forEach((page) => {
      page.addEventListener("click", () => {
        currentPage = +page.dataset.number;
        changeCurrentPage();
        disableButtons();
        getMoviesSpecialPage(currentPage);
      });
    });
  }
  clickInThePagenumber();

  // functions
  function changeCurrentPage() {
    paginationPages.forEach((page) => {
      page.classList.remove("current");
    });
    paginationPages[currentPage - 1].classList.add("current");
  }
  function disableButtons() {
    if (currentPage === 1) {
      previous.classList.add("disable");
    } else if (currentPage === paginationPages.length) {
      next.classList.add("disable");
    } else {
      next.classList.remove("disable");
      previous.classList.remove("disable");
    }
  }
}

getMovies();
