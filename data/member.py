from data import connection
import mysql.connector

class SignUp:
    def post(name, email, password):
        try:
            signup_connection = connection.get_connection()
            with signup_connection.cursor() as cursor:
                signup_info = ("INSERT INTO member(name, email, password)"
                                "VALUES(%s, %s, %s)")
                cursor.execute(signup_info, (name, email, password))
                signup_connection.commit()
            return True
        except mysql.connector.Error:
            return False
        except Exception:
            return None
        finally:
            signup_connection.close()

class Signin:
    def get():
        return True
    def put(email, password):
        try:
            signin_connection = connection.get_connection()
            with signin_connection.cursor() as cursor:
                signin_info = ("""SELECT id, email, password 
                               FROM member
                               WHERE email = %s AND password = %s""")
                cursor.execute(signin_info, (email, password))
                result = cursor.fetchone()
            if result:
                return result
            else:
                return False
        except Exception:
            return None
        finally:
            signin_connection.close()
    def delete():
        return True