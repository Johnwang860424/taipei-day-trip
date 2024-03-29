from flask import *
import api

app = Flask(__name__, static_folder="static", static_url_path="/static")
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["JSON_SORT_KEYS"] = False

# Pages


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")


if __name__ == '__main__':
    app.register_blueprint(api.attractions.attractions)
    app.register_blueprint(api.member.member)
    app.register_blueprint(api.booking.booking)
    app.register_blueprint(api.order.order)
    app.run(host="0.0.0.0", port=5000)
