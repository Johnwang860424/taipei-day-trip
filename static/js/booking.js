const message = document.querySelector(".welcome__text");
const container = document.querySelector(".container");
const deleteBtn = document.getElementsByClassName("attraction__delete");
let totalPrice = 0;
let orderAttraction;
let contactName;
let contactMail;
let contactPhone;
let submitButton;
let nameValid = false,
  emailValid = false,
  phoneValid = false;

data("/api/booking", bookingContent);

// get data
async function data(url, func, method = "GET", deleteData) {
  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deleteData),
  });
  const res = await response.json();
  func(res);
}

// delete booking information
function deleteBooking(response) {
  if (response.ok === true) {
    location.reload();
  }
}

function bookingContent(response) {
  if (response.data) {
    orderAttraction = response.data.map((element) => {
      let newElement = { ...element };
      delete newElement.price;
      return newElement;
    });
    response.data.forEach((element, index) => {
      const attraction = element.attraction;
      const time = {
        morning: "早上 9 點到下午 4 點",
        afternoon: "下午 4 點到晚上 10點",
      };
      totalPrice += element.price;
      const code = `<div class="box">
                        <div class="attraction">
                            <img class="attraction__photo" src="${
                              attraction.image
                            }"/>
                            <div class="attraction__infor">
                                <span class="infor__title">${
                                  attraction.name
                                }</span>
                                <span style="margin-bottom: 10px">日期：
                                    <span class="information">${
                                      element.date
                                    }</span>
                                </span>
                                <span style="margin-bottom: 10px">時間：
                                    <span class="information">${
                                      time[element.time]
                                    }</span>
                                </span>
                                <span style="margin-bottom: 10px">費用：
                                    <span class="information">新台幣 ${
                                      element.price
                                    } 元</span>
                                </span>
                                <span style="margin-bottom: 10px">地點：
                                    <span class="information">${
                                      attraction.address
                                    }</span>
                                </span>
                            </div>
                            <img class="attraction__delete" src="static/img/icon_delete.svg"/>
                        </div>
                    </div>`;
      container.insertAdjacentHTML("beforeend", code);
      deleteBtn[index].addEventListener("click", () => {
        data("/api/booking", deleteBooking, "DELETE", {
          orderid: element.orderid,
        });
      });
    });
    const payment = `<form>
                    <div class="box">
                        <span class="box__title">您的聯絡資訊</span>
                        <div class="infor__input">
                            <label for="contact_name">聯絡姓名：</label>   <input type="text" id="contact_name" />
                        </div>
                        <div class="infor__input">
                            <label for="contact_email">聯絡信箱：</label>
                            <input type="text" id="contact_email" />
                        </div>
                            <div class="infor__input">
                            <label for="phone">手機號碼：</label>
                            <input type="text" id="phone" maxlength="10" />
                        </div>
                        <span
                        >請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。</span>
                    </div>
                    <div class="box">
                        <span class="box__title">信用卡付款資訊</span>
                        <div class="infor__input">
                            <label>卡片號碼：</label>
                            <div class="tpfield" id="card-number"></div>
                        </div>
                        <div class="infor__input">
                            <label>過期時間：</label>
                            <div class="tpfield" id="card-expiration-date"></div>
                        </div>
                        <div class="infor__input">
                            <label>驗證密碼：</label>
                            <div class="tpfield" id="card-ccv"></div>
                        </div>
                    </div>
                    <div class="box" style="text-align: end">
                        <div style="margin-bottom: 25px">
                        總價：新台幣 <span class="price">${totalPrice}</span> 元
                        </div>
                        <button type="submit" class="reserve" disabled>確認訂購並付款</button>
                    </div>
                    </form>`;
    container.insertAdjacentHTML("beforeend", payment);

    const nameInput = document.querySelector("#contact_name");
    // check name is qualified or not
    ["input", "focus"].forEach((event) => {
      nameInput.addEventListener(event, (name) => {
        contactName = name.target.value;
        nameValid = isValidName(name.target.value);
        if (isValidName(name.target.value) === true) {
          setNumberFormGroupToSuccess("#contact_name");
          document.getElementById("contact_name").style.border =
            "#28a745 solid 1px";
          checkAndUpdateButtonStatus();
        } else if (isValidName(name.target.value) === false) {
          setNumberFormGroupToError("#contact_name");
          document.getElementById("contact_name").style.border =
            "#dc3545 solid 1px";
          checkAndUpdateButtonStatus();
        }
      });
    });

    const emailInput = document.querySelector("#contact_email");
    // check email is qualified or not
    ["input", "focus"].forEach((event) => {
      emailInput.addEventListener(event, (email) => {
        contactMail = email.target.value;
        emailValid = isValidEmailAddress(email.target.value);
        if (isValidEmailAddress(email.target.value) === true) {
          setNumberFormGroupToSuccess("#contact_email");
          document.getElementById("contact_email").style.border =
            "#28a745 solid 1px";
          checkAndUpdateButtonStatus();
        } else if (isValidEmailAddress(email.target.value) === false) {
          setNumberFormGroupToError("#contact_email");
          document.getElementById("contact_email").style.border =
            "#dc3545 solid 1px";
          checkAndUpdateButtonStatus();
        }
      });
    });

    const phoneInput = document.querySelector("#phone");
    // check phone number is qualified or not
    ["input", "focus"].forEach((event) => {
      phoneInput.addEventListener(event, (phone) => {
        contactPhone = phone.target.value;
        phoneValid = isValidPhoneNumber(phone.target.value);
        if (isValidPhoneNumber(phone.target.value) === true) {
          setNumberFormGroupToSuccess("#phone");
          document.getElementById("phone").style.border = "#28a745 solid 1px";
          checkAndUpdateButtonStatus();
        } else if (isValidPhoneNumber(phone.target.value) === false) {
          setNumberFormGroupToError("#phone");
          document.getElementById("phone").style.border = "#dc3545 solid 1px";
          checkAndUpdateButtonStatus();
        }
      });
    });
    tappaySetup();
    document.querySelector("form").addEventListener("submit", function (event) {
      event.preventDefault();

      forceBlurIos();

      // 取得 TapPay Fields 的 status
      const tappayStatus = TPDirect.card.getTappayFieldsStatus();

      // Get prime
      TPDirect.card.getPrime((result) => {
        submitButton = document.querySelector(".reserve");
        submitButton.style.cursor = "not-allowed";
        submitButton.style.opacity = 0.65;
        submitButton.setAttribute("disabled", true);

        try {
          fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prime: `${result.card.prime}`,
              order: {
                price: `${totalPrice}`,
                trip: orderAttraction,
              },
              contact: {
                name: `${contactName}`,
                email: `${contactMail}`,
                phone: `${contactPhone}`,
              },
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.data.payment.status == 0) {
                location.href = `/thankyou?ordernumber=${data.data.number}`;
              } else if (data.data.payment.status != 0) {
                const errorMessage = document.querySelector(".signin");
                const darkBackground = document.querySelector(".dark");
                errorMessage.style.minHeight =
                  errorMessage.parentElement.style.minHeight = "fit-content";
                errorMessage.textContent = "";
                errorMessage.style.display = "flex";
                errorMessage.style.margin = "15% auto 0 auto";
                darkBackground.style.display = "block";
                const content = `<div class="member__title">
                                訂購失敗
                                  <img class="member__close" src="static/img/icon_close.svg" />
                               </div>
                               <div class="error__message"></div>
                               `;
                errorMessage.insertAdjacentHTML("afterbegin", content);
                document
                  .querySelector(".member__close")
                  .addEventListener("click", () => {
                    errorMessage.style.display = "none";
                    darkBackground.style.display = "none";
                  });
                document.querySelector(".error__message").textContent =
                  data.data.payment.message;
              }
            });
        } catch (error) {
          console.log(error);
        }

        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
      });
    });
  } else if (response.data === null) {
    document.querySelector("footer").style.height = "65vh";
    document.querySelector(".footer-text").style.cssText =
      "position: relative; bottom: 40%;";
    const code = `<span class="welcome__text" style="margin-top:35px;font-weight:500;font-size:16px">目前沒有任何預定行程</span>`;
    message.insertAdjacentHTML("afterend", code);
  }
}

