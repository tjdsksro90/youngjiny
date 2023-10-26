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
      genres,
      production_countries: [{ name: country }]
    } = response;
    let genreNames = genres.map((genre) => genre.name);
    let appendHtml = `
      <div class="media-detail-wrap">
        <img class="media-detail-img" src="https://image.tmdb.org/t/p/w500${poster_path}" data-id="${id}" alt="">
        <div class="media-detail-container">
          <h1 class="media-title">${title}, ${original_title}</h1>
          <dl class="media-description">
            <div class="media-content-wrap">
              <dl>개봉일자</dl>
              <dt>${release_date}</dt>
            </div>
            <div class="media-content-wrap">
              <dl>장르</dl>
              <dt>${genreNames.join(", ")}</dt>
            </div>
            <div class="media-content-wrap">
              <dl>국가</dl>
              <dt>${country}</dt>
            </div>
            <div class="media-content-wrap">
              <dl>언어</dl>
              <dt>${original_language}</dt>
            </div>
            <div class="media-content-wrap">
              <dl>러닝타임</dl>
              <dt>${runtime}</dt>
            </div>
            <div class="media-content-wrap">
              <dl></dl>
              <dt></dt>
            </div>
            <div class="media-content-wrap">
              <dl>평점</dl>
              <dt>${vote_average}</dt>
            </div>
          </dl>
        </div>
          <p class="media-overview">${overview}</p>
      </div>
      `;
    result += appendHtml;
    testUl.innerHTML = result;
  })
  .catch((err) => console.error(err));
