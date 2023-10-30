import { onDarkmodeBtnClicked } from "./utils.js";

const submitBtn = document.getElementById("search-btn");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYmEyYzIzMWRjMTQxMGEzNjk3ZWEzOWQyMjY2M2IwZiIsInN1YiI6IjY1MzBlZmMzNTFhNjRlMDBjOGZkY2I5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jYFT5VOAZYR9SPBGGB16_GUZgiU7Bmkvz6G-5Qwiw48"
  }
};
fetch("https://api.themoviedb.org/3/tv/on_the_air?language=ko-US&page=1", options)
  .then((response) => response.json())
  .then((response) => {
    createOnAirCard(response);
    console.log("fetch onAir");
  })
  .catch((err) => console.error(err));
const onAirContainer = document.getElementById("onAir-container");
const createOnAirCard = (onAirs) => {
  onAirs.results
    .filter((onAir, i) => {
      return true;
    })
    .forEach((onAir) => {
      //onAir;
      const { id, name, overview, poster_path, vote_average } = onAir;
      const card = document.createElement("div");
      const image = document.createElement("img");
      const nameElement = document.createElement("div");
      const overviewElement = document.createElement("div");
      const voteAverageElement = document.createElement("div");
      card.classList.add("onAir-card");
      image.classList.add("poster-image");
      nameElement.classList.add("name");
      overviewElement.classList.add("overview");
      voteAverageElement.classList.add("vote-average");
      image.setAttribute("src", `https://image.tmdb.org/t/p/w500/${poster_path}`);
      nameElement.textContent = name;
      overviewElement.textContent = overview ? overview : "줄거리가 없습니다.";
      voteAverageElement.innerHTML = `<span>${vote_average}</span> / 10`;
      card.setAttribute("id", id);
      card.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("id");
        const data = {
          id: id,
          media: "tv"
        };
        location.href = "detail.html";
        sessionStorage.setItem("data", JSON.stringify(data));
      });
      card.appendChild(image);
      card.appendChild(nameElement);
      card.appendChild(overviewElement);
      card.appendChild(voteAverageElement);
      onAirContainer.appendChild(card);
    });
};

const renderOnAir = (onAirs) => {
  onAirs.forEach((onAir) => {
    const onAirCard = createOnAirCard(onAir);
    onAirContainer.appendChild(onAirCard);
  });
};

//const submitBtn = document.getElementById("search-btn");
// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYmEyYzIzMWRjMTQxMGEzNjk3ZWEzOWQyMjY2M2IwZiIsInN1YiI6IjY1MzBlZmMzNTFhNjRlMDBjOGZkY2I5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jYFT5VOAZYR9SPBGGB16_GUZgiU7Bmkvz6G-5Qwiw48",
//   },
// };
fetch("https://api.themoviedb.org/3/tv/top_rated?language=ko-US&page=1", options)
  .then((response) => response.json())
  .then((response) => {
    createTopRateCard(response);
    console.log("fetch TopRate");
  })
  .catch((err) => console.error(err));
const topRateContainer = document.getElementById("topRate-container");
const createTopRateCard = (topRates) => {
  topRates.results
    .filter((topRate, i) => {
      return true;
    })
    .forEach((topRate) => {
      const { id, name, overview, poster_path, vote_average } = topRate;
      const card = document.createElement("div");
      const image = document.createElement("img");
      const nameElement = document.createElement("div");
      const overviewElement = document.createElement("div");
      const voteAverageElement = document.createElement("div");
      card.classList.add("topRate-card");

      image.classList.add("poster-image");
      nameElement.classList.add("name");
      overviewElement.classList.add("overview");
      voteAverageElement.classList.add("vote-average");
      image.setAttribute("src", `https://image.tmdb.org/t/p/w500/${poster_path}`);
      nameElement.textContent = name;
      overviewElement.textContent = overview ? overview : "줄거리가 없습니다.";
      voteAverageElement.innerHTML = `<span>${vote_average}</span> / 10`;
      card.setAttribute("id", id);
      card.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("id");
        const data = {
          id: id,
          media: "tv"
        };
        location.href = "detail.html";
        sessionStorage.setItem("data", JSON.stringify(data));
      });
      card.appendChild(image);
      card.appendChild(nameElement);
      card.appendChild(overviewElement);
      card.appendChild(voteAverageElement);
      topRateContainer.appendChild(card);
    });
};

const darkmodeBtn = document.querySelector(".button-darkmode");
darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);

const renderTopRate = (topRates) => {
  topRates.forEach((topRate) => {
    const topRateCard = createTopRateCard(topRate);
    topRateContainer.appendChild(topRateCard);
  });
};