// check the name is qualified or not
function isValidName(name) {
  if (1 < name.length && name.length <= 10) {
    return true;
  }
  return false;
}

// check the email address is qualified or not
function isValidEmailAddress(emailAddress) {
  const phoneNumberRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return phoneNumberRegex.test(emailAddress);
}

// check the phone number is qualified or not
function isValidPhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^09\d{8}$/;
  return phoneNumberRegex.test(phoneNumber);
}

// credit card SDK
TPDirect.setupSDK(
  126902,
  "app_LgbbkeZfw0U3WJDUnw9E2FKKENbfmUG9prvMPuUyTCfqJKPKelpCwi1qb13d",
  "sandbox"
);
function tappaySetup() {
  TPDirect.card.setup({
    fields: {
      number: {
        element: "#card-number",
        placeholder: "**** **** **** ****",
      },
      expirationDate: {
        element: "#card-expiration-date",
        placeholder: "MM / YY",
      },
      ccv: {
        element: "#card-ccv",
        placeholder: "CVV",
      },
    },
    styles: {
      input: {
        "font-family": "Noto Sans TC",
        "font-weight": "500",
        "font-size": "16px",
      },
      "input.ccv": {
        // "font-size": "16px",
      },
      ":focus": {
        color: "black",
      },
      ".valid": {
        color: "#28a745",
      },
      ".invalid": {
        color: "#dc3545",
      },
      "@media screen and (max-width: 400px)": {
        input: {
          color: "orange",
        },
      },
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
      beginIndex: 6,
      endIndex: 11,
    },
  });
}
// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
  checkAndUpdateButtonStatus();
  /* Change card type display when card type change */
  /* ============================================== */

  // cardTypes = ['visa', 'mastercard', ...]
  // var newType = update.cardType === "unknown" ? "" : update.cardType;
  // $("#cardtype").text(newType);
  // document.querySelector("#cardtype").textContent = newType;

  /* Change form-group style when tappay field status change */
  /* ======================================================= */

  // number 欄位是錯誤的
  if (update.status.number === 2) {
    setNumberFormGroupToError("#card-number");
  } else if (update.status.number === 0) {
    setNumberFormGroupToSuccess("#card-number");
  } else {
    setNumberFormGroupToNormal("#card-number");
  }

  if (update.status.expiry === 2) {
    setNumberFormGroupToError("#card-expiration-date");
  } else if (update.status.expiry === 0) {
    setNumberFormGroupToSuccess("#card-expiration-date");
  } else {
    setNumberFormGroupToNormal("#card-expiration-date");
  }

  if (update.status.ccv === 2) {
    setNumberFormGroupToError("#card-ccv");
  } else if (update.status.ccv === 0) {
    setNumberFormGroupToSuccess("#card-ccv");
  } else {
    setNumberFormGroupToNormal("#card-ccv");
  }
});

