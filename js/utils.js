// 다크모드 핸들러
export function onDarkmodeBtnClicked(e) {
  const header = document.querySelector("header");
  const body = document.querySelector("body");
  const footer = document.querySelector("footer");
  header.classList.toggle("dark-mode");
  body.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode");
  // filterBtn.classList.toggle("dark-mode");
  document.querySelectorAll("main .button").forEach((btn) => {
    btn.classList.toggle("dark-mode-buttons");
  });
  // document.querySelector("fieldset").classList.toggle("dark-mode-buttons");
  // document.querySelectorAll("ul label").forEach((btn) => {
  //   btn.classList.toggle("dark-mode-buttons");
  // });
  document.querySelectorAll(".movie-card").forEach((card) => card.classList.toggle("dark-mode"));
  document.querySelectorAll("p").forEach((p) => p.classList.toggle("dark-mode"));
  document.querySelectorAll(".nav ul li a").forEach((link) => link.classList.toggle("dark-mode"));
}
