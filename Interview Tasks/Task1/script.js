const likesOnPage = document.querySelector('#likes');
const dislikesOnPage = document.querySelector('#dislikes');

let likes = 0;
let dislikes = 0;

function handleIncreaseLike(){
    likes++;
    likesOnPage.innerHTML=(`אהבתי (${likes})`);
}
function handleIncreaseDislike(){
    dislikes++;
    dislikesOnPage.innerHTML=(`לא אהבתי (${dislikes})`);
}