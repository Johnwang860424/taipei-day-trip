import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

connection = mysql.connector.connect(user="root",
                                    password=os.getenv("PASSWORD"),
                                    host="localhost",
                                    database="taipei_day_trip",
                                    port="3306")

cursor = connection.cursor()
# Create member Table
cursor.execute("""CREATE TABLE
                  IF NOT EXISTS member(
                                       id INT AUTO_INCREMENT PRIMARY KEY,
                                       name VARCHAR(30) NOT NULL,
                                       email VARCHAR(254) NOT NULL UNIQUE,
                                       password VARCHAR(30) NOT NULL);""")