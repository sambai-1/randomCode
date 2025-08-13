from flask import Flask, request, jsonify, send_from_directory, request
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.sqlite import JSON
from datetime import datetime, timezone

app = Flask(__name__)

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
#DB_PATH = os.path.join(BASE_DIR, "instance", "poker.db")
DB_PATH = os.path.join(BASE_DIR, "poker.db")

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_PATH}"
## app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///poker.db'
db = SQLAlchemy(app)

class Player(db.Model):
  __tablename__ = "Player" 
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
  
class myDict(db.Model):
  __tablename__ = "myDict" 
  key = db.Column(db.String(200), primary_key = True)
  valueInt = db.Column(db.Integer, default=0, nullable=False)
  valueJSON = db.Column(JSON, default=list, nullable=False)

  def to_dict(self):
    return {
      "key": self.key,
      "valueInt": self.valueInt,
      "valueJSON": self.valueJSON
    }

  @classmethod
  def getInt(cls, key):
    row = cls.query.get(key)
    return row.valueInt if row else None

  @classmethod
  def putInt(cls, key, val):
    row = cls.query.get(key)
    if row:
        row.valueInt = val
    else:
        row = cls(key=key, valueInt=val)
        db.session.add(row)
    db.session.commit()

  @classmethod
  def getJSON(cls, key):
    row = cls.query.get(key)
    return row.valueJSON if row else None

  @classmethod
  def putJSON(cls, key, val):
    row = cls.query.get(key)
    if row:
        row.valueJSON = val
    else:
        row = cls(key=key, valueJSON=val)
        db.session.add(row)
    db.session.commit()

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

@app.route("/api/createGame", methods=['POST', 'GET'])
def createGame():
  if request.method == 'POST':
    data = request.get_json() or {}
    buyIn = data["buyIn"]
    smallBlind = data["smallBlind"]
    bigBlind = data["bigBlind"]
    players = data["toPlay"]

    # app.logger.info("testing players list: %r", players)
    # return jsonify(success=False, error=f"Unknown player id"), 404
    # ok so players is currently a list of Nones


    myDict.putInt("smallBlind", smallBlind)
    myDict.putInt("buyIn", buyIn)
    myDict.putInt("bigBlind", bigBlind)
    myDict.putJSON("players", players)

    for i in players:
      player = Player.query.get(i)

      if player is None:
        app.logger.error("No Player with id=%r", i)
        return jsonify(success=False, error=f"Unknown player id {i}"), 404
      
      player.chips = player.chips - buyIn
    
    db.session.commit()
    return jsonify(success=True)

  else:
    playerNames = {}
    # app.logger.info("testinggetJson %r", myDict.getJSON("players"))
    for i in myDict.getJSON("players"):
       playerNames[Player.query.get(i).name] = i
    
    # app.logger.info("player2ID dict %r", playerNames)

    dict = {
      "buyIn": myDict.getInt("buyIn"), 
      "smallBlind": myDict.getInt("smallBlind"),
      "bigBlind": myDict.getInt("bigBlind"),
      "players2ID": playerNames
    }

    app.logger.info("dict %r", dict)
    return jsonify(dict)

@app.route("/api/getPlayerIdDict", methods=['GET'])
def getPlayerIdDict():
  items = Player.query.all()
  dict = {item.name: item.id for item in items}
  # app.logger.error("current Dictionary is %r", dict)
  return jsonify(dict)

@app.route("/api/getPlayers", methods=['POST', 'GET'])
def getPlayers():
  if request.method == 'POST':
    pass
  else:
    players = Player.query.order_by(Player.name).all()
    return jsonify([player.to_dict() for player in players])
  
@app.route("/api/getGameDefaults", methods=['GET'])
def getGameDefaults():
  #dictItems = myDict.query.all()
  #dictList = [item.to_dict() for item in dictItems]
  #dict = {item['key'], item.['valueInt'] for item in dictList}
  dict = {
    "buyIn": myDict.getInt("buyIn"), 
    "smallBlind": myDict.getInt("smallBlind"),
    "bigBlind": myDict.getInt("bigBlind"),
  }
  return dict
  
@app.route("/api/countPlayers", methods=['GET'])
def countPlayers():
  total = Player.query.count()
  return jsonify({"totalPlayers": total})

if __name__=="__main__":
  app.run(debug=True)

  # <Route path="*" element={<NoPage />} />