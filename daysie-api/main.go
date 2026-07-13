package main

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type FileInfo struct {
	Name string `json:"name"`
	Size int64  `json:"size"`
}

func main() {

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3005,http://daysie.local:3005",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	app.Get("/files", func(c *fiber.Ctx) error {
		// Specify the directory you want to list files from
		dir := "./Doc"

		filesInfo := []FileInfo{}

		// Open the directory
		dirEntries, err := os.ReadDir(dir)
		if err != nil {
			log.Println("Error reading directory:", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Error reading directory")
		}

		// Iterate over directory entries
		for _, entry := range dirEntries {
			fileInfo := FileInfo{
				Name: entry.Name(),
			}

			// Get file info to obtain the size
			fileStat, err := entry.Info()
			if err != nil {
				log.Println("Error getting file info:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("Error getting file info")
			}
			fileInfo.Size = fileStat.Size()

			filesInfo = append(filesInfo, fileInfo)
		}

		// Return files info as JSON
		return c.JSON(filesInfo)
	})

	app.Get("/download/all", func(c *fiber.Ctx) error {
		// Specify the directory you want to zip
		dir := "./Doc"

		// Create a buffer to write the zip archive to
		zipBuffer := new(strings.Builder)

		// Create a new zip archive
		zipWriter := zip.NewWriter(io.Writer(zipBuffer))

		// Open the directory
		dirEntries, err := os.ReadDir(dir)
		if err != nil {
			log.Println("Error reading directory:", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Error reading directory")
		}

		// Iterate over directory entries
		for _, entry := range dirEntries {
			// Open the file
			file, err := os.Open(filepath.Join(dir, entry.Name()))
			if err != nil {
				log.Println("Error opening file:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("Error opening file")
			}
			defer file.Close()

			// Create a new file in the zip archive
			zipFile, err := zipWriter.Create(entry.Name())
			if err != nil {
				log.Println("Error creating file in zip archive:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("Error creating file in zip archive")
			}

			// Copy file contents to the zip file
			if _, err := io.Copy(zipFile, file); err != nil {
				log.Println("Error copying file to zip archive:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("Error copying file to zip archive")
			}
		}

		// Close the zip archive
		if err := zipWriter.Close(); err != nil {
			log.Println("Error closing zip archive:", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Error closing zip archive")
		}

		// Set appropriate headers for file download
		c.Set(fiber.HeaderContentDisposition, "attachment; filename=all_files.zip")
		c.Set(fiber.HeaderContentType, "application/zip")

		// Stream the zip buffer to the client
		if _, err := io.Copy(c, strings.NewReader(zipBuffer.String())); err != nil {
			log.Println("Error streaming zip buffer:", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Error streaming zip buffer")
		}

		return nil
	})

	app.Get("/view/:filename?", func(c *fiber.Ctx) error {
		// Get the file name from the route parameter
		fileName := c.Params("filename")

		// Specify the directory containing the files
		dir := "./Doc"

		// If filename is provided, serve the file
		if fileName != "" {
			// Create the file path
			filePath := dir + "/" + fileName

			// Open the file
			file, err := os.Open(filePath)
			if err != nil {
				log.Println("Error opening file:", err)
				return c.Status(fiber.StatusNotFound).SendString("File not found")
			}
			defer file.Close()

			// Set appropriate headers for file view
			c.Set(fiber.HeaderContentType, "text/plain")

			// Stream the file to the client
			if _, err := file.Seek(0, 0); err != nil {
				log.Println("Error seeking file:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("Error seeking file")
			}
			if _, err := io.Copy(c, file); err != nil {
				log.Println("Error streaming file:", err)
				return c.Status(fiber.StatusInternalServerError).SendString("Error streaming file")
			}

			return nil
		}

		// If no filename is provided, list all filenames
		filesInfo := []string{}

		// Open the directory
		dirEntries, err := ioutil.ReadDir(dir)
		if err != nil {
			log.Println("Error reading directory:", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Error reading directory")
		}

		// Iterate over directory entries
		for _, entry := range dirEntries {
			filesInfo = append(filesInfo, entry.Name())
		}

		// Return files info as JSON
		return c.JSON(filesInfo)
	})

	app.Get("/db/start", func(c *fiber.Ctx) error {
		// Specify the path to your shell script
		scriptPath := "./cmd/start-db.sh"

		// Run the shell script
		cmd := exec.Command("bash", scriptPath)

		// Create a buffer to store the script's output
		var output bytes.Buffer
		cmd.Stdout = &output

		// Execute the command
		err := cmd.Run()
		if err != nil {
			log.Fatalf("Error running shell script: %v", err)
		}

		// Print the output of the script
		log.Println("Script output:")
		log.Println(output.String())

		return c.SendString("Docker Start successfully")

		// Execute the command

		// Print the output of the script

	})

	app.Get("/db/stop", func(c *fiber.Ctx) error {
		// Specify the path to your shell script
		scriptPath := "./cmd/stop-db.sh"

		// Run the shell script
		cmd := exec.Command("bash", scriptPath)

		// Create a buffer to store the script's output
		var output bytes.Buffer
		cmd.Stdout = &output

		// Execute the command
		err := cmd.Run()
		if err != nil {
			log.Fatalf("Error running shell script: %v", err)
		}

		// Print the output of the script
		log.Println("Script output:")
		log.Println(output.String())

		return c.SendString("Docker Stop successfully")

		// Execute the command

		// Print the output of the script

	})

	app.Get("/dashboard/start", func(c *fiber.Ctx) error {
		// Specify the path to your shell script
		scriptPath := "./cmd/start-dashboard.sh"

		// Run the shell script
		cmd := exec.Command("bash", scriptPath)

		// Create a buffer to store the script's output
		var output bytes.Buffer
		cmd.Stdout = &output

		// Execute the command
		err := cmd.Run()
		if err != nil {
			log.Fatalf("Error running shell script: %v", err)
		}

		// Print the output of the script
		log.Println("Script output:")
		log.Println(output.String())

		return c.SendString("Docker Start successfully")

		// Execute the command

		// Print the output of the script

	})

	app.Get("/dashboard/stop", func(c *fiber.Ctx) error {
		// Specify the path to your shell script
		scriptPath := "./cmd/stop-dashboard.sh"

		// Run the shell script
		cmd := exec.Command("bash", scriptPath)

		// Create a buffer to store the script's output
		var output bytes.Buffer
		cmd.Stdout = &output

		// Execute the command
		err := cmd.Run()
		if err != nil {
			log.Fatalf("Error running shell script: %v", err)
		}

		// Print the output of the script
		log.Println("Script output:")
		log.Println(output.String())

		return c.SendString("Docker Stop successfully")

		// Execute the command

		// Print the output of the script

	})
	app.Get("/model/:modelid", func(c *fiber.Ctx) error {
		modelID := c.Params("modelid")
		url := fmt.Sprintf("https://dev.daysie.io/download/%s", modelID) // modelID is expected to be something like "mymodel123.zip"

		zipFilePath := fmt.Sprintf("./model/%s.zip", modelID)
		extractPath := "./model/"

		// Step 1: Download the zip file
		zipFile, err := os.Create(zipFilePath)
		if err != nil {
			fmt.Printf("Failed to create zip file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to create zip file")
		}
		defer zipFile.Close()

		resp, err := http.Get(url)
		if err != nil || resp.StatusCode != http.StatusOK {
			fmt.Printf("Failed to download zip file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to download zip file")
		}
		defer resp.Body.Close()

		_, err = io.Copy(zipFile, resp.Body)
		if err != nil {
			fmt.Printf("Failed to write zip file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to write zip file")
		}

		// Step 2: Extract the zip file
		err = unzip(zipFilePath, extractPath)
		if err != nil {
			fmt.Printf("Failed to extract zip file: %v\n", err)
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to extract zip file")
		}

		// Step 3: Delete the zip file after successful extraction
		err = os.Remove(zipFilePath)
		if err != nil {
			fmt.Printf("Warning: failed to delete zip file: %v\n", err)
		}

		return c.SendString(fmt.Sprintf("Model %s extracted to %s", modelID, extractPath))
	})

	app.Listen(":8080")
}

func unzip(src string, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	os.MkdirAll(dest, 0755)

	for _, f := range r.File {
		fpath := filepath.Join(dest, f.Name)

		// Prevent ZipSlip
		if !strings.HasPrefix(fpath, filepath.Clean(dest)+string(os.PathSeparator)) {
			return fmt.Errorf("illegal file path: %s", fpath)
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, f.Mode())
			continue
		}

		if err := os.MkdirAll(filepath.Dir(fpath), f.Mode()); err != nil {
			return err
		}

		dstFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return err
		}

		srcFile, err := f.Open()
		if err != nil {
			dstFile.Close()
			return err
		}

		_, err = io.Copy(dstFile, srcFile)

		dstFile.Close()
		srcFile.Close()

		if err != nil {
			return err
		}
	}

	return nil
}
