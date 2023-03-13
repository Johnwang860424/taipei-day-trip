from dotenv import load_dotenv
from mysql.connector.pooling import MySQLConnectionPool
from flask import jsonify
from flask import request
from flask import Blueprint
import os

load_dotenv()

connection = MySQLConnectionPool(user=os.getenv("DB_USER"),
                                password=os.getenv("DB_PASSWORD"),
                                host=os.getenv("DB_HOST"),
                                port=os.getenv("DB_PORT"),
                                database=os.getenv("DB_NAME"),
                                pool_name = "api",
                                pool_size=4)

from data.member import SignUp
from data.member import Signin 
from data.attractions import Attraction
from data.attractions import Category
from data.booking import Booking
from data.order import Order