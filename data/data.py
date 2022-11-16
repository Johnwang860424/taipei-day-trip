import json
import mysql.connector
import re
from password import password

connection = mysql.connector.connect(user="root",
                                    password=password,
                                    host="localhost",
                                    port="3306")

cursor = connection.cursor()
check = cursor.execute("CREATE DATABASE IF NOT EXISTS taipei_day_trip;")
cursor.close()
connection.config(database="taipei_day_trip")
connection.reconnect()
cursor = connection.cursor()
# Create attraction, category, image Tables
cursor.execute("CREATE TABLE IF NOT EXISTS attraction(\
                                        id INT PRIMARY KEY,\
                                        name VARCHAR(50),\
                                        category INT,\
                                        description VARCHAR(5100),\
                                        address VARCHAR(90),\
                                        transport VARCHAR(1100),\
                                        mrt VARCHAR(20),\
                                        lat DECIMAL(8,6),\
                                        lng DECIMAL(9,6));")
cursor.execute("CREATE TABLE IF NOT EXISTS category(\
                                            cat_id INT AUTO_INCREMENT PRIMARY KEY,\
                                            category VARCHAR(12) UNIQUE);")
cursor.execute("ALTER TABLE attraction ADD FOREIGN KEY(category) REFERENCES category(cat_id) ON UPDATE CASCADE;")
cursor.execute("CREATE TABLE IF NOT EXISTS image(\
                                            id INT,\
                                            image VARCHAR(120),\
                                            PRIMARY KEY(id, image),\
                                            FOREIGN KEY(id) REFERENCES attraction(id) ON DELETE CASCADE);")

# Get data of taipei-attractions
with open("../data/taipei-attractions.json", "r", encoding="utf-8") as f:
    data = json.loads(f.read())
    # data = json.load(f) 方法二

# Insert data into Tables
for item in data["result"]["results"]:
    insert_category = ("INSERT IGNORE INTO category(category) VALUES(%s)")
    cursor.execute(insert_category, (item["CAT"],))
    insert_attraction = ("INSERT IGNORE INTO attraction(id, name, description, address, transport, mrt, lat, lng) VALUES(%s, %s, %s, %s, %s, %s, %s, %s)")
    cursor.execute(insert_attraction, (item["_id"], item["name"], item["description"], item["address"], item["direction"], item["MRT"], item["latitude"], item["longitude"]))
    update_attraction_category = ("UPDATE attraction\
      SET category = (SELECT cat_id FROM category WHERE category = %s)\
      WHERE id = %s")
    cursor.execute(update_attraction_category, (item["CAT"], item["_id"]))
    for item["file"] in re.finditer(r"(http(s?):)([/|.|\w|\s-])*\.(?:jpg)", item["file"], flags=re.IGNORECASE):
        insert_image = ("INSERT IGNORE INTO image(id, image) VALUES(%s, %s)")
        cursor.execute(insert_image, (item["_id"], item["file"].group()))
        
# Reset the cat_id
cursor.execute("SET @count = 0;")
cursor.execute("UPDATE category SET cat_id = @count:= @count + 1;")

connection.commit()
