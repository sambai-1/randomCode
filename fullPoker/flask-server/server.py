from flask import Flask, request, jsonify, send_from_directory, request
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
  
  def to_dict(self):
    return {
      "id": self.id,
      "name": self.name,
      "chips": self.chips
    }

@app.route("/api/createPlayer", methods=['POST', 'GET'])
def createPlayer():
  if request.method == 'POST':
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    if not name:
        return jsonify(success=False, error="no name"), 400
    
    existing = Player.query.filter_by(name=name).first()
    if existing:
        return jsonify(success=False, error="user exists"), 200
    
    newPlayer = Player(name=name)
    db.session.add(newPlayer)
    db.session.commit()

    return jsonify(success=True)
  
  else:
    pass

@app.route("/api/getPlayers", methods=['POST', 'GET'])
def getPlayers():
  if request.method == 'POST':
    pass
  else:
    players = Player.query.order_by(Player.name).all()
    return jsonify([player.to_dict() for player in players])
  
@app.route("/api/countPlayers", methods=['GET'])
def countPlayers():
  total = Player.query.count()
  return jsonify({"totalPlayers": total})

if __name__=="__main__":
  app.run(debug=True)

  # <Route path="*" element={<NoPage />} />