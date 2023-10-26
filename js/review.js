const movieId = getMovieIdFromSession(); // sessionStorage에서 영화 식별자를 가져오는 함수
// 현재 페이지의 id값 가져오기
function getMovieIdFromSession() { 
    const movieId = sessionStorage.getItem('id');	
    return movieId;
} // 파라미터 아이디 가져오기

window.onload = function () {
  // 경로상 ?id=000 유무 파악으로 댓글 show/hide
  if(!(movieId == null || movieId == undefined)) loadComments();
  else document.querySelector('.comment-section').classList.add('displayNone_IM');

  // 댓글 작성 폼 제출 시 실행될 함수 // html 먼저 로드 되고 기능 구현
  document.getElementById('comment-form').onsubmit = function (e) {
      e.preventDefault();

      // 입력된 이름과 댓글 내용 가져오기
      let name = document.getElementById('name').value;
      let comment = document.getElementById('comment').value;
      let password = document.getElementById('password').value;

      // 댓글 객체 생성
      let newComment = {
          user: name,
          pass: password,
          review: comment,
      };

      // 기존 댓글 배열 가져오기
      let comments = getCommentsForMovie(movieId);

      // 새로운 댓글 추가
      comments.push(newComment);

      // 변경된 댓글 배열 저장
      setCommentsForMovie(movieId, comments)

      // 댓글 목록 다시 불러오기
      loadComments();

      // 폼 초기화
      document.getElementById('comment-form').reset();
  };
};

// 영화 식별자를 기반으로 해당 영화의 댓글을 가져옴
function getCommentsForMovie(movieId) {
  const commentsJSON = localStorage.getItem(`comments_${movieId}`);
  return commentsJSON ? JSON.parse(commentsJSON) : []; // JSON.parse = JSON 텍스트 문자열 -> JavaScript 객체
}

// 영화 식별자를 기반으로 해당 영화의 댓글을 설정
function setCommentsForMovie(movieId, comments) {
  localStorage.setItem(`comments_${movieId}`, JSON.stringify(comments)); // JSON.stringify = JavaScript 객체 -> JSON 텍스트 문자열
}

// 댓글 수정 폼
function editCommentAlert(idx){
  // json을 객채화
  const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
  // 해당 comment의 비밀번호 확인
  const commentPassword = commentsJSON[idx].pass;
  // prompt 창으로 비밀번호 값 받기
  const editItem = prompt('비밀번호를 입력하세요', '');

  // 비밀번호 확인 후 수정
  if(editItem != commentPassword) {
      alert('비밀번호를 확인하세요.')
  } else {
      // 수정 될 코멘트에 value 값 가져오기
      const editComment = document.querySelector(`.comment-edit-text-${idx}`);
      editComment.value = document.querySelector(`.comment-edit-after-${idx}`).innerText;

      // 수정하는 화면 show / 수정삭제+기존코멘트 hide
      const editAfter = document.querySelectorAll(`.comment-edit-after-${idx}`);
      const editBefore = document.querySelectorAll(`.comment-edit-before-${idx}`);
      editAfter.forEach(item => item.classList.add('displayNone_IM'));
      editBefore.forEach(item => item.classList.remove('displayNone_IM'));
  }
}

// 댓글 수정 취소
function editCommentCancel(idx){
   // 수정하는 화면 hide / 수정삭제+기존코멘트 show
   const editAfter = document.querySelectorAll(`.comment-edit-after-${idx}`);
   const editBefore = document.querySelectorAll(`.comment-edit-before-${idx}`);
   editAfter.forEach(item => item.classList.remove('displayNone_IM'));
   editBefore.forEach(item => item.classList.add('displayNone_IM'));
}

// 댓글 수정
function editcommentFormoive(idx){
  const editComment = document.querySelector(`.comment-edit-text-${idx}`);
  // 빈값이면 막기
  if(editComment.value == '') {
      alert('수정될 내용을 기입해주세요.');
      return;
  }
  // json을 객채화
  const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
  // 해당 요소 찾아서 수정
  commentsJSON[idx].review = editComment.value;
  // 해당 키 지우고 새롭게 입히기
  localStorage.removeItem(`comments_${movieId}`);
  localStorage.setItem(`comments_${movieId}`, JSON.stringify(commentsJSON))
  // 댓글 리로드
  loadComments();
}

