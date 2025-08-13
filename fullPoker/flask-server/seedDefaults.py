# seed_defaults.py
from server import app, db, myDict, Player

defaultInts = {"buyIn": 3000, "smallBlind": 10, "bigBlind": 20}
defaultJSONs = {"players": [1]}
RunOnce = ["a", "b", "c", "d", "e", "f"]

with app.app_context():
    db.drop_all()
    db.create_all()
    for k, v in defaultInts.items():
      if db.session.get(myDict, k) is None:
          db.session.add(myDict(key=k, valueInt=v))

    for k, v in defaultJSONs.items():
      if db.session.get(myDict, k) is None:
          db.session.add(myDict(key=k, valueJSON=v))

    for n in RunOnce:
      db.session.add(Player(name=n))
    db.session.commit()