function setNumberFormGroupToError(selector) {
  const element = document.querySelector(selector);
  element.classList.add("custom-error");
  element.classList.remove("custom-success");
  element.parentNode.classList.add("custom-error");
  element.parentNode.classList.remove("custom-success");
}

function setNumberFormGroupToSuccess(selector) {
  const element = document.querySelector(selector);
  element.classList.remove("custom-error");
  element.classList.add("custom-success");
  element.parentNode.classList.remove("custom-error");
  element.parentNode.classList.add("custom-success");
}

function setNumberFormGroupToNormal(selector) {
  const element = document.querySelector(selector);
  element.classList.remove("custom-error");
  element.classList.remove("custom-success");
  element.parentNode.classList.remove("custom-error");
  element.parentNode.classList.remove("custom-success");
}

function forceBlurIos() {
  if (!isIos()) {
    return;
  }
  let input = document.createElement("input");
  input.setAttribute("type", "text");
  // Insert to active element to ensure scroll lands somewhere relevant
  document.activeElement.prepend(input);
  input.focus();
  input.parentNode.removeChild(input);
}

function isIos() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function checkAndUpdateButtonStatus() {
  /* Disable / enable submit button depend on update.canGetPrime  */
  /* ============================================================ */

  // update.canGetPrime === true
  //     --> you can call TPDirect.card.getPrime()
  submitButton = document.querySelector(".reserve");
  if (
    TPDirect.card.getTappayFieldsStatus().canGetPrime &&
    nameValid &&
    phoneValid &&
    emailValid
  ) {
    submitButton.style.cursor = "pointer";
    submitButton.style.opacity = 1;
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.style.cursor = "not-allowed";
    submitButton.style.opacity = 0.65;
    submitButton.setAttribute("disabled", true);
  }
}
