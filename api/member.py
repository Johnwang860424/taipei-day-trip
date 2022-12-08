from data import *
from flask import make_response
import jwt
import datetime

load_dotenv()

member = Blueprint("member", __name__)

# Sign up member
@member.post("/api/user")
def signup():
    member_info = request.get_json()
    if not member_info['name'] or not member_info['email'] or not member_info['password']:
        return jsonify({'error': True,
                        "message": "尚有內容未輸入"}), 400
    elif len(str(member_info['password'])) < 6:
        return jsonify({'error': True,
                        "message": "密碼不能小於6位數"}), 400
    elif '@' not in str(member_info['email']):
            return jsonify({'error': True,
                        "message": "請輸入正確的eamil格式"}), 400
    result =  SignUp.post(str(member_info['name']), str(member_info['email']), str(member_info['password']))
    if result:
        return jsonify({"ok": True}), 200
    elif result == False:
        return jsonify({'error': True,
                        "message": "重複的email"}), 400
    return jsonify({"error": True,
                    "message": "服務暫時關閉"}), 500

@member.get("/api/user/auth")
def auth_get():
    encoded_jwt = request.cookies.get("token")
    if encoded_jwt:
        decoded_jwt = jwt.decode(encoded_jwt, os.getenv("JWT_secret"), algorithms="HS256")
        return jsonify({"data":decoded_jwt})
    return jsonify({"data": None})

@member.put("/api/user/auth")
def auth_put():
    member_info = request.get_json()
    if not member_info['email'] or not member_info['password']:
        return jsonify({'error': True,
                        "message": "尚有內容未輸入"}), 400
    result = Signin.put(member_info['email'], member_info['password'])
    if result:
        encoded_jwt = jwt.encode({"id": result[0],
                                  "name": result[1],
                                  "email": result[2],
                                  "nbf":datetime.datetime.now(tz=datetime.timezone.utc),
                                  "exp": datetime.datetime.now(tz=datetime.timezone.utc)+datetime.timedelta(days=7)},
                                  os.getenv("JWT_secret"),
                                  algorithm="HS256")
        data = jsonify({"ok": True})
        response = make_response(data, 200)
        response.set_cookie("token", encoded_jwt, httponly=True)
        return response
    elif result == False:
        return jsonify({'error': True,
                        "message": "帳號或密碼錯誤"}), 400
    elif result == None:
        return jsonify({'error': True,
                        "message": "服務暫時關閉"}), 500

@member.delete("/api/user/auth")
def auth_delete():
    data = jsonify({"ok": True})
    response = make_response(data)
    response.set_cookie("token", "", expires=0)
    return response