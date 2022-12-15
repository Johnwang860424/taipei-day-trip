from dotenv import load_dotenv
from mysql.connector.pooling import MySQLConnectionPool
from flask import jsonify
from flask import request
from flask import Blueprint
import os

load_dotenv()

connection = MySQLConnectionPool(user="root",
                    password=os.getenv("PASSWORD"),
                    host="localhost",
                    port="3306",
                    database="taipei_day_trip",
                    pool_name = "api",
                    pool_size=4)

from data.member import SignUp
from data.member import Signin 
from data.attractions import Attraction
from data.attractions import Category
from data.booking import Booking