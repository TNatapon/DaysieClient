# Start from the latest golang base image
FROM golang:latest

RUN apt-get update && apt-get install -y docker.io
# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files first; they are less frequently changed than source code, so Docker can cache this layer
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Build the Go app
RUN go build -o main .

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
