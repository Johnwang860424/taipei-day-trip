let url = location.href;
let page = 0;
let inputContent = document.querySelector(".nav-search--input");
let container = document.querySelector(".nav-container");
let isLoading = false;
let keyword;
const backToTopButton = document.querySelector(".back-to-top");

window.addEventListener("load", function () {
  data(`${url}/api/categories`, categoryList);
});
data(`${url}/api/attractions?page=0`, mainContent);

let goToTop = () => {
  document.body.scrollIntoView({
    behavior: "smooth",
  });
};
backToTopButton.addEventListener("click", goToTop);

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

function mainContent(data) {
  if (isLoading) {
    result = data.data;
    page = data.nextPage;
    let content = document.getElementsByTagName("main")[0];
    if (result.length !== 0) {
      for (let index = 0; index < data.data.length; index++) {
        let code = `<div class="attractions-block">
                  <div class="attractions-image" style= background-image:url("${result[index].images[0]}")>
                    <div class="attractions-name">
                      <span class="attractions-text">${result[index].name}</span>
                    </div>
                  </div>
                  <div class="attractions-class">
                    <span class="attractions-mrt">${result[index].mrt}</span>
                    <span class="attractions-cat">${result[index].category}</span>
                  </div>
                </div>`;
        content.insertAdjacentHTML("beforeend", code);
      }
    } else {
      let code = `<span class="error">結果不存在<span>`;
      content.insertAdjacentHTML("beforeend", code);
    }
    isLoading = false;
  }
}

function categoryList(data) {
  for (let index = 0; index < data.data.length; index++) {
    let catName = document.createElement("span");
    catName.className = "nav-list--cat";
    catName.textContent = data.data[index];
    let navList = document.getElementsByClassName("nav-list")[0];
    catName.onclick = function () {
      inputContent.value = data.data[index];
      navList.parentNode.style.display = "none";
    };
    navList.appendChild(catName);
  }
}

document.body.addEventListener("click", function (elem) {
  if (!container.parentNode.contains(elem.target)) {
    container.style.display = "none";
  }
});

function insertName() {
  container.style.display = "block";
}

function search() {
  container.style.display = "none";
  let elem = document.querySelector("main");
  elem.replaceChildren();
  page = 0;
  keyword = inputContent.value;
  data(`${url}/api/attractions?page=${page}&keyword=${keyword}`, mainContent);
}

// Elements
const listEnd = document.querySelector("footer");

// Interception Handler
const callback = ([entry], observer) => {
  if (entry.isIntersecting && page != null && !isLoading && !keyword) {
    data(`${url}/api/attractions?page=${page}`, mainContent);
  } else if (entry.isIntersecting && page !== null && !isLoading && keyword) {
    data(`${url}/api/attractions?page=${page}&keyword=${keyword}`, mainContent);
  }
};

const options = {
  rootMargin: "0px",
  threshold: 0.1,
};

// Observe the end of the list
const observer = new IntersectionObserver(callback, options);
observer.observe(listEnd);
