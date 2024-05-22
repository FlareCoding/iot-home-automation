const BASE_URL = 'http://10.0.0.216:4000';

// Fetch data from the backend
export const fetchData = async (path) => {
    try {
        const response = await fetch(`${BASE_URL}${path}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            return data;
        } else {
            const data = await response.text();
            return data;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// Send data to the backend
export const sendData = async (path, payload) => {
    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
};

// Fetch device list from the backend
export const fetchDeviceList = async () => {
    try {
        const response = await fetch(`${BASE_URL}/devices`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching device list:', error);
        throw error;
    }
};
