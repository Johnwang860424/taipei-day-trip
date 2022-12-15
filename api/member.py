from data import *
import datetime
from flask import make_response
import jwt
import re
from werkzeug.security import generate_password_hash, check_password_hash

member = Blueprint("member", __name__)

# Sign up member
@member.post("/api/user")
def signup():
    member_info = request.get_json()
    password_pattern = re.compile(r"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
    email_pattern = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
    if not member_info['name'] or not member_info['email'] or not member_info['password']:
        return jsonify({'error': True,
                        "message": "尚有內容未輸入"}), 400
    elif not password_pattern.match(member_info['password']):
        return jsonify({'error': True,
                        "message": "密碼至少包含1個英文及數字且至少8位數"}), 400
    elif not email_pattern.match(member_info['email']):
        return jsonify({'error': True,
                        "message": "請輸入正確的eamil格式"}), 400
    password = generate_password_hash(str(member_info['password']))
    result =  SignUp.post(str(member_info['name']), str(member_info['email']), password)
    if result == 1:
        return jsonify({"ok": True}), 200
    elif result == 0:
        return jsonify({'error': True,
                        "message": "重複的email"}), 400
    elif result == False:
        return jsonify({"error": True,
                        "message": "服務暫時關閉"}), 500

@member.get("/api/user/auth")
def auth_get():
    encoded_jwt = request.cookies.get("token")
    if encoded_jwt:
        decoded_jwt = jwt.decode(encoded_jwt, os.getenv("JWT_secret"), algorithms="HS256")
        return jsonify({"data":decoded_jwt})
    return jsonify({"data": None})

# Sign in member
@member.put("/api/user/auth")
def auth_put():
    member_info = request.get_json()
    if not member_info['email'] or not member_info['password']:
        return jsonify({'error': True,
                        "message": "尚有內容未輸入"}), 400
    result = Signin.put(member_info['email'])
    if result:
        password = member_info['password']
        if check_password_hash(result[3], password):
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
        else:
            return jsonify({'error': True,
                            "message": "帳號或密碼錯誤"}), 400
    elif not result:
        return jsonify({'error': True,
                        "message": "此帳號未註冊"}), 400
    elif result == False:
        return jsonify({'error': True,
                        "message": "服務暫時關閉"}), 500

@member.delete("/api/user/auth")
def auth_delete():
    data = jsonify({"ok": True})
    response = make_response(data)
    response.set_cookie("token", "", expires=0)
    return response