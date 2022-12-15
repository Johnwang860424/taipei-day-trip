from data import connection

class SignUp:
    def post(name: str, email: str, password: str):     
        try:
            signup_connection = connection.get_connection()
            with signup_connection.cursor() as cursor:
                signup_info = ("INSERT IGNORE INTO member(name, email, password)"
                                "VALUES(%s, %s, %s)")
                cursor.execute(signup_info, (name, email, password))
                signup_connection.commit()
            return cursor.rowcount
        except Exception:
            return False
        finally:
            signup_connection.close()

class Signin:
    def get():
        return True
    def put(email: str):
        try:
            signin_connection = connection.get_connection()
            with signin_connection.cursor() as cursor:
                signin_info = ("""SELECT id, name, email, password 
                                    FROM member
                                    WHERE email = %s""")
                cursor.execute(signin_info, (email, ))
                result = cursor.fetchone()
                return result
        except Exception:
            return False
        finally:
            signin_connection.close()
    def delete():
        return True