"use strict";

const goalsContainer = document.getElementById("goalsContainer");

const goals = getGoals();

if (goals.length === 0) {

    goalsContainer.innerHTML = `
        <p class="no-goals">
            You don't have any goals yet.
        </p>
    `;

} else {

    goals.forEach(function (goal) {

        const goalCard = document.createElement("div");

        goalCard.className = "goal-card";

        goalCard.innerHTML = `
            <h3>${goal.text}</h3>

            <p>
                Progress: ${goal.progress}%
            </p>

            <p>
                Status:
                ${goal.completed ? "Completed" : "In progress"}
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


// Delete a goal
document.addEventListener("click", function (event) {

    if (!event.target.classList.contains("delete-goal")) {
        return;
    }

    const goalId = Number(event.target.dataset.id);

    deleteGoal(goalId);

    window.location.reload();

});