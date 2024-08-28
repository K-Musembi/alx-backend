#!/usr/bin/env python3
"""flask app module"""

from flask import Flask, render_template, request, g
from flask_babel import Babel, _
import pytz
from pytz import timezone, exceptions

app = Flask(__name__)


class Config:
    """configure languages"""
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)

babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> dict | None:
    """get user dictionary"""
    try:
        u_id = int(request.args.get('login_as'))
        return users.get(u_id)
    except (TypeError, ValueError):
        return None


@app.before_request
def before_request() -> None:
    """executed before request."""
    g.user = get_user()


def get_timezone() -> str:
    """get timezone"""
    param = request.args.get('timezone')
    if param:
        try:
            return timezone(param).zone
        except exceptions.UnknownTimeZoneError:
            ...

    if g.user:
        user = g.user.get('timezone')
        if user:
            try:
                return timezone(user).zone
            except exceptions.UnknownTimeZoneError:
                ...
    return 'UTC'


@babel.localeselector
def get_locale() -> str:
    """get region"""
    user_locale = request.args.get("locale")
    if user_locale in app.config["LANGUAGES"]:
        return user_locale
    if g.user and g.user['locale'] in app.config['LANGUAGES']:
        return g.user['locale']
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route("/", strict_slashes=False)
def index() -> str:
    """hello world route"""
    return render_template("7-index.html", get_locale=get_locale)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
