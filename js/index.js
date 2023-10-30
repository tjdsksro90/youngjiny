"use strict";
import { handleFilter } from "./filter.js";
import { onDarkmodeBtnClicked } from "./utils.js";
import { makeCards, makePeopleList } from "./makeCards.js";

const darkmodeBtn = document.querySelector(".button-darkmode");
darkmodeBtn.addEventListener("click", onDarkmodeBtnClicked);

window.addEventListener("load", function () {
  makeCards(1, "movie", "popular");
  makeCards(1, "tv", "popular");
  makePeopleList();
});
