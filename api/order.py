from data import *
import datetime
import jwt
import json
import urllib.request
import urllib.parse

order = Blueprint("order", __name__)
order_end_number = 0


@order.get("/api/order/<orderNumber>")
def order_get():
    pass


@order.post("/api/orders")
def order_post():
    global order_end_number
    data = request.get_json()
    encoded_jwt = request.cookies.get("token")
    try:
        decoded_jwt = jwt.decode(encoded_jwt, os.getenv(
            "JWT_secret"), algorithms="HS256")
        total_price = 0
        orderid = []
        for item in data["order"]["trip"]:
            total_price += 2000 if item["time"] == "morning" else 2500
            orderid.append(item["orderid"])
        if total_price != int(data["order"]["price"]):
            return {"error": True,
                    "message": "價格輸入錯誤"}, 400
        order_infor = {
            "prime": data["prime"],
            "partner_key": os.getenv("Partner_Key"),
            "merchant_id": "wang860424_CTBC",
            "details": data["contact"]["name"],
            "amount": data["order"]["price"],
            "cardholder": {
                "phone_number": data["contact"]["phone"],
                "name": data["contact"]["name"],
                "email": data["contact"]["email"]
            },
            "remember": True
        }
        url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
        order_infor_json = json.dumps(order_infor)
        headers = {"x-api-key": os.getenv("Partner_Key"),
                   "Content-Type": "application/json"}
        req = urllib.request.Request(
            url, order_infor_json.encode("utf-8"), headers, method="POST")
        with urllib.request.urlopen(req) as response:
            response_data = response.read()
            response_text = response_data.decode()
            json_data = json.loads(response_text)
        if json_data["status"] != 0:
            return {
                "data": {
                    "payment": {
                        "status": json_data["status"],
                        "message": json_data["msg"]
                    }
                }
            }
        json_data["status"] = True if json_data["status"] == 0 else False
        time = datetime.datetime.now().strftime("%Y%m%d%H%M")
        order_number = f"{time}{order_end_number:04}"
        result = Order.post(json_data["status"], decoded_jwt["id"], order_number, orderid,
                            data["contact"]["name"], data["contact"]["email"], data["contact"]["phone"])
        order_end_number += 1
        if result > 0:
            return {
                "data": {
                    "number": order_number,
                    "payment": {
                        "status": 0,
                        "message": "付款成功"}
                }
            }
        elif result == False:
            return {"error": True,
                    "message": "伺服器內部錯誤"}, 500
        return {"error": True,
                "message": "訂購失敗"}, 400
    except jwt.exceptions.DecodeError:
        return {"error": True,
                "message": "未登入系統，拒絕存取"}, 403
    except Exception as e:
        return {"error": True,
                "message": "伺服器內部錯誤"}, 500
