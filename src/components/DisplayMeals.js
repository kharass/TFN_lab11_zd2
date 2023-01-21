import React, {useState} from "react";

import Criteria from "../data/criteria.json";
import axios from "axios";

export default function DisplayMeals({
                                         meals, setMeals = f => f, showDetails = f => f,
                                         setCategory = f => f, selectCategory,
                                         setCountry = f => f, selectCountry,
                                         setCategoryAndCountryNull = f => f
                                     }) {
    const [searchMeal, setSearchMeal] = useState("");

    function handleClick(id) {
        showDetails(id);
    }

    function getCategories() {
        return Criteria.category.map((category) => {
            return <option key={category} value={category}>{category}</option>;
        });
    }

    function getCountries() {
        return Criteria.area.map((country) => {
            return <option key={country} value={country}>{country}</option>;
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMeals([]);

        await axios("https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchMeal)
            .then((response) => {
                for (const mealKey in response.data.meals) {
                    setMeals(meals => [...meals, response.data.meals[mealKey]]);
                }
            })

        setCategoryAndCountryNull(true);
    }

    return (
        <>
        <div id="search">
            {selectCategory !== null ? <h3>Meals from category {selectCategory}</h3> : selectCountry !== null ?
                <h3>Meals from {selectCountry}</h3> : searchMeal !== "" ? <h3> Meals containing frase: {searchMeal} </h3> :
                    <h3>Random meals</h3>}

            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={searchMeal}
                        onChange={(e) => setSearchMeal(e.target.value)}
                    />
                </label>
                <input type="submit" value={"Search"}/>
            </form>

            <select
                onChange={(e) => setCategory(e.target.value)}>
                <option disabled hidden selected>
                    -- Choose category --
                </option>
                {getCategories()}
            </select>

            <select
                onChange={(e) => setCountry(e.target.value)}>
                <option disabled hidden selected>
                    -- Choose country --
                </option>
                {getCountries()}
            </select>
            </div>
            <div className={"meals"}>
                {
                    meals.map((meal, index) => {
                        return (
                            <div className={"meal"} onClick={() => handleClick(index)}>
                                <p>{meal.strMeal}</p>
                                <img src={meal.strMealThumb} alt={"img_" + meal.strMeal}/>
                            </div>
                        )
                    })
                }
            </div>
            
        </>
    )
}