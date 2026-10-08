"use strict";


const goalInput =
    document.getElementById("goalInput");


const goalDuration =
    document.getElementById("goalDuration");


const goalDurationUnit =
    document.getElementById(
        "goalDurationUnit"
    );


const saveGoalButton =
    document.getElementById("saveGoal");


saveGoalButton.addEventListener(
    "click",
    function () {


        /*
        =================================================
        GET VALUES
        =================================================
        */

        const text =
            goalInput.value;


        const duration =
            Number(
                goalDuration.value
            );


        const unit =
            goalDurationUnit.value;


        /*
        =================================================
        CHECK GOAL
        =================================================
        */

        if (text.trim() === "") {

            alert(
                "Please enter a goal."
            );

            goalInput.focus();

            return;
        }


        /*
        =================================================
        CHECK DURATION
        =================================================
        */

        if (
            isNaN(duration) ||
            duration <= 0
        ) {

            alert(
                "Please enter a valid goal duration."
            );

            goalDuration.focus();

            return;
        }


        /*
        =================================================
        SAVE GOAL
        =================================================
        */

        const goal =
            addGoal(
                text,
                duration,
                unit
            );


        if (!goal) {

            alert(
                "The goal could not be saved."
            );

            return;
        }


        /*
        =================================================
        RETURN TO MAIN
        =================================================
        */

        window.location.href =
            "main.html";

    }
);