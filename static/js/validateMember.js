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
const bookingButton = document.querySelector(".hgroup-title-1 a");
const userName = document.querySelector(".welcome__text");

// 驗證 cookie
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/user/auth")
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        loginButton.textContent = "登出";
        if (userName) {
          userName.textContent = `您好，${res.data.name}，待預訂的行程如下：`;
        }
      } else if (res.data === null && location.pathname === "/booking") {
        location.href = "/";
      } else if (res.data === null) {
        loginButton.textContent = "登入/註冊";
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

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

// 點擊空白處消失登入、註冊視窗
document.body.addEventListener("click", function (elem) {
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
  } else if (loginButton.textContent === "登出") {
    fetch("/api/user/auth", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.ok && location.pathname === "/booking") {
          location.href = "/";
        } else if (res.ok) {
          loginButton.textContent = "登入/註冊";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// 點擊預定行程按鈕事件
bookingButton.addEventListener("click", function () {
  if (loginButton.textContent === "登入/註冊") {
    member.style.display = "flex";
    document.querySelector(".dark").style.display = "block";
  } else if (loginButton.textContent === "登出") {
    location.href = "/booking";
  }
});

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
