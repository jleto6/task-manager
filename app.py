from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import psycopg2
from datetime import datetime, timedelta, time

app = Flask(__name__)
app.secret_key = "dev"  # Set a secret key for session
socketio = SocketIO(app)  # Initialize Socket.IO


# On connect

def get_db():
    conn = psycopg2.connect(
        dbname="tasksdb",
        user="postgres",
        password="5238",  
        host="localhost",
        port="5432"
    )
    cur = conn.cursor()

    return conn, cur

import os
import psycopg2

# def get_db():
#     DATABASE_URL = os.environ.get("DATABASE_URL")
#     conn = psycopg2.connect(DATABASE_URL)
#     cur = conn.cursor()
#     return conn, cur

@app.route("/", methods=["GET", "POST"])
def home():

    conn, cur = get_db()

    # Get all tasks
    cur.execute("SELECT id, description, start_time, completed_on FROM tasks ORDER BY id ASC")
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

        elif action_type== "complete":
            id = data.get("id")
            desc = data.get("desc")
            if id:
                # Update the started column with current time
                time = datetime.now()
                cur.execute("UPDATE tasks SET completed_on = %s WHERE id = %s", (time, id))
                cur.execute("UPDATE tasks SET description = %s WHERE id = %s", (desc, id))
                conn.commit()


        return "", 204  # success, no content

    return render_template("tasks.html", tasks=tasks)

@app.route("/history", methods=["GET", "POST"])
def history():
    conn, cur = get_db()

    # Get all tasks
    cur.execute("SELECT id, description, start_time, completed_on FROM tasks ORDER BY id ASC")
    tasks = cur.fetchall()

    week_ago = datetime.now() - timedelta(days=7)
    day_ago = datetime.now() - timedelta(days=1)
    start_of_today = datetime.combine(datetime.now(), time(6, 0))

    print("----")
    print(start_of_today)
    print("----")

    day_tasks = []
    week_tasks = []
    old_tasks = []

    for task in tasks:
        if task[3] is not None:
            print(task)
            if task[3] > start_of_today:
                day_tasks.append(task)
                
            if task[3] < week_ago:
                old_tasks.append(task)

    # tasks_with_values = [task for task in tasks if task[3] is not None] # List of tasks w completion dates
    # tasks_sorted = sorted(tasks_with_values, key=lambda x: x[3], reverse=True)


    return render_template("history.html", day_tasks=day_tasks, old_tasks=old_tasks)

# if __name__ == "__main__":
#     app.run(debug=True)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)