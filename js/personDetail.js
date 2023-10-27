const options = {
  method: "GET",
  headers: {
    accept: "application/json"
  }
};

// "5a4db31fc3a3683b82003a00"20738
// tmdb서버에 data요청
const fetchPersonData = async (cardId) => {
  const results = await fetch(
    `https://api.themoviedb.org/3/credit/5a4db31fc3a3683b82003a00?api_key=d5555e1f74ed1afd14d3f203581c2ed3&language=ko-KR `,

    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
  return results;
};



const makePersonDetail = async () => {
  const movies = await fetchPersonData(240); 
 
console.log(movies)
};

makePersonDetail();