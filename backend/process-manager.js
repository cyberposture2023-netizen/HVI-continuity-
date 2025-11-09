const fs = require('fs');
const path = require('path');

class ProcessManager {
    constructor() {
        this.processFile = 'running-processes.json';
    }
    
    saveProcess(processInfo) {
        let processes = [];
        
        if (fs.existsSync(this.processFile)) {
            try {
                processes = JSON.parse(fs.readFileSync(this.processFile, 'utf8'));
            } catch (e) {
                processes = [];
            }
        }
        
        processes.push({
            ...processInfo,
            timestamp: new Date().toISOString()
        });
        
        fs.writeFileSync(this.processFile, JSON.stringify(processes, null, 2));
    }
    
    getProcesses() {
        if (fs.existsSync(this.processFile)) {
            try {
                return JSON.parse(fs.readFileSync(this.processFile, 'utf8'));
            } catch (e) {
                return [];
            }
        }
        return [];
    }
    
    clearProcesses() {
        if (fs.existsSync(this.processFile)) {
            fs.unlinkSync(this.processFile);
        }
    }
}

// If server is running, record it
const manager = new ProcessManager();
const isRunning = process.env.SERVER_PROCESS === 'true';

if (isRunning) {
    manager.saveProcess({
        type: 'backend',
        port: 5000,
        pid: process.pid,
        file: 'server.js'
    });
    console.log('Process recorded:', process.pid);
}

module.exports = ProcessManager;
