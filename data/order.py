from data import connection


class Order:
    def get():
        pass

    def post(status: bool, memberid: int, order_number: str, orderid: list, name: str, email: str, phone: str):
        try:
            order_connection = connection.get_connection()
            with order_connection.cursor() as cursor:
                order_query = ("""UPDATE booking
                                   SET orderstatus = %s
                                   WHERE memberid = %s""")
                cursor.execute(order_query, (status, memberid))
                sql = "INSERT INTO `order` (ordernumber, orderid, name, email, phone) VALUES (%s, %s, %s, %s, %s)"
                values = list(
                    map(lambda x: (order_number, x, name, email, phone), orderid))
                cursor.executemany(sql, values)
                order_connection.commit()
                return cursor.rowcount
        except Exception as e:
            return False
        finally:
            order_connection.close()
