"use strict";

const goalsContainer =
    document.getElementById("goalsContainer");

const goals = getGoals();


/*
=========================================================
NO GOALS
=========================================================
*/

if (goals.length === 0) {

    goalsContainer.innerHTML = `
        <p class="no-goals">
            No goals available to update.
        </p>
    `;

}


/*
=========================================================
DISPLAY GOALS
=========================================================
*/

else {

    goals.forEach(function (goal) {

        const goalForm =
            document.createElement("form");

        goalForm.className =
            "goal-update-card";

        goalForm.innerHTML = `
            <h3>
                ${goal.text}
            </h3>

            <p>
                Current progress:
                <strong>
                    ${goal.progress}%
                </strong>
            </p>

            <label>
                Add progress (%)
            </label>

            <input
                type="number"
                class="progress-input"
                value="1"
                min="1"
                max="100"
            >

            <button type="submit">
                Update
            </button>
        `;


        /*
        =================================================
        UPDATE GOAL
        =================================================
        */

        goalForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const input =
                    goalForm.querySelector(
                        ".progress-input"
                    );

                const amount =
                    Number(input.value);


                /*
                -----------------------------------------
                CHECK VALUE
                -----------------------------------------
                */

                if (
                    isNaN(amount) ||
                    amount <= 0
                ) {

                    alert(
                        "Please enter a positive number."
                    );

                    return;
                }


                /*
                -----------------------------------------
                ADD TO CURRENT PROGRESS
                -----------------------------------------
                */

                let newProgress =
                    Number(goal.progress) + amount;


                /*
                -----------------------------------------
                MAXIMUM = 100%
                -----------------------------------------
                */

                newProgress =
                    Math.min(
                        100,
                        newProgress
                    );


                /*
                -----------------------------------------
                SAVE
                -----------------------------------------
                */

                updateGoalProgress(
                    goal.id,
                    newProgress
                );


                /*
                -----------------------------------------
                GO BACK TO MAIN PAGE
                -----------------------------------------
                */

                window.location.href =
                    "main.html";

            }
        );


        goalsContainer.appendChild(goalForm);

    });

}