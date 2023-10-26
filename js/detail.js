
let session = sessionStorage.getItem('id')

//
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWZhODY1OGNhZTc4NmE4ZDg2YjAzOWRjMjczMGJhZSIsInN1YiI6IjY1MzIzYzNmOGQyMmZjMDEwYjcxY2UwYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ERsC-Mk8MWMzc_0lRgOFwD3wXKoyHrTqeUSGRAbx8bs'
    }
};

let testUl = document.querySelector(".testUl")
let testimg = document.querySelector(".testUl > li > img")



let result = '';
fetch('https://api.themoviedb.org/3/movie/top_rated?language=ko-US&page=1', options)
    .then(response => response.json())
    .then(response =>
        response.results.forEach(item => {
            if (Number(session) === item.id) {
                let poster_path = item.poster_path
                let title = item.title
                let overview = item.overview
                let vote_average = item.vote_average
                let appendHtml =
                    `<li>
                    <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="">
                    <span class="movieTitle">${title}</span>
                    <span class="movieoverview">${overview}</span>
                    <span class="movievote_average">평점 : ${vote_average}</span>
                </li>`;
                result += appendHtml
                testUl.innerHTML = result
            }
        })
    )
    .catch(err => console.error(err));
