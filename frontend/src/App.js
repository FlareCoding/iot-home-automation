import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchDeviceList } from './backend-api';
import DeviceManager from './DeviceManager';

function App() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    useEffect(() => {
        const getDevices = async () => {
            try {
                const devices = await fetchDeviceList();
                setDevices(devices);
            } catch (error) {
                console.error('Error fetching device list:', error);
            }
        };

        getDevices();
    }, []);

    if (selectedDevice) {
        return <DeviceManager device={selectedDevice} onBack={() => setSelectedDevice(null)} />;
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>IoT Home Automation</h1>
            </header>
            <main className="App-body">
                <div className="device-list">
                    {devices.map((device) => (
                        <div
                            key={device.key}
                            className="device-button"
                            onClick={() => setSelectedDevice(device)}
                        >
                            <div className="device-image-container">
                                <img
                                    src={`/${device.type}.png`}
                                    alt={device.name}
                                    className="device-image"
                                />
                            </div>
                            <p className="device-name">{device.name}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default App;
