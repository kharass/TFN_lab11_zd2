import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Details({id, meals, showDetails = f => f, setError = f => f}) {
    const [meal, setMeal] = useState(meals[id]);

    function handleClick(id) {
        showDetails(id);
    }

    async function fetchMealDetails(idMeal) {
        await axios("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + idMeal)
            .then((response) => {
                setMeal(response.data.meals[0]);
            })
            .catch(error => {
                console.log(error);
                setError(error);
            })
    }

    useEffect(() => {
        fetchMealDetails(meal.idMeal);
    }, [meal])

    const listOfThings = (meal) => {
        let list = [], i = 0;

        for (const mealKey in meal) {
            if (mealKey.includes("strIngredient")) {
                if (meal[mealKey] !== null && meal[mealKey].trim().length !== 0) {
                    list.push(meal[mealKey])
                }
            }
            if (mealKey.includes("strMeasure")) {
                if (meal[mealKey] !== null && meal[mealKey].trim().length !== 0) {
                    list[i] = list[i] + " (" + meal[mealKey] + ")";
                }
                i++;
            }
        }

        return list;
    }

    return (
            <div className={"details"}>
                <div>
                    <h2>{meal.strMeal}</h2>
                    <img src={meal.strMealThumb} alt={"img_" + meal.strMeal}/>
                    <div>Ingredients:
                        <ul>
                            {listOfThings(meal).map((ingredient) =>
                                <li key={ingredient}>{ingredient}</li>
                            )}
                        </ul>
                    </div>
                    <p>Instructions: <br/>{meal.strInstructions}</p>
                </div>
                <button onClick={() => handleClick(-1)}>Back</button>
            </div>
    );
}