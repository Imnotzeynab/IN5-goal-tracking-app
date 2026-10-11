

"use strict";

/*
=========================================================
SELECT PAGE ELEMENTS
=========================================================
*/

const goalsContainer =
    document.getElementById("goalsContainer");


/*
=========================================================
DISPLAY A MESSAGE
=========================================================
*/

function showMessage(message, className) {
    const paragraph = document.createElement("p");

    paragraph.className = className;
    paragraph.textContent = message;

    goalsContainer.replaceChildren(paragraph);
}


/*
=========================================================
LOAD AND DISPLAY GOALS
=========================================================
*/

function displayGoals() {

    // Check that the required HTML element exists.
    if (!goalsContainer) {
        console.error("The goals container was not found.");
        return;
    }

    // Check that goaldata.js loaded correctly.
    if (
        typeof getGoals !== "function" ||
        typeof updateGoalProgress !== "function"
    ) {
        showMessage(
            "Unable to load goal data. Please check goaldata.js.",
            "no-goals"
        );
        return;
    }

    let goals;

    try {
        goals = getGoals();
    } catch (error) {
        console.error("Could not load goals:", error);

        showMessage(
            "Unable to load your goals. Please try again.",
            "no-goals"
        );
        return;
    }

    // Validate the returned data.
    if (!Array.isArray(goals)) {
        showMessage(
            "Your goal data is invalid. Please check goaldata.js.",
            "no-goals"
        );
        return;
    }

    // Handle the case where there are no goals.
    if (goals.length === 0) {
        showMessage(
            "No goals available to update. Create a goal first!",
            "no-goals"
        );
        return;
    }

    const fragment = document.createDocumentFragment();

    /*
    =====================================================
    CREATE ONE UPDATE CARD PER GOAL
    =====================================================
    */

    goals.forEach(function (goal) {

        const card = document.createElement("form");
        card.className = "goal-update-card";

        // Goal title.
        const title = document.createElement("h3");
        title.textContent = goal.text || "Untitled goal";

        // Current progress.
        const progressText = document.createElement("p");
        progressText.append("Current progress: ");

        const progressValue = document.createElement("strong");

        const currentProgress = Number(goal.progress);
        const validProgress =
            Number.isFinite(currentProgress) &&
            currentProgress >= 0 &&
            currentProgress <= 100;

        progressValue.textContent = validProgress
            ? `${currentProgress}%`
            : "Invalid";

        progressText.appendChild(progressValue);

        // Label for the input.
        const label = document.createElement("label");
        const inputId = `progress-${String(goal.id)}`;

        label.htmlFor = inputId;
        label.textContent = "Add progress (%)";

        // Progress input.
        const input = document.createElement("input");

        input.type = "number";
        input.id = inputId;
        input.className = "progress-input";
        input.min = "1";
        input.max = "100";
        input.step = "1";
        input.value = "1";
        input.required = true;

        // Validation feedback.
        const feedback = document.createElement("p");
        feedback.className = "progress-feedback";
        feedback.setAttribute("aria-live", "polite");

        // Submit button.
        const button = document.createElement("button");

        button.type = "submit";
        button.textContent = "Update Progress";

        /*
        =================================================
        HANDLE PROGRESS UPDATE
        =================================================
        */

        card.addEventListener("submit", function (event) {

            event.preventDefault();

            // Ensure the goal has a valid ID and progress.
            if (
                goal.id === undefined ||
                goal.id === null ||
                goal.id === "" ||
                !validProgress
            ) {
                feedback.textContent =
                    "This goal has invalid data. Please check your saved goals.";

                return;
            }

            // Validate the entered amount.
            const amount = input.valueAsNumber;

            if (
                input.value.trim() === "" ||
                !Number.isFinite(amount) ||
                !Number.isInteger(amount) ||
                amount < 1 ||
                amount > 100
            ) {
                feedback.textContent =
                    "Enter a whole number between 1 and 100.";

                input.focus();
                return;
            }

            // Calculate the new progress.
            const newProgress = Math.min(
                100,
                currentProgress + amount
            );

            try {

                // Save using the existing goal-storage function.
                const result = updateGoalProgress(
                    goal.id,
                    newProgress
                );

                // If the storage function explicitly reports failure,
                // keep the user on this page.
                if (result === false) {
                    feedback.textContent =
                        "The update could not be saved. Please try again.";

                    return;
                }

                // Navigate only after the update completes.
                window.location.href = "main.html";

            } catch (error) {

                console.error("Could not update goal:", error);

                feedback.textContent =
                    "Something went wrong while saving. Please try again.";
            }
        });

        /*
        =================================================
        ASSEMBLE THE CARD
        =================================================
        */

        card.append(
            title,
            progressText,
            label,
            input,
            feedback,
            button
        );

        fragment.appendChild(card);
    });

    goalsContainer.replaceChildren(fragment);
}


/*
=========================================================
START THE PAGE
=========================================================
*/

displayGoals();


          

                
                -----------------------------------------
           
