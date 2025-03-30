from flask import Flask, render_template
import psycopg2

app = Flask(__name__)

@app.route("/")
def home():
    tasks = ["Buy groceries", "Finish project", "Clean desk"]

    return render_template("tasks.html", tasks=tasks)

if __name__ == "__main__":
    app.run(debug=True)