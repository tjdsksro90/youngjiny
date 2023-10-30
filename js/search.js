const handleSearch = (e) => {
  e.preventDefault();
  const searchKeyword = document.querySelector("#search-input").value;

  if (searchKeyword == "") {
    modalOpen("검색어를 입력해주세요");
  } else {
    sessionStorage.setItem("searchKeyword", JSON.stringify(searchKeyword));
    window.location.href = "/search.html";
  }
};

window.addEventListener("load", function () {
  const form = document.querySelector("#nav-search");
  form.addEventListener("submit", handleSearch);
});
