package main

import (
	"gorm.io/gorm"
)

type Device struct {
	gorm.Model
	DeviceId    string `json:"deviceid"`
	DeviceName  string `json:"devicename"`
	DeviceToken string `json:"devicetoken"`
	RecipeId    string `json:"recipeid"`
	RecipeName  string `json:"recipename"`
}

func createDevice(db *gorm.DB, device *Device) error {
	result := db.Create(device)

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func getDevice(db *gorm.DB, devicetoken string) (Device, error) {
	var device Device

	result := db.Where("device_token = ?", devicetoken).First(&device)
	if result.Error != nil {
		return device, result.Error
	}

	return device, nil
}
