import random
import sqlite3
import matplotlib.pyplot as plt
import datetime 
today = datetime.date.today()
import tkinter as tk
from tkinter import simpledialog


connection = sqlite3.connect('IN5.db')
cursor = connection.cursor()
cursor.execute("""CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,
username TEXT UNIQUE,
password TEXT)""")

cursor.execute("""CREATE TABLE IF NOT EXISTS goals(id INTEGER PRIMARY KEY,
goal TEXT,
user_id INTEGER,
progress INTEGER,
time_update INTEGER,
create_date TEXT,
last_update TEXT)""")





def register_account():
     username = simpledialog.askstring("REGISTER",
                                       "Choose a username:")     

     password = simpledialog.askstring("REGISTER",
                                       "Choose a password:",
                                       show="*") 
     try:
      cursor.execute("INSERT INTO users(username, password) VALUES(?,?)", (username, password))
      connection.commit()
      print("Account created!")
     except sqlite3.IntegrityError:
       print("Username alrady exists")



def login():


    
        

    username = simpledialog.askstring("LOGIN",
                                      "USERNAME:")
    password = simpledialog.askstring("LOGIN",
                                      "PASSWORD:",
                                      show="*")
    cursor.execute("SELECT id FROM users WHERE username = ? AND password = ?",(username, password))
    user = cursor.fetchone()
    if user:
        print("LOGIN successful!")
        return user[0]
    else:
        print("Wrong username or password")
    
        return None
def login_account():
    global current_user_id
    current_user_id = login()

    if current_user_id:
        welcome.destroy()
        open_main_app()


    
def add_goal():
    goal = simpledialog.askstring(
        "Add Goal",
        "What goal do you want to add?"
    )

    cursor.execute(
            """INSERT INTO goals(goal, progress, user_id, time_update, create_date, last_update) VALUES(?,?,?,?,?,?)""",
            ( goal, 0, current_user_id, 0, str(today), None)
        )

    connection.commit()
    print("Goal added successfully!")
       



from tkinter import simpledialog, messagebox          
def view_goal():
        cursor.execute("SELECT goal, progress, time_update FROM goals WHERE user_id = ?" , (current_user_id,))
        goals = cursor.fetchall()
        goals_window = tk.Toplevel(window)
        goals_window.title("My Goals:")
        if not goals:
            tk.Label(goals_window,
                     text="You have no goals yet.").pack(padx=20,pady=20)
            return
        for goal in goals:
            goal_text = f"{goal[0]} - {goal[1]}/{goal[2]} days completed"
            tk.Label(goals_window,
                     text=goal_text).pack(padx=20, pady=5)
            
            


    



def update_goal():
        
        
        goal_name = simpledialog.askstring("Update goal" ,
                                           "Which goal do you which to update")
        cursor.execute("SELECT * FROM goals WHERE goal = ? AND user_id = ?" , (goal_name, current_user_id))
        goal_data = cursor.fetchone()
        if goal_data is None:
           print("Goal not found!")
           return
        if goal_data[6] == str(today):
           print("You already uploaded this goal today!")
           return
        completed = simpledialog.askstring("Update",
                                           "Did you complete this goal today?")

        
           
        if completed == "yes":
         cursor.execute("UPDATE goals SET  progress = progress +1,time_update = time_update +1,last_update = ? WHERE id = ?" , 
                        (str(today), goal_data[0]))
         connection.commit() 
         print("Goal updated successfully!")
        else:
            cursor.execute("UPDATE goals SET time_update = time_update +1,last_update = ? WHERE id = ?", (str(today) , goal_data[0]))
            connection.commit()
            print("You can try again tomorrow!")

from tkinter import simpledialog
def delete_goal():
    
      goal_name = simpledialog.askstring("Delete goal",
                                         "Which goal do you want to delete?")
      cursor.execute("SELECT id FROM goals WHERE goal = ? AND user_id = ?", (goal_name, current_user_id ))
      goal_data = cursor.fetchone()
      if goal_data is None:
         print("Goal not found")
         return
      cursor.execute("DELETE FROM goals WHERE id = ?" , (goal_data[0],))

      connection.commit()
      print("Goal deleted successfully!")
def exit_app():
       window.destroy()

       
def view_progress():
       cursor.execute("SELECT * FROM goals WHERE user_id = ?", (current_user_id,))
       
       goals = cursor.fetchall()
       goal_names = []
       progress = []
       Completed = []
    
       for goal in goals:
          print(f"{goal[1]} : {goal[3]}/{goal[4]} days")

          goal_names.append(goal[1])
          Completed.append(goal[3])
          progress.append(goal[4])


       plt.bar(goal_names, progress, label="Total checkins")
       plt.bar(goal_names, Completed, label="Completed")
       plt.xlabel("Goals")
       plt.ylabel("Number of days")
       plt.title("IN5 progress")
       plt.legend()
       for i, value in enumerate(Completed):
            plt.text(i, value, f"{value}/{progress[i]}" , ha = "center")
       plt.show()
   
def open_main_app():
    global window
    
    window = tk.Tk()
    window.title("IN5")

    add_button = tk.Button(
                           window,
                           text="Add_goal",
                           command=add_goal
                           )
    add_button.pack()
    view_button = tk.Button(window,
                            text="View goals",
                            command=view_goal)
    view_button.pack()

    delete_button = tk.Button(window,
                          text = "Delete goal",
                          command = delete_goal)
    delete_button.pack()

    update_button = tk.Button(window,
                                  text="Update goal",
                                  command=update_goal)
    update_button.pack()
    exit_button = tk.Button(window,
                            text = "Exit app",
                            command = exit_app)
    exit_button.pack()
    progress_button = tk.Button(window,
                             text = "View progress",
                             command = view_progress)
    progress_button.pack()

    window.mainloop()


welcome = tk.Tk()
welcome.title("IN5")
title = tk.Label(welcome,
                 text="Welcome to IN5")
title.pack()
register_button = tk.Button(welcome,
                            text="REGISTER",
                            command=register_account)
register_button.pack()

login_button = tk.Button(welcome,
                          text="LOGIN",
                          command=login_account)
login_button.pack()
welcome.mainloop()



    
