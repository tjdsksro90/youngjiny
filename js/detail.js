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
              <dt>${runtime}분</dt>
            </div>
            <div class="media-content-wrap">
              <dl></dl>
              <dt></dt>
            </div>
            <div class="media-content-wrap">
              <dl>평점</dl>
              <dt>${Number(vote_average.toFixed(1))}</dt>
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
              <dl>방영기간</dl>
              <dt>${first_air_date} ~ ${last_air_date}</dt>
            </div>
            <div class="media-content-wrap">
              <dl>장르</dl>
              <dt>${genreNames.join(", ")}</dt>
            </div>
            <div class="media-content-wrap">
              <dl>시즌</dl>
              <dt>${seasons.length}</dt>
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
              <dt>${episode_run_time}분</dt>
            </div>
            <div class="media-content-wrap">
              <dl>평점</dl>
              <dt>${Number(vote_average).toFixed(1)}</dt>
            </div>
          </dl>
        </div>
          <p class="media-overview">${overview}</p>
      </div>
      `;
  })
  .catch((err) => console.error(err));
