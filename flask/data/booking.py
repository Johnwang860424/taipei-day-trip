from data import connection

class Booking:
    def get(jwt: dict):
        try:
            booking_connection = connection.get_connection()
            with booking_connection.cursor(dictionary=True) as cursor:
                 booking_query = ("""SELECT attraction.id, name, address, image, orderid, date, time, price, orderstatus
                                    FROM attraction
                                    JOIN image
                                    ON attraction.id = image.id
                                    AND image.order = 1
                                    JOIN booking
                                    ON attraction.id = booking.attractionid
                                    WHERE memberid = %s
                                    AND orderstatus = 0;""")
                 cursor.execute(booking_query, (jwt["id"],))
                 return cursor.fetchall()
        except Exception:
            return False
        finally:
            booking_connection.close()
    
    def post(data: dict):
        try:
            booking_connection = connection.get_connection()
            with booking_connection.cursor() as cursor:
                booking_query = ("""INSERT IGNORE INTO booking(memberid, attractionid, date, time, price) VALUES(%s, %s, %s, %s, %s)""")
                cursor.execute(booking_query, (data["id"], data["attractionId"], data["date"], data["time"], data["price"]))
                booking_connection.commit()
                return cursor.rowcount
        except Exception:
            return False
        finally:
            booking_connection.close()
    
    def delete(data: dict):
        booking_connection = connection.get_connection()
        try:
            with booking_connection.cursor() as cursor:
                booking_query = ("""DELETE FROM booking
                                    WHERE orderid = %s
                                    AND memberid = %s""")
                cursor.execute(booking_query, (data["orderid"], data["id"]))
                booking_connection.commit()
                if cursor.rowcount == 1:
                    return True
                return False
        except Exception:
            return False
        finally:
            booking_connection.close()
            
            