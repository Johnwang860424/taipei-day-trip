const queryString = location.search;
const params = new URLSearchParams(queryString);
const orderNumber = params.get("ordernumber");
const order = document.querySelector("main :nth-child(3)");

if (!orderNumber) {
  location.href = "/";
}
order.textContent = orderNumber;
