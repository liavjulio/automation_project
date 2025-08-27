import os
import subprocess
import requests
import time
import logging

# Configuration
DOCKER_COMPOSE_FILE = "docker-compose.yml"

SERVICES = {
    "View List": {"url": "http://127.0.0.1:5002/view-list", "method": "GET"},
    "Add Item": {
        "url": "http://127.0.0.1:5002/add-item",
        "method": "POST",
        "data": {"_id": "123", "name": "Test Item", "quantity": 5},
    },
    "Delete Item": {
        "url": "http://127.0.0.1:5002/delete-item",
        "method": "DELETE",
        "params": {"id": "123"},
    },
    "Clear List": {"url": "http://127.0.0.1:5002/clear-list", "method": "DELETE"},
    "Count Items": {"url": "http://127.0.0.1:5002/count-items", "method": "GET"},
    "Generate ID": {"url": "http://127.0.0.1:5002/generate-id", "method": "GET"},
    "Search Item": {
        "url": "http://127.0.0.1:5002/search-item",
        "method": "GET",
        "params": {"keyword": "test"},
    },
    "Search Online": {
        "url": "http://127.0.0.1:5002/search-online",
        "method": "GET",
        "params": {"query": "laptop"},
    },
}

# Logging
logging.basicConfig(
    filename="docker_manager.log",
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s]: %(message)s",
)


def log_and_print(message, level="info"):
    print(message)
    if level == "info":
        logging.info(message)
    elif level == "error":
        logging.error(message)
    elif level == "warning":
        logging.warning(message)


# Helper Functions
def run_command(command):
    """Run a shell command and return its output."""
    try:
        result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        log_and_print(f"❌ Error running command `{command}`: {e}", "error")
        return "", str(e), 1


def check_docker():
    """Check if Docker is running."""
    stdout, stderr, code = run_command("docker info")
    if code != 0:
        log_and_print("❌ Docker is not running. Please start Docker and try again.", "error")
        exit(1)


def check_docker_compose_file():
    """Ensure the Docker Compose file exists."""
    if not os.path.exists(DOCKER_COMPOSE_FILE):
        log_and_print(f"❌ Docker Compose file '{DOCKER_COMPOSE_FILE}' not found.", "error")
        exit(1)


def check_service(name, url, method="GET", data=None, params=None):
    """Check if a service is reachable."""
    try:
        start_time = time.time()
        if method == "POST":
            response = requests.post(url, json=data)
        elif method == "GET":
            response = requests.get(url, params=params)
        elif method == "DELETE":
            response = requests.delete(url, params=params)
        else:
            log_and_print(f"❌ Unsupported method {method} for {name}", "error")
            return

        elapsed_time = time.time() - start_time

        if response.status_code == 200:
            log_and_print(f"✅ {name} is running successfully (Response time: {elapsed_time:.2f}s).")
        elif response.status_code == 201:
            log_and_print(f"✅ {name} created successfully.")
        elif response.status_code == 400:
            log_and_print(f"⚠️ {name} returned status 400 (Bad Request): {response.json().get('message', 'Unknown error')}", "warning")
        elif response.status_code == 404:
            log_and_print(f"⚠️ {name} returned status 404 (Not Found): {response.json().get('message', 'Unknown error')}", "warning")
        else:
            log_and_print(f"⚠️ {name} returned status {response.status_code}: {response.text}", "warning")
    except requests.exceptions.RequestException:
        log_and_print(f"❌ {name} is NOT reachable! Check the service.", "error")


# Main Functions
def docker_compose_up():
    """Run `docker-compose up --build` to build and start containers."""
    log_and_print("🚀 Starting Docker Compose...")
    stdout, stderr, code = run_command(f"docker-compose -f {DOCKER_COMPOSE_FILE} up --build -d")
    if code == 0:
        log_and_print("✅ Docker Compose started successfully.")
    else:
        log_and_print(f"❌ Failed to start Docker Compose:\n{stderr}", "error")


def check_containers():
    """Check the health of all services using the SERVICES configuration."""
    log_and_print("\n🔍 Checking all services...")
    for name, service in SERVICES.items():
        check_service(
            name,
            service["url"],
            service.get("method", "GET"),
            data=service.get("data"),
            params=service.get("params"),
        )


def restart_failing_containers():
    """Restart any failing containers."""
    log_and_print("\n🔄 Restarting failing containers...")
    stdout, stderr, code = run_command("docker ps --filter 'status=exited' --format '{{.Names}}'")
    if stdout.strip():
        failed_containers = stdout.strip().split("\n")
        for container in failed_containers:
            log_and_print(f"🔄 Restarting container: {container}")
            _, restart_stderr, restart_code = run_command(f"docker restart {container}")
            if restart_code == 0:
                log_and_print(f"✅ Successfully restarted container: {container}")
            else:
                log_and_print(f"❌ Failed to restart container: {container}\n{restart_stderr}", "error")
    else:
        log_and_print("✅ No failing containers found.")


def clean_up_docker():
    """Clean up unused Docker resources."""
    log_and_print("\n🧹 Cleaning up unused Docker resources...")
    stdout, stderr, code = run_command("docker system prune -f")
    if code == 0:
        log_and_print("✅ Docker cleanup complete.")
    else:
        log_and_print(f"❌ Docker cleanup failed:\n{stderr}", "error")


# Main Script
def main():
    try:
        log_and_print("🔧 Docker Manager Script\n")

        # Check prerequisites
        check_docker()
        check_docker_compose_file()

        # Step 1: Start Docker Compose
        docker_compose_up()

        # Step 2: Wait for containers to initialize
        log_and_print("⏳ Waiting for containers to initialize...")
        time.sleep(10)

        # Step 3: Check service health
        check_containers()

        # Step 4: Restart failing containers
        restart_failing_containers()

        # Step 5: Optional cleanup
        clean_up_docker()

        log_and_print("\n✅ All tasks completed!")
    except Exception as e:
        log_and_print(f"❌ An unexpected error occurred: {e}", "error")


if __name__ == "__main__":
    main()