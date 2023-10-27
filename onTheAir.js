const submitBtn = document.getElementById("search-btn");

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYmEyYzIzMWRjMTQxMGEzNjk3ZWEzOWQyMjY2M2IwZiIsInN1YiI6IjY1MzBlZmMzNTFhNjRlMDBjOGZkY2I5OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jYFT5VOAZYR9SPBGGB16_GUZgiU7Bmkvz6G-5Qwiw48"
  }
};

fetch("https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1", options)
  .then((response) => response.json())
  .then((response) => createOnTheAirCard(response))
  .catch((err) => console.error(err));

const onTheAirContainer = document.getElementById("onTheAir-container");

const createOnTheAirCard = (onAirs) => {
  onAirs.results.forEach((onAir) => {
    const { id, name, overview, poster_path, vote_average } = onAir;

    const card = document.createElement("div");
    const image = document.createElement("img");
    const nameElement = document.createElement("h2");
    const overviewElement = document.createElement("p");
    const voteAverageElement = document.createElement("p");

    card.classList.add("drama-card");
    image.classList.add("poster-image");
    nameElement.classList.add("name");
    overviewElement.classList.add("overview");
    voteAverageElement.classList.add("vote-average");

    image.setAttribute("src", `https://image.tmdb.org/t/p/w500/${poster_path}`);

    nameElement.textContent = name;
    overviewElement.textContent = overview;
    voteAverageElement.textContent = `Vote Average: ${vote_average}`;

    card.setAttribute("id", id);

    card.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("id");
      alert("TV Programme id: " + id);
    });

    card.appendChild(image);
    card.appendChild(nameElement);
    card.appendChild(overviewElement);
    card.appendChild(voteAverageElement);

    onTheAirContainer.appendChild(card);
  });
};

const onSearchClick = (e) => {
  e.preventDefault();
  const input = document.getElementById("search-input");
  const value = input.value;
  console.log(value);
  filterOnAirs(value);
};
submitBtn.addEventListener("click", onSearchClick);

const filterOnAirs = function (value) {
  let deleteCard = [];
  let showCard = [];
  let cards = Array.from(document.querySelectorAll(".name"));
  showCard = cards.filter((card) => {
    let name = card.innerHTML;
    name = name.toLowerCase();
    if (name.includes(value.toLowerCase())) {
      return card;
    } else {
      deleteCard.push(card);
    }
  });
  console.log(showCard);
  console.log(deleteCard);
  deleteCard.forEach((card) => {
    card.closest(".onAir-card").style.display = "none";
  });
};

const renderOnAir = (onAirs) => {
  onAirs.forEach((onAir) => {
    const onAirCard = createOnTheAirCard(onAir);
    onTheAirContainer.appendChild(onAirCard);
  });
};
