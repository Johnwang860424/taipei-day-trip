from flask import jsonify
from flask import request
from flask import Blueprint
from mysql.connector.pooling import MySQLConnectionPool
from data.password import password

connection = MySQLConnectionPool(user="root",
                    password=password,
                    host="localhost",
                    port="3306",
                    database="taipei_day_trip",
                    pool_name = "api",
                    pool_size=1)

app2 = Blueprint("app2", __name__)
    
# 取得景點資料列表
@app2.route("/api/attractions")
def attractions():
    if request.args.get("page") and request.args.get("keyword"):
        try:
            attractions_connection = connection.get_connection()
            with attractions_connection.cursor() as cursor:
                # query attractions
                cursor.execute('SET SESSION group_concat_max_len = 5000')
                attractions_query = ("SELECT attraction.id, name, category.category, description, address, transport, mrt, lat, lng, GROUP_CONCAT(image separator ',')\
                FROM attraction\
                JOIN category ON attraction.category = category.cat_id\
                JOIN image ON attraction.id = image.id \
                WHERE category.category = %s \
                OR name LIKE %s \
                GROUP BY id \
                ORDER BY id\
                LIMIT %s, 13")
                cursor.execute(attractions_query, (request.args.get("keyword"), f"%{request.args.get('keyword')}%", int(request.args.get("page"))*12))
                attractions_result = cursor.fetchall()
        except:
            if not attractions_result:
                return jsonify({"nextPage": None,
                                "data": attractions_result}), 200
            elif not request.args.get("page").isnumeric():
                return jsonify({"error": True,
                                "message": "Can not input string in 'page'"}), 400
            elif request.args.get("keyword").isnumeric():
                return jsonify({"error": True,
                                "message": "Can not input number in 'keyword'"}), 400
            return jsonify({"error": True,
                            "message": "Unexpected Error"}), 500
        finally:
            attractions_connection.close()
        page = int(request.args.get("page"))+1 if 12 < len(attractions_result) else None
        length = 12 if page else len(attractions_result)
        return jsonify({
            "nextPage": page,
                        "data": [{
                        "id": attractions_result[item][0],
                        "name": attractions_result[item][1],
                        "category": attractions_result[item][2],
                        "description": attractions_result[item][3],
                        "address": attractions_result[item][4],
                        "transport": attractions_result[item][5],
                        "mrt": attractions_result[item][6],
                        "lat": attractions_result[item][7],
                        "lng": attractions_result[item][8],
                        "img": attractions_result[item][9].split(',')
                        } for item in range(length)]
            })
    elif request.args.get("page"):
        try:
            attractions_connection = connection.get_connection()
            with attractions_connection.cursor() as cursor:
                # query attractions
                cursor.execute('SET SESSION group_concat_max_len = 5000')
                attractions_query = ("SELECT attraction.id, name, category.category, description, address, transport, mrt, lat, lng, GROUP_CONCAT(image separator ',') \
                FROM attraction \
                JOIN category ON attraction.category = category.cat_id \
                JOIN image ON attraction.id = image.id \
                GROUP BY id\
                ORDER BY id \
                LIMIT %s, 13")
                cursor.execute(attractions_query, (int(request.args.get("page"))*12,))
                attractions_result = cursor.fetchall()
        except:
            if not attractions_result:
                return jsonify({"nextPage": None,
                                "data": attractions_result}), 200
            elif not request.args.get("page").isnumeric():
                return jsonify({"error": True,
                                "message": "Can not input string"}), 400
            return jsonify({"error": True,
                            "message": "Unexpected Error"}), 500
        finally:
            attractions_connection.close()
        page = int(request.args.get("page"))+1 if 12 < len(attractions_result) else None
        length = 12 if page else len(attractions_result)
        return jsonify({
            "nextPage": page,
                        "data": [{
                        "id": attractions_result[item][0],
                        "name": attractions_result[item][1],
                        "category": attractions_result[item][2],
                        "description": attractions_result[item][3],
                        "address": attractions_result[item][4],
                        "transport": attractions_result[item][5],
                        "mrt": attractions_result[item][6],
                        "lat": attractions_result[item][7],
                        "lng": attractions_result[item][8],
                        "img": attractions_result[item][9].split(",")
                        } for item in range(length)]
            })
    return jsonify({"error": True,
                    "message": "Without query string"}), 400

# 根據景點編號取得景點資料
@app2.route("/api/attraction/<attractionId>", methods=["GET"])
def attraction(attractionId):
    try:
        attraction_connection = connection.get_connection()
        with attraction_connection.cursor() as cursor:
            attraction_query = ("SELECT attraction.id, name, category.category, description, address, transport, mrt, lat, lng, GROUP_CONCAT(image separator ',') \
            FROM attraction \
            JOIN category ON attraction.category = category.cat_id \
            JOIN image ON attraction.id = image.id \
            WHERE attraction.id = %s")
            cursor.execute(attraction_query, (attractionId,))
            data = cursor.fetchall()
        return jsonify({"data": {
                        "id": data[0][0],
                        "name": data[0][1],
                        "category": data[0][2],
                        "description": data[0][3],
                        "address": data[0][4],
                        "transport": data[0][5],
                        "mrt": data[0][6],
                        "lat": data[0][7],
                        "lng": data[0][8],
                        "images": data[0][9].split(",")}})
    except:
        if attractionId.isnumeric():
            return jsonify({"error": True,
                            "message": "Invalid attractionId"}), 400
        elif not attractionId.isnumeric():
            return jsonify({"error": True,
                            "message": "Can not input string"}), 400
        return jsonify({"error": True,
                        "message": "Unexpected Error"}), 500
    finally:
        attraction_connection.close()
    
# 取得所有的景點分類名稱列表
@app2.route("/api/categories", methods=["GET"])
def category():
    if not request.query_string:
        try:
            category_connection = connection.get_connection()
            with category_connection.cursor() as cursor:
                cursor.execute("SELECT category FROM category ORDER BY cat_id;")
                data = cursor.fetchall()
            return jsonify({"data": [name[0] for name in data]})
        except:
            return jsonify({"error": True,
                            "message": "Unexpected Error"}), 500
        finally:
            category_connection.close()
    elif request.query_string:
        return jsonify({"error": True,
                        "message": "Do not input any query parameters"}), 500