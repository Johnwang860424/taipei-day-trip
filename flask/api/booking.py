from data import *
import datetime
import jwt
import datetime

booking = Blueprint("booking", __name__)

@booking.get("/api/booking")
def booking_get():
    encoded_jwt = request.cookies.get("token")
    try:
        decoded_jwt = jwt.decode(encoded_jwt, os.getenv("JWT_secret"), algorithms="HS256")
        result = Booking.get(decoded_jwt)
        if result:
            return {"data":[{"attraction": {
                             "id": result[item]["id"],
                             "name": result[item]["name"],
                             "address": result[item]["address"],
                             "image": result[item]["image"]
                             },
                            "orderid": result[item]["orderid"],
                            "date": result[item]["date"].strftime("%Y-%m-%d"),
                            "time": result[item]["time"],
                            "price": result[item]["price"]} for item in range(len(result))]
                    }, 200
        elif not result:
            return {"data": None}, 200
        elif result == False:
            return {"error": True,
                    "message": "伺服器內部錯誤"}, 500
    except jwt.exceptions.DecodeError:
        return {"error": True,
                "message": "未登入系統，拒絕存取"}, 403

@booking.post("/api/booking")
def booking_post():
    data = request.get_json()
    if not data["attractionId"] or not data["date"] or not data["time"] or not data["price"]:
        return {"error": True,
                "message": "尚有內容未輸入"}, 400
    elif isinstance(data["attractionId"], str) and isinstance(data["price"], str):
        return {"error": True,
                "message": "景點或價格型別有誤"}, 400
    elif ("morning", 2000) not in {data["time"]: data["price"]}.items() and("afternoon", 2500) not in {data["time"]: data["price"]}.items():
        return {"error": True,
                "message": "時間或價格錯誤"}, 400
    else:
        encoded_jwt = request.cookies.get("token")
        try:
            date = datetime.date.fromisoformat(data["date"])
            if date > datetime.date.today():
                decoded_jwt = jwt.decode(encoded_jwt, os.getenv("JWT_secret"), algorithms="HS256")
                new_data = data | decoded_jwt
                result = Booking.post(new_data)
                if result == 1:
                    return {"ok": True}, 200
                elif result == 0:
                    return {"error": True,
                            "message": "景點id錯誤"}, 400
                return {"error": True,
                        "message": "伺服器內部錯誤"}, 500
            return {"error": True,
                    "message": "必須輸入未來的日期"}, 400
        except ValueError:
            return {"error": True,
                    "message": "日期型別錯誤"}, 400
        except jwt.exceptions.DecodeError:
            return {"error": True,
                    "message": "未登入系統，拒絕存取"}, 403

@booking.delete("/api/booking")
def booking_delete():
    orderid = request.get_json()
    encoded_jwt = request.cookies.get("token")
    try:
        decoded_jwt = jwt.decode(encoded_jwt, os.getenv("JWT_secret"), algorithms="HS256")
        data = orderid | decoded_jwt
        result = Booking.delete(data)
        if result:
            return {"ok": True}, 200
        elif result == False:
            return {"error": True,
                    "message": "伺服器內部錯誤"}, 500
    except jwt.exceptions.DecodeError:
        return {"error": True,
                "message": "未登入系統，拒絕存取"}, 403




