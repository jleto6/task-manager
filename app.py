from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import psycopg2
from datetime import datetime

app = Flask(__name__)
app.secret_key = "dev"  # Set a secret key for session
socketio = SocketIO(app)  # Initialize Socket.IO

@app.route("/", methods=["GET", "POST"])
def home():
    
    # On connect
    conn = psycopg2.connect(
        dbname="tasksdb",
        user="postgres",
        password="5238",  
        host="localhost",
        port="5432"
    )
    cur = conn.cursor()

    # Get all tasks
    cur.execute("SELECT id, description, start_time FROM tasks ORDER BY id ASC")
    tasks = cur.fetchall()

    # print(tasks)

    # when a POST is recieved 
    if request.method == "POST":
        data = request.get_json()
        action_type = data.get("type")

        if action_type == "text":
            text = data.get("text")
            if text:
                # Insert task into DB
                cur.execute("INSERT INTO tasks (description) VALUES (%s) RETURNING id;", (text,))
                id = cur.fetchone()[0]
                conn.commit()
                # Emit the task so the frontend can update
                socketio.emit("task", {
                    "id": id,
                    "description": text
                })

        elif action_type == "delete":
            id = data.get("id")
            #print(f"deleting {id}")
            if id:
                # Delete task with the id
                cur.execute("DELETE FROM tasks WHERE id = %s", (id,))
                conn.commit()

        elif action_type == "begin":
            id = data.get("id")
            if id:
                # Update the started column with current time
                time = datetime.now()
                cur.execute("UPDATE tasks SET start_time = %s WHERE id = %s", (time, id))
                conn.commit()
                # Emit the started time with its id
                socketio.emit("time", {
                    "id": id,
                    "time": time.isoformat()
                })

        return "", 204  # success, no content

    return render_template("tasks.html", tasks=tasks)

if __name__ == "__main__":
    app.run(debug=True)