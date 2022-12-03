const url = `/api${location.pathname}`;
const background = document.querySelector(".section-top--left");
const attractionName = document.querySelector(".section-top--right---title");
const description = document.querySelector(".section-bottom");
const radioBtns = document.querySelectorAll("input[name='time']");
const result = document.querySelector(".price");
let slideIndex = 1;

data(url, mainContent);

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
