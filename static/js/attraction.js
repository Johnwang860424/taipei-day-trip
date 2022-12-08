const url = `/api${location.pathname}`;
const background = document.querySelector(".section-top--left");
const attractionName = document.querySelector(".section-top--right---title");
const description = document.querySelector(".section-bottom");
const radioBtns = document.querySelectorAll("input[name='time']");
const result = document.querySelector(".price");
const memberBtn = document.querySelectorAll(".member__button");
const loginButton = document.querySelector(".hgroup-title-2 a");
let slideIndex = 1;

data(url, mainContent);

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

// fetch data
async function data(url, func) {
  try {
    const response = await fetch(url);
    const res = await response.json();
    func(res);
  } catch (error) {
    console.log(error);
  }
}

// render main content
function mainContent(data) {
  const attractionData = data.data;
  attractionName.textContent = attractionData.name;
  attractionName.nextSibling.nextSibling.textContent = `${attractionData.category} at ${attractionData.mrt}`;
  description.childNodes[0].textContent = attractionData.description;
  description.childNodes[3].children[0].textContent = attractionData.address;
  description.childNodes[5].children[0].textContent = attractionData.transport;
  for (let index = 0; index < attractionData.images.length; index++) {
    const slide = `<div class="mySlides fade" style="background-image: url(${attractionData.images[index]})">
    </div>`;
    background.insertAdjacentHTML("beforeend", slide);
  }
  const btnClass = ["prev", "next"];
  const btnImg = [
    "../static/img/btn_leftArrow.svg",
    "../static/img/btn_rightArrow.svg",
  ];

  for (let index = 0; index < 2; index++) {
    const btn = `<a class=${btnClass[index]} style="background: no-repeat url(${btnImg[index]})">`;
    background.insertAdjacentHTML("beforeend", btn);
    document.querySelector(`.${btnClass[index]}`).onclick = function () {
      plusSlides(index * 2 - 1);
    };
  }

  background.insertAdjacentHTML(
    "beforeend",
    `<div class="dot-container"></div>`
  );
  for (let index = 0; index < attractionData.images.length; index++) {
    const dot = `<span class="dot"></span>`;
    background.lastChild.insertAdjacentHTML("beforeend", dot);
    document.querySelectorAll(".dot")[index].onclick = function () {
      currentSlide(index + 1);
    };
  }
  showSlides(slideIndex);
}

// Next/previous controls
function plusSlides(number) {
  showSlides((slideIndex += number));
}

// Thumbnail image controls
function currentSlide(number) {
  showSlides((slideIndex = number));
}

function showSlides(number) {
  let index;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");
  if (number > slides.length) {
    slideIndex = 1;
  }
  if (number < 1) {
    slideIndex = slides.length;
  }
  for (index = 0; index < slides.length; index++) {
    slides[index].style.display = "none";
  }
  for (index = 0; index < dots.length; index++) {
    dots[index].className = dots[index].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// change price
let findSelected = () => {
  let selected = document.querySelector("input[name='time']:checked").value;
  result.textContent = `新台幣${selected}元`;
};
radioBtns.forEach((time) => {
  time.addEventListener("change", findSelected);
});
findSelected();

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
