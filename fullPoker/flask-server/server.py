from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(
  __name__,
  static_folder="../frontend/build",
  static_url_path="/"
)

# Simple echo API
@app.route("/api/echo", methods=["POST"])
def echo():
  data = request.get_json() or {}
  return jsonify(text=data.get("text",""))

# Serve React build for any other route
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
  full = os.path.join(app.static_folder, path)
  if path and os.path.exists(full):
      return send_from_directory(app.static_folder, path)
  return send_from_directory(app.static_folder, "index.html")

if __name__=="__main__":
  app.run(debug=True)

  # <Route path="*" element={<NoPage />} />