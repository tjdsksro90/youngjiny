const handleSearch = (e) => {
  e.preventDefault();
  const searchKeyword = document.querySelector("#search-input").value;
  location.href = "detail.html";
  sessionStorage.setItem("searchKeyword", JSON.stringify(searchKeyword));
  window.location.href = "/search.html";
};

window.addEventListener("load", function () {
  const form = document.querySelector("#nav-search");
  form.addEventListener("submit", handleSearch);
});