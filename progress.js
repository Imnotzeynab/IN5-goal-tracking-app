"use strict";


const progressContainer =
    document.getElementById(
        "progressContainer"
    );


/*
=========================================================
GET SAVED GOALS
=========================================================
*/

const goals =
    JSON.parse(
        localStorage.getItem("goals")
    ) || [];


/*
=========================================================
NO GOALS
=========================================================
*/

if (goals.length === 0) {

    progressContainer.innerHTML = `
        <p class="no-goals">
            No goals available yet.
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


        /*
        -------------------------------------------------
        CALCULATE TIME PROGRESS
        -------------------------------------------------
        */

        let progress = 0;


        if (
            goal.startDate &&
            goal.endDate
        ) {

            const start =
                new Date(
                    goal.startDate
                );

            const end =
                new Date(
                    goal.endDate
                );

            const now =
                new Date();


            const totalTime =
                end.getTime() -
                start.getTime();


            const elapsedTime =
                now.getTime() -
                start.getTime();


            if (totalTime > 0) {

                progress =
                    (
                        elapsedTime /
                        totalTime
                    ) * 100;

            }

        }


        /*
        -------------------------------------------------
        KEEP BETWEEN 0 AND 100
        -------------------------------------------------
        */

        progress =
            Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            );


        progress =
            Math.round(
                progress
            );


        /*
        -------------------------------------------------
        CALCULATE REMAINING DAYS
        -------------------------------------------------
        */

        let remainingDays = 0;


        if (goal.endDate) {

            const end =
                new Date(
                    goal.endDate
                );

            const now =
                new Date();


            remainingDays =
                Math.ceil(
                    (
                        end.getTime() -
                        now.getTime()
                    ) /
                    (1000 * 60 * 60 * 24)
                );


            remainingDays =
                Math.max(
                    0,
                    remainingDays
                );

        }


        /*
        -------------------------------------------------
        CREATE GOAL CARD
        -------------------------------------------------
        */

        const goalElement =
            document.createElement("div");


        goalElement.className =
            "goal-progress";


        goalElement.innerHTML = `

            <div class="progress-chart-header">

                <div>

                    <h3>
                        ${goal.text}
                    </h3>

                    <p class="progress-status">

                        ${
                            progress >= 100
                                ? "Goal period completed"
                                : `${remainingDays} days remaining`
                        }

                    </p>

                </div>


                <div
                    class="progress-circle"
                    style="--progress: ${progress}%"
                >

                    <div
                        class="progress-circle-inner"
                    >
                        ${progress}%
                    </div>

                </div>

            </div>


            <div class="progress-details">

                <span>
                    Time Progress
                </span>

                <strong>
                    ${progress}%
                </strong>

            </div>


            <div class="progress-track">

                <div
                    class="progress-fill"
                    style="width: ${progress}%"
                ></div>

            </div>


            <div class="progress-scale">

                <span>
                    Started
                </span>

                <span>
                    50%
                </span>

                <span>
                    Complete
                </span>

            </div>


            <div class="goal-duration-info">

                <span>
                    Duration:
                    ${goal.duration}
                    ${goal.durationUnit}
                </span>

            </div>

        `;


        progressContainer.appendChild(
            goalElement
        );

    });

}