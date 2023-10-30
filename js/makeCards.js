let totalPages;

// TMDB API에서 Top Rated Movies 데이터 받아오기
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTVlZDU5NmIzNTk4ODZmNjY1MDdmOTgzMjM2NWVmNCIsInN1YiI6IjY1MmY4NGU2ZWE4NGM3MDBjYTEyZGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIRykaMpZeWLXpjyuX2pzqu0h562vsjwcptRXfSwL0s"
  }
};

const fetchMovieData = async (page, media, group) => {
  const data = await fetch(
    `https://api.themoviedb.org/3/${media}/${group}?language=ko-US&page=${page}&region=KR`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return data;
};

const fetchGenreData = async (media = "movie") => {
  const data = await fetch(`https://api.themoviedb.org/3/genre/${media}/list?language=ko`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return data.genres;
};

const fetchTrendingPeople = async () => {
  const data = await fetch(`https://api.themoviedb.org/3/trending/person/week?language=ko-US&page=1`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));

  return data.results;
};

// 영화 정보의 배열을 순회하며 영화 카드를 만드는 함수
export const makeCards = async (pageNum = 1, media = "movie", group = "top_rated") => {
  const data = await fetchMovieData(pageNum, media, group);
  let genres = await fetchGenreData(media);
  const { results, page } = data; // results === 영화 리스트, page === 페이지
  const cardList =
    media === "movie" ? document.querySelector(".card-list-movie") : document.querySelector(".card-list-tv");
  cardList.setAttribute("data-page", page);
  cardList.innerHTML += results
    .map((item, idx) => {
      // 영화 객체의 제목, 이미지경로, 내용, 평점 property를 구조 분해 및 할당을 이용해 저장한다
      const { title, name, poster_path, overview, vote_average, id, genre_ids, release_date, first_air_date } = item;
      genres = genres.filter((genre) => {
        return genre_ids.includes(genre.id);
      });
      const genreNames = genres.map((genre, idx) => genre.name);
      return media === "movie"
        ? `<li data-id=${id} data-genres="${genre_ids}" class="movie-card">
        <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}"/>
        <h3 class="movie-title">${title}</h3>
        <div class="movie-card-content">
          <dl>
            <div>
              <dt>개봉</dt>
              <dd>${release_date}</dd>
            </div>
            <div>
              <dt>장르</dt>
              <dd>${genreNames.length ? genreNames.join(", ") : "분류되지 않은 장르"}</dd>
            </div>
            <div>
              <dt>평점</dt>
              <dd class="movie-rating">${Number(vote_average).toFixed(1)}</dd>
            </div>
          </dl>
          <p class="overview">${overview ? overview : "줄거리가 없습니다."}</p>
        </div>
      </li>`
        : `<li data-id=${id} data-genres="${genre_ids}" class="movie-card">
      <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${name}"/>
      <h3 class="movie-title">${name}</h3>
      <div class="movie-card-content">
        <dl>
            <div>
              <dt>최초방영</dt>
              <dd>${first_air_date}</dd>
            </div>
            <div>
              <dt>장르</dt>
              <dd>${genreNames.length ? genreNames.join(", ") : "분류되지 않은 장르"}</dd>
            </div>
            <div>
              <dt>평점</dt>
              <dd class="movie-rating">${Number(vote_average).toFixed(1)}</dd>
            </div>
          </dl>
          <p class="overview">${overview ? overview : "줄거리가 없습니다."}</p>

      </div>
    </li>`;
    })
    .join("");
  for (const child of cardList.children) {
    child.addEventListener("click", onCardClicked);
  }
  // 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러
  function onCardClicked(e) {
    const id = e.currentTarget.getAttribute("data-id");
    const data = {
      id: id,
      media: media
    };
    location.href = "detail.html";
    sessionStorage.setItem("data", JSON.stringify(data));
  }
  // 마지막 페이지까지 로드되면 더보기 버튼 비활성화
  if (page === totalPages) moreBtn.classList.toggle("invisible");

  // filter가 적용중이라면 페이지를 그린 직후 필터링을 한다
  // filterMovies(filter, value, genres);
};

export const makePeopleList = async () => {
  const data = await fetchTrendingPeople();
  let results = data;
  results = results.filter((item) => item.known_for_department === "Acting");
  const peopleList = document.querySelector(".people-list");
  peopleList.innerHTML = results
    .map((item) => {
      const { id, known_for_department, name, profile_path } = item;
      return `
        <li class="person-popular" data-id="${id}" data-media="person">
          <img src=https://image.tmdb.org/t/p/w185/${profile_path} alt=${name} />
          <h3 class="person-name">${name}</h3>
        </li>
      `;
    })
    .join("");
};