// 댓글 삭제 알림창
function delCommentAlert(idx){
  // json을 객채화
  const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
  // 해당 comment의 비밀번호 확인
  const commentPassword = commentsJSON[idx].pass;
  // prompt 창으로 비밀번호 값 받기
  const delItem = prompt('비밀번호를 입력하세요', '');

  // 비밀번호 확인 후 삭제
  if(delItem != commentPassword) alert('비밀번호를 확인하세요.')
  else delcommentFormoive(idx);
}

// 댓글 삭제 
function delcommentFormoive(idx) {
  // window.localStorage.removeItem(key) 사용시 배열 전부 삭제 되므로
  // 해당 value 찾아서 제외한 리스트 재할당

  // json을 객채화
  const commentsJSON = JSON.parse(localStorage.getItem(`comments_${movieId}`));
  // 해당 요소 제거
  commentsJSON.splice(idx, 1);
  // 해당 키 지우고 새롭게 입히기
  localStorage.removeItem(`comments_${movieId}`);
  localStorage.setItem(`comments_${movieId}`, JSON.stringify(commentsJSON))
  // 댓글 리로드
  loadComments();
}


// 댓글 목록 불러오기
function loadComments() {
  document.querySelector('.comment-section').classList.remove('displayNone_IM');
  let commentList = document.getElementById('comment-list');
  commentList.innerHTML = '';

  let comments = getCommentsForMovie(movieId);

  // 리뷰 갯수 체크해서 화면에 표시
  document.getElementById('comment-count').innerText =comments.length;
  
  for (let i = 0; i < comments.length; i++) {
      let comment = comments[i];

      let listItem = document.createElement('li');
      listItem.innerHTML = `
      <div class="comment-box">
          <span class='comment-user'>${comment.user}</span>
          <span class='comment-edit-after comment-edit-after-${i}'>${comment.review}</span>
      </div>
      <div class="comment-edit comment-edit-before comment-edit-before-${i} displayNone_IM">
          <textarea class="comment-edit-text comment-edit-text-${i}"></textarea>
          <div class='btn-wrap'>
          <button type="button" class='btn-cancel' onclick="editCommentCancel(${i})">취소</button>
          <button type="button" class='btn-submit' onclick="editcommentFormoive(${i})">수정</button>
          </div>
      </div>
      <div class="comment-more comment-edit-after comment-edit-after-${i}">
          <p class="more" onclick='moreWrapFun(this)'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.99967 8.33203C4.08301 8.33203 3.33301 9.08203 3.33301 9.9987C3.33301 10.9154 4.08301 11.6654 4.99967 11.6654C5.91634 11.6654 6.66634 10.9154 6.66634 9.9987C6.66634 9.08203 5.91634 8.33203 4.99967 8.33203ZM14.9997 8.33203C14.083 8.33203 13.333 9.08203 13.333 9.9987C13.333 10.9154 14.083 11.6654 14.9997 11.6654C15.9163 11.6654 16.6663 10.9154 16.6663 9.9987C16.6663 9.08203 15.9163 8.33203 14.9997 8.33203ZM9.99967 8.33203C9.08301 8.33203 8.33301 9.08203 8.33301 9.9987C8.33301 10.9154 9.08301 11.6654 9.99967 11.6654C10.9163 11.6654 11.6663 10.9154 11.6663 9.9987C11.6663 9.08203 10.9163 8.33203 9.99967 8.33203Z" fill="black"></path></svg></p>
          <div class="more-box">
              <button type="button" onclick="editCommentAlert(${i})">수정</button>
              <button type="button" onclick="delCommentAlert(${i})">삭제</button>
          </div>
      </div>
      `
      commentList.appendChild(listItem);
  }

}

// 수정/삭제 more 버튼 부분

// 배경 클릭시 창 닫기
let html = document.querySelector('html');
html.onclick = (event) => {
  if(!(event.target.classList.contains('area') || event.target.parentNode.classList.contains('area'))){
      document.querySelectorAll('.more-box').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.more').forEach(item => item.classList.remove('area'));
  }
}

// 더보기 버튼 이벤트
function moreWrapFun(el){
  if(!(el.classList.contains('area'))){
      document.querySelectorAll('.more-box').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.more').forEach(item => item.classList.remove('area'));
      el.nextElementSibling.classList.add('active');
      el.classList.add('area');
  }
}