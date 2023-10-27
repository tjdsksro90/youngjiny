const session = sessionStorage.getItem("data");
const data = JSON.parse(session);
console.log(data);
//
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTVlZDU5NmIzNTk4ODZmNjY1MDdmOTgzMjM2NWVmNCIsInN1YiI6IjY1MmY4NGU2ZWE4NGM3MDBjYTEyZGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIRykaMpZeWLXpjyuX2pzqu0h562vsjwcptRXfSwL0s"
  }
};

const mediaDetail = document.querySelector(".media-detail");

fetch(`https://api.themoviedb.org/3/${data.media}/${Number(data.id)}?language=ko-US`, options)
  .then((response) => response.json())
  .then((response) => {
    const {
      id,
      poster_path,
      title,
      name,
      overview,
      vote_average,
      original_language,
      original_title,
      original_name,
      runtime,
      seasons,
      first_air_date,
      last_air_date,
      episode_run_time,
      release_date,
      genres,
      production_countries: [{ name: country }]
    } = response;
    const genreNames = genres.map((genre) => genre.name);
    mediaDetail.innerHTML =
      data.media === "movie"
        ? `
      <div class="media-detail-wrap">
        <img class="media-detail-img" src="https://image.tmdb.org/t/p/w500${poster_path}" data-id="${id}" alt="">
        <div class="media-detail-container">
          <h1 class="media-title">${title}<span class="original">${original_title}</span></h1>
          <dl class="media-description">
            <div class="media-content-wrap">
              <dt>개봉일자</dt>
              <dd>${release_date}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>장르</dt>
              <dd>${genreNames.join(", ")}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>국가</dt>
              <dd>${country}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>언어</dt>
              <dd>${original_language}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>러닝타임</dt>
              <dd>${runtime}분</dd>
            </div>
            <div class="media-content-wrap">
              <dt>평점</dt>
              <dd>${Number(vote_average.toFixed(1))}</dd>
            </div>
          </dl>
        </div>
          <p class="media-overview">${overview}</p>
      </div>`
        : `
      <div class="media-detail-wrap">
        <img class="media-detail-img" src="https://image.tmdb.org/t/p/w500${poster_path}" data-id="${id}" alt="">
        <div class="media-detail-container">
          <h1 class="media-title">${name}<span class="original">${original_name}</span></h1>
          <dl class="media-description">
            <div class="media-content-wrap">
              <dt>방영기간</dt>
              <dd>${first_air_date} ~ ${last_air_date}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>장르</dt>
              <dd>${genreNames.join(", ")}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>시즌</dt>
              <dd>${seasons.length}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>국가</dt>
              <dd>${country}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>언어</dt>
              <dd>${original_language}</dd>
            </div>
            <div class="media-content-wrap">
              <dt>러닝타임</dt>
              <dd>${episode_run_time}분</dd>
            </div>
            <div class="media-content-wrap">
              <dt>평점</dt>
              <dd>${Number(vote_average).toFixed(1)}</dd>
            </div>
          </dl>
        </div>
          <p class="media-overview">${overview}</p>
      </div>
      `;
  })
  .catch((err) => console.error(err));
