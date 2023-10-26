let session = sessionStorage.getItem("id");

//
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWZhODY1OGNhZTc4NmE4ZDg2YjAzOWRjMjczMGJhZSIsInN1YiI6IjY1MzIzYzNmOGQyMmZjMDEwYjcxY2UwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ERsC-Mk8MWMzc_0lRgOFwD3wXKoyHrTqeUSGRAbx8bs"
  }
};

let testUl = document.querySelector(".testUl");
let testimg = document.querySelector(".testUl > li > img");

let result = "";
fetch(`https://api.themoviedb.org/3/movie/${Number(session)}?language=ko-US`, options)
  .then((response) => response.json())
  .then((response) => {
    const {
      id,
      poster_path,
      title,
      overview,
      vote_average,
      original_language,
      original_title,
      runtime,
      release_date,
      production_countries: [{ name: country }]
    } = response;
    let appendHtml = `
      <div class="media-detail-wrap">
      <img class="media-detail-img" src="https://image.tmdb.org/t/p/w500${poster_path}" data-id="${id}" alt="">
      <div class="media-detail-container">
      <h1 class="media-title">${title}, ${original_title}</h1>
      <dl class="media-description">
        <div class="media-content-wrap">
          <dl>국가</dl>
          <dt>${country}</dt>
        </div>
        <div class="media-content-wrap">
          <dl>언어</dl>
          <dt>${original_language}</dt>
        </div>
        <div class="media-content-wrap">
          <dl></dl>
          <dt></dt>
        </div>
        <div class="media-content-wrap">
          <dl></dl>
          <dt></dt>
        </div>
        <div class="media-content-wrap">
          <dl></dl>
          <dt></dt>
        </div>
        <div class="media-content-wrap">
          <dl></dl>
          <dt></dt>
        </div>
      </dl>
      </div>
      </div>
      <p class="movie-overview">${overview}</p>
      <p class="movie-vote">평점 : ${vote_average}</p>
      `;
    result += appendHtml;
    testUl.innerHTML = result;
  })
  .catch((err) => console.error(err));
