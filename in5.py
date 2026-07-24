import random
import sqlite3
import matplotlib.pyplot as plt
import datetime 
today = datetime.date.today()
import tkinter as tk

connection = sqlite3.connect('IN5.db')
cursor = connection.cursor()

cursor.execute("""CREATE TABLE IF NOT EXISTS goals(id INTEGER PRIMARY KEY,
goal TEXT,
progress INTEGER,
time_update INTEGER,
create_date TEXT,
last_update TEXT)""")
cursor.execute("SELECT goal from goals WHERE last_update != ?", (str(today),))
goals_to_update = cursor.fetchall()
if goals_to_update:
 print("REMINDER!")
 print("You havent uploaded these goals today:")
 for goal in goals_to_update:
   print("-", goal[0])
 print()


            

from tkinter import simpledialog

def add_goal():
    goal = simpledialog.askstring(
        "Add Goal",
        "What goal do you want to add?"
    )

    if goal:
        cursor.execute(
            "INSERT INTO goals(goal, progress, time_update, create_date, last_update) VALUES(?,?,?,?,?)",
            (goal, 0, 0, str(today), None)
        )

        connection.commit()
        print("Goal added successfully!")
       



            
def view_goal():
        cursor.execute("SELECT goal FROM goals")
        goals = cursor.fetchall()
        for goal in goals:
            print(goal[0])


from tkinter import simpledialog
def update_goal():
        
        goal_name = simpledialog.askstring("Update goal" ,
                                           "Which goal do you which to update")
        cursor.execute("SELECT * FROM goals WHERE goal = ?" , (goal_name,))
        goal_data = cursor.fetchone()
        if goal_data is None:
           print("Goal not found!")
           return
        if goal_data[5] == str(today):
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
            print("It is okay! you can try again tomorrow.")

from tkinter import simpledialog
def delete_goal():
    
      goal_name = simpledialog.askstring("Delete goal",
                                         "Which goal do you want to delete?")
      cursor.execute("SELECT id FROM goals WHERE goal = ?", (goal_name, ))
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
       cursor.execute("SELECT * FROM goals")
       
       goals = cursor.fetchall()
       goal_names = []
       progress = []
       Completed = []
    
       for goal in goals:
          print(f"{goal[1]} : {goal[2]}/{goal[3]} days")

          goal_names.append(goal[1])
          Completed.append(goal[2])
          progress.append(goal[3])


       plt.bar(goal_names, progress, label="Total checkins")
       plt.bar(goal_names, Completed, label="Completed")
       plt.xlabel("Goals")
       plt.ylabel("Number of days")
       plt.title("IN5 progress")
       plt.legend()
       for i, value in enumerate(Completed):
            plt.text(i, value, f"{value}/{progress[i]}" , ha = "center")
       plt.show()
   

    
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
