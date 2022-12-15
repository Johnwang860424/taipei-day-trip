const message = document.querySelector(".welcome__text");
const container = document.querySelector(".container");
const deleteBtn = document.getElementsByClassName("attraction__delete");
let totalPrice = 0;

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
    const payment = `<div class="box">
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
                            <label for="card">卡片號碼：</label>
                            <input type="text" id="card" placeholder="**** **** **** ****" />
                        </div>
                        <div class="infor__input">
                            <label for="date">過期時間：</label>
                            <input type="text" id="date" placeholder="MM/YY" />
                        </div>
                        <div class="infor__input">
                            <label for="verification ">驗證密碼：</label>   <input type="password" id="verification" placeholder="CVV" />
                        </div>
                    </div>
                    <div class="box" style="text-align: end">
                        <div style="margin-bottom: 25px">
                        總價：新台幣 <span class="price">${totalPrice}</span> 元
                        </div>
                        <button class="reserve">確認訂購並付款</button>
                    </div>`;
    container.insertAdjacentHTML("beforeend", payment);
  } else if (response.data === null) {
    document.querySelector("footer").style.height = "65vh";
    document.querySelector(".footer-text").style.cssText =
      "position: relative; bottom: 40%;";
    const code = `<span class="welcome__text" style="margin-top:35px;font-weight:500;font-size:16px">目前沒有任何預定行程</span>`;
    message.insertAdjacentHTML("afterend", code);
  }
}
