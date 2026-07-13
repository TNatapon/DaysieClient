# Daysie Edge

This Client software for Daysie Platfrom.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build
- [Docker Engine on Window](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Git](https://git-scm.com/downloads)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/TNatapon/daysie-edge.git
   ```
2. Locate to DaysieClient diractory
   ```sh
   cd daysie-edge
   ```
2. Run daysie client (for first run)
   ```sh
   docker compose up --build
   ```

4. Run daysie client
    ```sh
    docker compose up -d
    ```
5. You will access to 
    - Daysie UI on [http://localhost:3005](http://localhost:3005) (You need to create account first for using Daysie UI)
    - InfluxDB on [http://localhost:8086](http://localhost:8086)
    - Grafan on [http://localhost:3000](http://localhost:3000)

### Stop daysie client
   ```sh
   docker compose down
   ```
