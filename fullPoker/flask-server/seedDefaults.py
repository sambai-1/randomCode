# seed_defaults.py
from server import app, db, myDict, Player

DEFAULTS = {"buyIn": 3000, "smallBlind": 10, "bigBlind": 20}
RunOnce = ["a", "b", "c", "d", "e", "f"]

with app.app_context():
    db.create_all()
    for k, v in DEFAULTS.items():
      if db.session.get(myDict, k) is None:
          db.session.add(myDict(key=k, valueInt=v))
    for n in RunOnce:
      db.session.add(Player(name=n))
    db.session.commit()