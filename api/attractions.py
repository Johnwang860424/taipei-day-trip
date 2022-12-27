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
                                "id": result[item]["id"],
                                "name": result[item]["name"],
                                "category": result[item]["category"],
                                "description": result[item]["description"],
                                "address": result[item]["address"],
                                "transport": result[item]["transport"],
                                "mrt": result[item]["mrt"],
                                "lat": result[item]["lat"],
                                "lng": result[item]["lng"],
                                "images": result[item]["images"].split(',')
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
                                "id": result[item]["id"],
                                "name": result[item]["name"],
                                "category": result[item]["category"],
                                "description": result[item]["description"],
                                "address": result[item]["address"],
                                "transport": result[item]["transport"],
                                "mrt": result[item]["mrt"],
                                "lat": result[item]["lat"],
                                "lng": result[item]["lng"],
                                "images": result[item]["images"].split(",")
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
        if result[0]["id"] == None:
            return {"error": True,
                    "message": "non-existent id"}, 500
        return {"data": {
                "id": result[0]["id"],
                "name": result[0]["name"],
                "category": result[0]["category"],
                "description": result[0]["description"],
                "address": result[0]["address"],
                "transport": result[0]["transport"],
                "mrt": result[0]["mrt"],
                "lat": result[0]["lat"],
                "lng": result[0]["lng"],
                "images": result[0]["images"].split(",")}}
    return {"error": True,
            "message": "Unexpected Error"}, 500
    
# 取得所有的景點分類名稱列表
@attractions.get("/api/categories")
def category():
    if not request.query_string:
        result = Category.get_category()
        if result:
            return {"data": [name["category"] for name in result]}
        return jsonify({"error": True,
                        "message": "Unexpected Error"}), 500
    elif request.query_string:
        return jsonify({"error": True,
                        "message": "Do not input any query parameters"}), 500