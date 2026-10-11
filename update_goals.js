

             
    
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
DISPLAY MESSAGES
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
LOAD AND DISPLAY SAVED GOALS
=========================================================
*/

function displayGoals() {

    if (!goalsContainer) {
        console.error("Goals container not found.");
        return;
    }

    // Check that goaldata.js has loaded.
    if (
        typeof getGoals !== "function" ||
        typeof updateGoalProgress !== "function"
    ) {

        showMessage(
            "Goal data could not be loaded. Check goaldata.js.",
            "no-goals"
        );

        return;
    }

    let goals;

    try {

        goals = getGoals();

    } catch (error) {

        console.error("Error loading goals:", error);

        showMessage(
            "Unable to load saved goals.",
            "no-goals"
        );

        return;
    }

    // Check that the saved data is an array.
    if (!Array.isArray(goals)) {

        showMessage(
            "Your saved goal data is invalid.",
            "no-goals"
        );

        return;
    }

    // Display a message when there are no goals.
    if (goals.length === 0) {

        showMessage(
            "No goals available to update. Create a goal first!",
            "no-goals"
        );

        return;
    }

    const fragment =
        document.createDocumentFragment();


    /*
    =====================================================
    CREATE A CARD FOR EACH GOAL
    =====================================================
    */

    goals.forEach(function (goal, index) {

        const card = document.createElement("form");

        card.className = "goal-update-card";


        // Goal title.
        const title = document.createElement("h3");

        title.textContent =
            goal.text || "Untitled goal";


        // Current progress.
        const progressText =
            document.createElement("p");

        progressText.textContent =
            "Current progress: ";

        const progressValue =
            document.createElement("strong");

        const currentProgress =
            Number(goal.progress);

        const validProgress =
            Number.isFinite(currentProgress) &&
            currentProgress >= 0 &&
            currentProgress <= 100;

        progressValue.textContent =
            validProgress
                ? currentProgress + "%"
                : "Invalid";

        progressText.appendChild(progressValue);


        // Progress input label.
        const label =
            document.createElement("label");

        const input =
            document.createElement("input");

        input.type = "number";
        input.className = "progress-input";
        input.min = "1";
        input.max = "100";
        input.step = "1";
        input.value = "1";
        input.required = true;

        input.id = "progress-input-" + index;

        label.htmlFor = input.id;
        label.textContent = "Add progress (%)";


        // Validation message.
        const feedback =
            document.createElement("p");

        feedback.className = "progress-feedback";
        feedback.setAttribute("aria-live", "polite");


        // Update button.
        const button =
            document.createElement("button");

        button.type = "submit";
        button.textContent = "Update Progress";


        /*
        =================================================
        HANDLE FORM SUBMISSION
        =================================================
        */

        card.addEventListener("submit", function (event) {

            event.preventDefault();

            if (
                goal.id === undefined ||
                goal.id === null ||
                goal.id === "" ||
                !validProgress
            ) {

                feedback.textContent =
                    "This goal contains invalid data.";

                return;
            }

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

            // Never allow progress to exceed 100%.
            const newProgress = Math.min(
                100,
                currentProgress + amount
            );

            try {

                const saved = updateGoalProgress(
                    goal.id,
                    newProgress
                );

                if (saved === false) {

                    feedback.textContent =
                        "Could not save your progress. Please try again.";

                    return;
                }

                // Reload the dashboard after a successful update.
                window.location.href = "main.html";

            } catch (error) {

                console.error(
                    "Error updating goal:",
                    error
                );

                feedback.textContent =
                    "An error occurred while saving your progress.";

            }

        });


        /*
        =================================================
        ADD ELEMENTS TO THE CARD
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


    /*
    =====================================================
    DISPLAY ALL GOAL CARDS
    =====================================================
    */

    goalsContainer.replaceChildren(fragment);

}


/*
=========================================================
START THE PAGE
=========================================================
*/

displayGoals();
