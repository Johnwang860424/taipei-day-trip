const url = location.href;
const inputContent = document.querySelector(".nav-search--input");
const container = document.querySelector(".nav-container");
let page = 0;
let result;
let isLoading = false;
let keyword;

window.addEventListener("load", function () {
  data(`${url}/api/categories`, categoryList);
});
data(`${url}/api/attractions?page=0`, mainContent);

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
      let code = `<a class="attractions-block" href="${url}attraction/${result[index].id}">
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

// 點擊空白處消失類別框框
document.body.addEventListener("click", function (elem) {
  if (!container.parentNode.contains(elem.target)) {
    container.style.display = "none";
  }
});

// 點擊輸入框出現類別框框
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
  data(`${url}/api/attractions?page=${page}&keyword=${keyword}`, mainContent);
}

// Elements
const listEnd = document.querySelector("footer");

// Interception Handler
const callback = ([entry], observer) => {
  console.log(entry.isIntersecting, page, isLoading);
  if (entry.isIntersecting && page != null && !isLoading) {
    if (!keyword) {
      data(`${url}/api/attractions?page=${page}`, mainContent);
    } else if (keyword) {
      data(
        `${url}/api/attractions?page=${page}&keyword=${keyword}`,
        mainContent
      );
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
