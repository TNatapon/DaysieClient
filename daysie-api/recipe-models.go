package main

import (
	"log"

	"gorm.io/gorm"
)

type Recipe struct {
	gorm.Model
	RecipeId      string `json:"recipeid"`
	ProjectId     string `json:"projectid"`
	Name          string `json:"name"`
	Description   string `json:"description"`
	Status        string `json:"status"`
	Flow          string `json:"flow"`
	Hardware      string `json:"hardware"`
	EdgeClient    string `json:"edgeclient"`
	Protocol      string `json:"protocol"`
	Mlbox         string `json:"mlbox"`
	Database      bool   `json:"database"`
	Visualization bool   `json:"visualization"`
	Version       string `json:"version"`
}

func createRecipe(db *gorm.DB, recipe *Recipe) error {
	result := db.Create(recipe)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func getRecipe(db *gorm.DB, recipeid string) (Recipe, error) {
	var recipe Recipe

	result := db.Where("recipe_id = ?", recipeid).First(&recipe)
	if result.Error != nil {
		return recipe, result.Error
	}

	return recipe, nil
}

func getRecipes(db *gorm.DB) []Recipe {
	var recipes []Recipe
	result := db.Find(&recipes)

	if result.Error != nil {
		log.Fatalf("Error get book: %v", result.Error)
	}
	return recipes
}

func updateRecipe(db *gorm.DB, recipe *Recipe) error {
	result := db.Model(&recipe).Updates(recipe)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func deleteRecipe(db *gorm.DB, id uint) error {
	var recipe Recipe
	result := db.Delete(&recipe, id)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func searchRecipe(db *gorm.DB, recipeName string) []Recipe {
	var recipes []Recipe

	result := db.Where("name = ?", recipeName).Find(&recipes)
	if result.Error != nil {
		log.Fatalf("Search recipe failed: %v", result.Error)
	}

	return recipes
}
