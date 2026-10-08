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
            You don't have any goals to delete.
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

        const goalCard =
            document.createElement("div");

        goalCard.className = "goal-card";

        goalCard.innerHTML = `
            <h3>
                ${goal.text}
            </h3>

            <p>
                Progress: ${goal.progress}%
            </p>

            <p>
                Status:
                ${goal.completed
                    ? "Completed"
                    : "In progress"}
            </p>

            <button
                type="button"
                class="delete-goal"
                data-id="${goal.id}">
                Delete
            </button>
        `;

        goalsContainer.appendChild(goalCard);

    });

}


/*
=========================================================
DELETE SELECTED GOAL
=========================================================
*/

document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-goal")) {
        return;
    }

    const goalId =
        Number(event.target.dataset.id);


    /*
    -----------------------------------------------------
    CONFIRM DELETION
    -----------------------------------------------------
    */

    const goal =
        getGoal(goalId);

    if (!goal) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${goal.text}"?`
    );

    if (!confirmed) {
        return;
    }


    /*
    -----------------------------------------------------
    DELETE
    -----------------------------------------------------
    */

    deleteGoal(goalId);


    /*
    -----------------------------------------------------
    RETURN TO MAIN PAGE
    -----------------------------------------------------
    */

    window.location.href = "main.html";

});