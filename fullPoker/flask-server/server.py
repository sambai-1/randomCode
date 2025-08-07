from flask import Flask, request, jsonify, send_from_directory
import os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///poker.db'
db = SQLAlchemy(app)

class Player(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(200), nullable = False)
  chips = db.Column(db.Integer, default=0, nullable=False)
  date_created = db.Column(db.DateTime, default=datetime.now(timezone.utc))

  def __repr__(self):
    return '<User %r>' % self.name

# Serve React build for any other route
@app.route("/")
def index():
  return

if __name__=="__main__":
  app.run(debug=True)

  # <Route path="*" element={<NoPage />} />