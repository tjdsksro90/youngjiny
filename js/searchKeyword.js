const session = sessionStorage.getItem("searchKeyword");
const searchKeyword = JSON.parse(session);
document.querySelector("#search-input").value = searchKeyword;
console.log(searchKeyword);

let totalPages;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YTVlZDU5NmIzNTk4ODZmNjY1MDdmOTgzMjM2NWVmNCIsInN1YiI6IjY1MmY4NGU2ZWE4NGM3MDBjYTEyZGYxZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EIRykaMpZeWLXpjyuX2pzqu0h562vsjwcptRXfSwL0s"
  }
};

const fetchSearchData = async (page, media) => {
  const data = await fetch(
    `https://api.themoviedb.org/3/search/${media}?query=${searchKeyword}&language=ko&page=${page}`,
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return data;
};

const makeLists = async (pageNum = 1, media = "movie") => {
  const dataMovie = await fetchSearchData(pageNum, media);
  console.log(dataMovie);
  const { results, page, total_pages, total_results} = dataMovie;
  const cardList = document.querySelector(`.card-search-${media}`);
  const cardListLength = document.querySelector(`.${media}-length`);
  cardListLength.innerHTML = total_results;
  if( results.length == 0 ) {
    cardList.innerHTML = '검색 결과가 없습니다.'
    return;
  }
  cardList.setAttribute("data-page", page);
  cardList.innerHTML += results
    .map((item, idx) => {
      // 영화 객체의 제목, 이미지경로, 내용, 평점 property를 구조 분해 및 할당을 이용해 저장한다
      let id = item.id;
      let title = item.name;
      let poster_path = item.poster_path;

      if ( media == "movie" ) title = item.title;
      else if ( media == "person" ) poster_path = item.profile_path;

      return poster_path != null ?
        `<li data-id=${id} data-media=${media}>
          <p class="img"><img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}"/></p>
          <h3 class="title">${title}</h3>
        </li>`
      : `<li data-id=${id} data-media=${media}>
          <p class="img img-null">No Img</p>
          <h3 class="title">${title}</h3>
        </li>`;
    })
    .join("");

  const cardMore = document.querySelector(`.search-more-${media}`);
  cardMore.setAttribute("data-page", page);
  cardMore.setAttribute("data-media", media);

  if(page != total_pages) {
    cardMore.innerHTML = 
      `<button type="button">+</button>
      `
    ;
  } else {
    cardMore.innerHTML = '';
  }

  const cardMoreAll = document.querySelectorAll(".search-more");

  for (const more of cardMoreAll) {
    let getPage = more.getAttribute("data-page")
    let getMedia = more.getAttribute("data-media")
    more.onclick = () => onMoreClicked(getPage, getMedia);
  }

  for (const child of cardList.children) {
    child.addEventListener("click", onCardClicked);
  }

  // 카드 클릭시 ID 를 보여주기 위한 이벤트 핸들러
  function onCardClicked(e) {
    const id = e.currentTarget.getAttribute("data-id");
    const media = e.currentTarget.getAttribute("data-media");
    const data = {
      id: id,
      media: media
    };
    ( media == 'movie' ) ? window.location.href = "/detail.html"
      : ( media == 'tv' ) ? window.location.href = "/detail.html" // TODO tv detail location으로 수정
      : window.location.href = "/detail.html" // TODO person detail location으로 변경
    sessionStorage.setItem("data", JSON.stringify(data));
  }
};

// 더보기 클릭시 다음 페이지 추가
function onMoreClicked(page, media) {
  page++
  makeLists(page, media);
}

window.addEventListener("load", function () {
  makeLists(1, 'movie');
  makeLists(1, 'tv');
  makeLists(1, 'person');
});

