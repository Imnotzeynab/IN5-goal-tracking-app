"use strict";


/*
=========================================================
COSMIC HEALTH — GOAL DATA
=========================================================
*/

const GOALS_STORAGE_KEY = "goals";


/*
=========================================================
GET ALL GOALS
=========================================================
*/

function getGoals() {

    return JSON.parse(
        localStorage.getItem(GOALS_STORAGE_KEY)
    ) || [];

}


/*
=========================================================
SAVE ALL GOALS
=========================================================
*/

function saveGoals(goals) {

    localStorage.setItem(
        GOALS_STORAGE_KEY,
        JSON.stringify(goals)
    );

}


/*
=========================================================
CONVERT DURATION TO DAYS
=========================================================
*/

function convertDurationToDays(
    duration,
    unit
) {

    duration = Number(duration);

    if (unit === "weeks") {
        return duration * 7;
    }

    if (unit === "months") {
        return duration * 30;
    }

    return duration;
}


/*
=========================================================
ADD NEW GOAL
=========================================================
*/

function addGoal(
    goalText,
    duration,
    durationUnit
) {

    const text = goalText.trim();

    if (text === "") {
        return false;
    }

    duration = Number(duration);

    if (
        isNaN(duration) ||
        duration <= 0
    ) {
        return false;
    }


    const goals = getGoals();


    const startDate =
        new Date();


    const durationDays =
        convertDurationToDays(
            duration,
            durationUnit
        );


    const endDate =
        new Date(startDate);


    endDate.setDate(
        endDate.getDate() + durationDays
    );


    const newGoal = {

        id: Date.now(),

        text: text,

        progress: 0,

        completed: false,

        createdAt:
            startDate.toISOString(),

        startDate:
            startDate.toISOString(),

        endDate:
            endDate.toISOString(),

        duration:
            duration,

        durationUnit:
            durationUnit,

        durationDays:
            durationDays

    };


    goals.push(newGoal);

    saveGoals(goals);

    return newGoal;

}


/*
=========================================================
CALCULATE TIME-BASED PROGRESS
=========================================================
*/

function calculateGoalProgress(goal) {

    const start =
        new Date(goal.startDate);

    const end =
        new Date(goal.endDate);

    const now =
        new Date();


    const totalTime =
        end.getTime() -
        start.getTime();


    const elapsedTime =
        now.getTime() -
        start.getTime();


    if (totalTime <= 0) {
        return 100;
    }


    let progress =
        (elapsedTime / totalTime) * 100;


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    return Math.round(progress);

}


/*
=========================================================
UPDATE GOAL PROGRESS
=========================================================
*/

function updateGoalProgress(
    goalId,
    progress
) {

    const goals = getGoals();

    const goal =
        goals.find(function (goal) {

            return goal.id === Number(goalId);

        });


    if (!goal) {
        return false;
    }


    progress =
        Number(progress);


    progress =
        Math.max(
            0,
            Math.min(
                100,
                progress
            )
        );


    goal.progress =
        progress;


    goal.completed =
        progress === 100;


    saveGoals(goals);

    return true;

}


/*
=========================================================
DELETE GOAL
=========================================================
*/

function deleteGoal(goalId) {

    const goals =
        getGoals();


    const updatedGoals =
        goals.filter(function (goal) {

            return goal.id !== Number(goalId);

        });


    saveGoals(updatedGoals);

    return true;

}


/*
=========================================================
GET ONE GOAL
=========================================================
*/

function getGoal(goalId) {

    const goals =
        getGoals();


    return goals.find(function (goal) {

        return goal.id === Number(goalId);

    }) || null;

}


/*
=========================================================
CLEAR ALL GOALS
=========================================================
*/

function clearGoals() {

    localStorage.removeItem(
        GOALS_STORAGE_KEY
    );

}