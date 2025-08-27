const { execSync } = require('child_process');
const axios = require('axios');

const DOCKER_COMPOSE_FILE = 'docker-compose.reserve.yml';
const SERVICES = {
    "Clear List": { "url": "http://localhost:3001/clear-list", "method": "DELETE" },
    "Count Items": { "url": "http://localhost:3001/count-items", "method": "GET" },
};

function runCommand(command) {
    try {
        return execSync(command, { stdio: 'pipe' }).toString().trim();
    } catch (error) {
        console.error(`❌ Error running command '${command}':`, error.stderr.toString());
        return '';
    }
}

async function checkService(name, url, method) {
    try {
        if (method === "DELETE") {
            await axios.delete(url, { timeout: 5000 });
        } else {
            await axios.get(url, { timeout: 5000 });
        }
        console.log(`✅ ${name} is running successfully.`);
        return true;
    } catch (error) {
        console.log(`⏳ Waiting for ${name}...`);
        return false;
    }
}

// **Start Docker Compose**
function dockerComposeUp() {
    console.log('🚀 Starting Docker Compose...');
    const output = runCommand(`docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d`);
    if (output) {
        console.log('✅ Docker Compose started successfully.');
    } else {
        console.log('❌ Failed to start Docker Compose.');
    }
}

// **Wait for Services**
async function waitForServices() {
    console.log('⏳ Waiting for containers to be ready...');
    let attempts = 10;
    while (attempts > 0) {
        let allRunning = true;
        for (const [name, service] of Object.entries(SERVICES)) {
            const serviceUp = await checkService(name, service.url, service.method);
            if (!serviceUp) allRunning = false;
        }
        if (allRunning) break;
        attempts--;
        await new Promise(res => setTimeout(res, 5000)); // Wait 5s before retrying
    }
}

// **Restart Failing Containers**
function restartFailingContainers() {
    console.log('\n🔄 Restarting failing containers...');
    const output = runCommand("docker ps --filter 'status=exited' --format '{{.Names}}'");

    if (output) {
        const failedContainers = output.split('\n').filter(name => name.includes('reserve_'));
        failedContainers.forEach(container => {
            console.log(`🔄 Restarting container: ${container}`);
            runCommand(`docker restart ${container}`);
        });
    } else {
        console.log('✅ No failing containers found.');
    }
}

// **Clean Up Docker**
function cleanUpDocker() {
    console.log('\n🧹 Cleaning up unused Docker resources...');
    runCommand('docker system prune -f');
    console.log('✅ Docker cleanup complete.');
}

// **Main Function**
async function main() {
    console.log('🔧 Reserve Docker Manager Script\n');
    dockerComposeUp();
    await waitForServices(); // ✅ Ensure services are running before checking
    restartFailingContainers();
    cleanUpDocker();
    console.log('\n✅ All tasks completed!');
}

main();