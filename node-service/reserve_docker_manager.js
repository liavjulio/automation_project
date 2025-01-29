const { execSync } = require('child_process');
const request = require('request');
const fs = require('fs');

const DOCKER_COMPOSE_FILE = 'docker-compose.reserve.yml';
const SERVICES = {
    "reserve_server": "http://127.0.0.1:3000/count-items",
};

function runCommand(command) {
    try {
        return execSync(command, { stdio: 'pipe' }).toString().trim();
    } catch (error) {
        console.error(`❌ Error running command '${command}':`, error.stderr.toString());
        return '';
    }
}

function checkService(name, url) {
    request(url, { timeout: 5000 }, (error, response) => {
        if (error) {
            console.log(`❌ ${name} is NOT reachable! Check the service.`);
        } else if (response.statusCode === 200) {
            console.log(`✅ ${name} is running successfully.`);
        } else {
            console.log(`⚠️ ${name} is running but returned status code ${response.statusCode}`);
        }
    });
}

function dockerComposeUp() {
    console.log('🚀 Starting Docker Compose...');
    const output = runCommand(`docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d`);
    if (output) {
        console.log('✅ Docker Compose started successfully.');
    } else {
        console.log('❌ Failed to start Docker Compose.');
    }
}

function checkContainers() {
    console.log('\n🔍 Checking all containers...');
    Object.entries(SERVICES).forEach(([name, url]) => checkService(name, url));
}

function restartFailingContainers() {
    console.log('\n🔄 Restarting failing containers...');
    const output = runCommand("docker ps --filter 'status=exited' --format '{{.Names}}'");
    if (output) {
        const failedContainers = output.split('\n');
        failedContainers.forEach(container => {
            console.log(`🔄 Restarting container: ${container}`);
            runCommand(`docker restart ${container}`);
        });
    } else {
        console.log('✅ No failing containers found.');
    }
}

function cleanUpDocker() {
    console.log('\n🧹 Cleaning up unused Docker resources...');
    runCommand('docker system prune -f');
    console.log('✅ Docker cleanup complete.');
}

function main() {
    console.log('🔧 Reserve Docker Manager Script\n');
    dockerComposeUp();
    console.log('⏳ Waiting for containers to initialize...');
    setTimeout(() => {
        checkContainers();
        restartFailingContainers();
        cleanUpDocker();
        console.log('\n✅ All tasks completed!');
    }, 10000);
}

main();
