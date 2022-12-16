from data import *

attractions = Blueprint("attractions", __name__)
    
# 取得景點資料列表
@attractions.get("/api/attractions")
def attraction():
    if request.args.get("page") and request.args.get("keyword"):
        if not request.args.get("page").isnumeric():
            return {"error": True,
                            "message": "Can not input string in 'page'"}, 400
        elif request.args.get("keyword").isnumeric():
            return {"error": True,
                            "message": "Can not input number in 'keyword'"}, 400
        page = request.args.get("page")
        keyword = request.args.get("keyword")
        result = Attraction.get_attraction_page_keyword(page, keyword)
        if result:
            next_page = int(request.args.get("page"))+1 if 12 < len(result) else None
            length = 12 if next_page else len(result)
            return {
                    "nextPage": next_page,
                                "data": [{
                                "id": result[item][0],
                                "name": result[item][1],
                                "category": result[item][2],
                                "description": result[item][3],
                                "address": result[item][4],
                                "transport": result[item][5],
                                "mrt": result[item][6],
                                "lat": result[item][7],
                                "lng": result[item][8],
                                "images": result[item][9].split(',')
                                } for item in range(length)]
                }        
        elif not result:
            return {"nextPage": None,
                            "data": result}, 200  
        return {"error": True,
                        "message": "Unexpected Error"}, 500

    elif request.args.get("page"):
        if not request.args.get("page").isnumeric():
            return {"error": True,
                            "message": "Can not input string"}, 400
        page = request.args.get("page")
        result = Attraction.get_attraction_page(page)
        if result:
            next_page = int(request.args.get("page"))+1 if 12 < len(result) else None
            length = 12 if next_page else len(result)
            return {
                    "nextPage": next_page,
                                "data": [{
                                "id": result[item][0],
                                "name": result[item][1],
                                "category": result[item][2],
                                "description": result[item][3],
                                "address": result[item][4],
                                "transport": result[item][5],
                                "mrt": result[item][6],
                                "lat": result[item][7],
                                "lng": result[item][8],
                                "images": result[item][9].split(",")
                                } for item in range(length)]
                }
    return {"error": True,
            "message": "Without query string"}, 400

# 根據景點編號取得景點資料
@attractions.get("/api/attraction/<attractionId>")
def tourist_spots(attractionId):
    if not attractionId.isnumeric():
        return jsonify({"error": True,
                        "message": "Can not input string"}), 400
    result = Attraction.get_attraction_by_id(attractionId)
    if result:
        if result[0][0] == None:
            return {"error": True,
                    "message": "non-existent id"}, 500
        return {"data": {
                "id": result[0][0],
                "name": result[0][1],
                "category": result[0][2],
                "description": result[0][3],
                "address": result[0][4],
                "transport": result[0][5],
                "mrt": result[0][6],
                "lat": result[0][7],
                "lng": result[0][8],
                "images": result[0][9].split(",")}}
    return {"error": True,
            "message": "Unexpected Error"}, 500
    
# 取得所有的景點分類名稱列表
@attractions.get("/api/categories")
def category():
    if not request.query_string:
        result = Category.get_category()
        if result:
            return {"data": [name[0] for name in result]}
        return jsonify({"error": True,
                        "message": "Unexpected Error"}), 500
    elif request.query_string:
        return jsonify({"error": True,
                        "message": "Do not input any query parameters"}), 500