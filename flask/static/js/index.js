const inputContent = document.querySelector(".nav-search--input");
const container = document.querySelector(".nav-container");
let page = 0;
let result;
let isLoading = false;
let keyword;

// 渲染 categories
// window.addEventListener("load", function () {
//   data("/api/categories", categoryList);
// });

data("/api/attractions?page=0", mainContent);
data("/api/categories", categoryList);

// 抓取資料
async function data(url, func) {
  try {
    isLoading = true;
    const response = await fetch(url);
    const res = await response.json();
    func(res);
    isLoading = false;
  } catch (error) {
    console.log(error);
  }
}

// 渲染主畫面內容
function mainContent(data) {
  result = data.data;
  page = data.nextPage;
  const content = document.getElementsByTagName("main")[0];
  if (result.length !== 0) {
    for (let index = 0; index < data.data.length; index++) {
      let code = `<a class="attractions-block" href="attraction/${result[index].id}">
                    <div class="attractions-image" style= background-image:url("${result[index].images[0]}")>
                      <div class="attractions-name">
                        <span class="attractions-text">${result[index].name}</span>
                      </div>
                    </div>
                    <div class="attractions-class">
                      <span class="attractions-mrt">${result[index].mrt}</span>
                      <span class="attractions-cat">${result[index].category}</span>
                    </div>
                  </a>`;
      content.insertAdjacentHTML("beforeend", code);
    }
  } else {
    let code = `<span class="error">結果不存在<span>`;
    content.insertAdjacentHTML("beforeend", code);
  }
}

// 渲染景點類別
function categoryList(data) {
  for (let index = 0; index < data.data.length; index++) {
    const catName = document.createElement("span");
    catName.className = "nav-list--cat";
    catName.textContent = data.data[index];
    const navList = document.getElementsByClassName("nav-list")[0];
    catName.onclick = function () {
      inputContent.value = data.data[index];
      navList.parentNode.style.display = "none";
    };
    navList.appendChild(catName);
  }
}

// 點擊空白處消失類別、登入、註冊視窗
document.body.addEventListener("click", function (elem) {
  if (!container.parentNode.contains(elem.target)) {
    container.style.display = "none";
  }
  if (elem.target.className === "dark") {
    document.querySelector(".dark").style.display = "none";
    member.style.display = "none";
    signup.style.display = "none";
    signinEmail.value = "";
    signinPassword.value = "";
    signupName.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    popupText[0].style.display = "none";
    popupText[2].style.display = "none";
  }
});

// 點擊輸入框出現類別視窗
function insertName() {
  container.style.display = "block";
}

// 查詢景點
function search() {
  container.style.display = "none";
  const elem = document.querySelector("main");
  elem.replaceChildren();
  page = 0;
  keyword = inputContent.value;
  data(`/api/attractions?page=${page}&keyword=${keyword}`, mainContent);
}

// Elements
const listEnd = document.querySelector("footer");

// Interception Handler
const callback = ([entry], observer) => {
  if (entry.isIntersecting && page != null && !isLoading) {
    if (!keyword) {
      data(`/api/attractions?page=${page}`, mainContent);
    } else if (keyword) {
      data(`/api/attractions?page=${page}&keyword=${keyword}`, mainContent);
    }
  }
};

const options = {
  rootMargin: "0px",
  threshold: 0.1,
};

// Observe the end of the list
const observer = new IntersectionObserver(callback, options);
observer.observe(listEnd);
