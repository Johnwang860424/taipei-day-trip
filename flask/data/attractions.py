from data import connection

class Attraction:
    def get_attraction_page_keyword(page: int, keyword: str):
        try:
            attractions_connection = connection.get_connection()
            with attractions_connection.cursor(dictionary=True) as cursor:
                # query attractions
                cursor.execute('SET SESSION group_concat_max_len = 5000')
                attractions_query = ("""SELECT attraction.id,
                                               name,
                                               category.category,
                                               description,
                                               address,
                                               transport,
                                               mrt,
                                               lat,
                                               lng,
                                               GROUP_CONCAT(image separator ',') AS images
                                        FROM attraction
                                        JOIN category ON attraction.category = category.cat_id
                                        JOIN image ON attraction.id = image.id 
                                        WHERE category.category = %s 
                                            OR name LIKE %s 
                                        GROUP BY id 
                                        ORDER BY id
                                        LIMIT %s, 13""")
                cursor.execute(attractions_query, (keyword, f"%{keyword}%", int(page)*12))
                return cursor.fetchall()
        except Exception:
            return False
        finally:
            attractions_connection.close()
            
    def get_attraction_page(page: str):
        try:
            attractions_connection = connection.get_connection()
            with attractions_connection.cursor(dictionary=True) as cursor:
                # query attractions
                cursor.execute('SET SESSION group_concat_max_len = 5000')
                attractions_query = ("""SELECT attraction.id,
                                               name,
                                               category.category,
                                               description,
                                               address,
                                               transport,
                                               mrt,
                                               lat,
                                               lng,
                                               GROUP_CONCAT(image separator ',') AS images
                                        FROM attraction
                                        JOIN category ON attraction.category = category.cat_id
                                        JOIN image ON attraction.id = image.id 
                                        GROUP BY id
                                        ORDER BY id
                                        LIMIT %s, 13""")
                cursor.execute(attractions_query, (int(page)*12,))
                return cursor.fetchall()
        except Exception:
            return False
        finally:
            attractions_connection.close()
            
    def get_attraction_by_id(id: str):
        try:
            attraction_connection = connection.get_connection()
            with attraction_connection.cursor(dictionary=True) as cursor:
                cursor.execute('SET SESSION group_concat_max_len = 5000')
                attraction_query = ("""SELECT attraction.id,
                                              name,
                                              category.category,
                                              description,
                                              address,
                                              transport,
                                              mrt,
                                              lat,
                                              lng,
                                              GROUP_CONCAT(image separator ',') AS images
                                        FROM attraction 
                                        JOIN category ON attraction.category = category.cat_id 
                                        JOIN image ON attraction.id = image.id 
                                        WHERE attraction.id = %s""")
                cursor.execute(attraction_query, (id, ))
                return cursor.fetchall()
        except Exception:
            return False
        finally:
            attraction_connection.close()
            
class Category:
    def get_category():
        try:
            category_connection = connection.get_connection()
            with category_connection.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT category FROM category ORDER BY cat_id;")
                return cursor.fetchall()
        except Exception:
            return False
        finally:
            category_connection.close()