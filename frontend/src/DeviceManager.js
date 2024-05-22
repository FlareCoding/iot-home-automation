import React, { useState, useEffect } from 'react';
import './DeviceManager.css';
import { sendData } from './backend-api';

function DeviceManager({ device, onBack }) {
    const [powerOn, setPowerOn] = useState(false);
    const [loading, setLoading] = useState(false);

    const checkPowerStatus = async () => {
        try {
            setLoading(true);
            const data = await sendData('/iot_comm', { message: 'get enabled' });
            setPowerOn(data.response === 'enabled');
        } catch (error) {
            console.error('Error checking power status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCommandSubmit = (commandType, command) => {
        // Add logic to handle command submission
        console.log(`Submit ${commandType} command: ${command}`);
    };

    const handleToggle = async () => {
        try {
            setLoading(true);
            const command = powerOn ? 'set enabled=false' : 'set enabled=true';
            const data = await sendData('/iot_comm', { message: command });
            if (data.response === 'Success') {
                setPowerOn(!powerOn);
            }
        } catch (error) {
            console.error('Error toggling power:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkPowerStatus();
    }, []);

    return (
        <div className="device-manager">
            {loading && <div className="loading-overlay"><div className="spinner"></div></div>}
            <button className="back-button" onClick={onBack} disabled={loading}>Back</button>
            <div className="device-header">
                <div>
                    <h2>{device.name}</h2>
                    <p>IP: {device.ip}</p>
                    <p>Port: {device.port}</p>
                    <p>Type: {device.type}</p>
                </div>
                <button
                    className={`toggle-button ${powerOn ? 'power-on' : 'power-off'}`}
                    onClick={handleToggle}
                    disabled={loading}
                >
                    <img
                        src={powerOn ? '/power-on.png' : '/power-off.png'}
                        alt="Toggle Power"
                        className="toggle-icon"
                    />
                </button>
            </div>
            <div className="command-section">
                <h4>Set Commands</h4>
                {device.commands.set.map((cmd) => (
                    <div key={cmd} className="command-input">
                        <label>{cmd}</label>
                        <input
                            type="text"
                            placeholder={`Enter ${cmd}`}
                            onBlur={(e) => handleCommandSubmit('set', `${cmd}: ${e.target.value}`)}
                            disabled={loading}
                        />
                    </div>
                ))}
            </div>
            <div className="command-section">
                <h4>Action Commands</h4>
                {device.commands.action.map((cmd) => {
                    if (cmd !== 'enable' && cmd !== 'disable') {
                        return (
                            <button
                                key={cmd}
                                className="action-button"
                                onClick={() => handleCommandSubmit('action', cmd)}
                                disabled={loading}
                            >
                                {cmd}
                            </button>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
}

export default DeviceManager;
