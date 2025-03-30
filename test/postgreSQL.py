import psycopg2

conn = psycopg2.connect(
    dbname="tasksdb",
    user="postgres",
    password="5238",  # <- use your actual password
    host="localhost",
    port="5432"
)

cur = conn.cursor()

# Insert a task
cur.execute(
    "INSERT INTO tasks (title) VALUES (%s)",
    ("Buy groceries",)
)

# Read all tasks
cur.execute("SELECT * FROM tasks")
rows = cur.fetchall()

for row in rows:
    print(row)

conn.commit()
cur.close()
conn.close()