const inputContent = document.querySelector(".nav-search--input");
const container = document.querySelector(".nav-container");
const loginButton = document.querySelector(".hgroup-title-2 a");
const member = document.querySelector(".signin");
const signup = document.querySelector(".signup");
const memberBtn = document.querySelectorAll(".member__button");
const signinEmail = document.querySelector("#signin__email");
const signinPassword = document.querySelector("#signin__password");
const signupName = document.querySelector("#signup__name");
const signupEmail = document.querySelector("#signup__email");
const signupPassword = document.querySelector("#signup__password");
const popupText = document.getElementsByClassName("member__text");
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

// 驗證 cookie
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/user/auth")
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        loginButton.textContent = "登出";
      } else {
        loginButton.textContent = "登入/註冊";
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

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

// 註冊/登入按鍵
memberBtn.forEach((event) => {
  if (event.textContent === "登入帳戶") {
    event.addEventListener("click", () => {
      signupMember(
        "/api/user/auth",
        "PUT",
        {
          email: signinEmail.value,
          password: signinPassword.value,
        },
        0
      );
    });
  }
  if (event.textContent === "註冊新帳戶") {
    event.addEventListener("click", () => {
      signupMember(
        "/api/user",
        "POST",
        {
          name: signupName.value,
          email: signupEmail.value,
          password: signupPassword.value,
        },
        2
      );
    });
  }
});

// 註冊會員/登入會員
async function signupMember(url, method, data, index) {
  try {
    const memberRes = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const memberResponse = await memberRes.json();
    if (memberResponse.message) {
      popupText[index].style.display = "block";
      popupText[index].style.color = "red";
      popupText[index].textContent = memberResponse.message;
    } else if (method === "PUT") {
      member.style.display = "none";
      document.querySelector(".dark").style.display = "none";
      signinEmail.value = "";
      signinPassword.value = "";
      popupText[0].style.display = "none";
      window.location.reload(true);
    } else if (method === "POST") {
      popupText[index].style.display = "block";
      popupText[index].style.color = "green";
      popupText[index].textContent = "註冊成功";
    }
  } catch (error) {
    console.log(error);
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

// 點擊登入/註冊按鈕出現註冊視窗
function login() {
  if (loginButton.textContent === "登入/註冊") {
    member.style.display = "flex";
    document.querySelector(".dark").style.display = "block";
  }
  if (loginButton.textContent === "登出") {
    fetch("/api/user/auth", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.ok) {
          loginButton.textContent = "登入/註冊";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// 登入會員帳號、註冊會員帳號視窗切換
document.querySelectorAll("a[style='cursor: pointer']").forEach((event) => {
  event.addEventListener("click", (event) => {
    if (event.target.textContent === "點此註冊") {
      signinEmail.value = "";
      signinPassword.value = "";
      member.style.display = "none";
      signup.style.display = "flex";
      popupText[0].style.display = "none";
    }
    if (event.target.textContent === "點此登入") {
      signupName.value = "";
      signupEmail.value = "";
      signupPassword.value = "";
      signup.style.display = "none";
      member.style.display = "flex";
      popupText[2].style.display = "none";
    }
  });
});

// 點擊叉叉關閉登入/註冊視窗
document.querySelectorAll(".member__close").forEach((element) => {
  element.addEventListener("click", () => {
    signup.style.display = "none";
    member.style.display = "none";
    document.querySelector(".dark").style.display = "none";
  });
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
