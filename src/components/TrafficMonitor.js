// src/TrafficMonitor.js
import React, { useEffect, useState } from 'react';

const TrafficMonitor = () => {
    const [trafficData, setTrafficData] = useState([]);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:6789');

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setTrafficData((prevData) => [...prevData, data]);
        };

        socket.onerror = (event) => {
            setError('WebSocket error: ' + event.message);
        };

        socket.onclose = (event) => {
            console.log('WebSocket closed: ', event);
        };

        // Cleanup on component unmount
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>Real-Time Traffic Monitoring</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Traffic Type</th>
                        <th>Data Rate (Mbps)</th>
                        <th>Latency (ms)</th>
                        <th>Packet Loss (%)</th>
                        <th>User Density</th>
                        <th>Traffic Load</th>
                    </tr>
                </thead>
                <tbody>
                    {trafficData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.user_id}</td>
                            <td>{data.traffic_type}</td>
                            <td>{data.data_rate.toFixed(2)}</td>
                            <td>{data.latency.toFixed(2)}</td>
                            <td>{data.packet_loss.toFixed(2)}</td>
                            <td>{data.user_density}</td>
                            <td>{data.traffic_load}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TrafficMonitor;
