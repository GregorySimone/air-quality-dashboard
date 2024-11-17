import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Line } from 'react-chartjs-2';

    const App = () => {
      const [data, setData] = useState([]);
      const [logs, setLogs] = useState([]);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://192.168.50.7/sensor.json');
            const newData = response.data;
            setData((prevData) => [...prevData, newData]);
            setLogs((prevLogs) => [
              ...prevLogs,
              { timestamp: new Date(), data: newData },
            ]);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        const interval = setInterval(fetchData, 60000); // Fetch every minute

        return () => clearInterval(interval);
      }, []);

      const rateAirQuality = (pm25) => {
        if (pm25 <= 12) return 'Good';
        if (pm25 <= 35) return 'Moderate';
        if (pm25 <= 55) return 'Unhealthy for Sensitive Groups';
        if (pm25 <= 150) return 'Unhealthy';
        if (pm25 <= 250) return 'Very Unhealthy';
        return 'Hazardous';
      };

      const chartData = {
        labels: data.map((entry, index) => `Entry ${index + 1}`),
        datasets: [
          {
            label: 'PM2.5',
            data: data.map((entry) => entry.PM2_5),
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
          },
        ],
      };

      return (
        <div className="dashboard">
          <h1>Air Quality Dashboard</h1>
          <div className="data-section">
            {data.length > 0 ? (
              <>
                <p>Temperature (AM2301): {data[data.length - 1].temperature_AM2301} °F</p>
                <p>Humidity: {data[data.length - 1].humidity} %</p>
                <p>CO2: {data[data.length - 1].CO2} ppm</p>
                <p>Temperature (BMP280): {data[data.length - 1].temperature_BMP280} °F</p>
                <p>Pressure: {data[data.length - 1].pressure} hPa</p>
                <p>eCO2 (SGP30): {data[data.length - 1].eCO2_SGP30} ppm</p>
                <p>TVOC (SGP30): {data[data.length - 1].TVOC_SGP30} ppb</p>
                <p>PM1.0: {data[data.length - 1].PM1_0} μg/m³</p>
                <p>PM2.5: {data[data.length - 1].PM2_5} μg/m³</p>
                <p>PM10: {data[data.length - 1].PM10} μg/m³</p>
                <p>Air Quality Rating: {rateAirQuality(data[data.length - 1].PM2_5)}</p>
              </>
            ) : (
              <p>Loading data...</p>
            )}
          </div>
          <div className="chart-section">
            <h2>PM2.5 Levels Over Time</h2>
            <Line data={chartData} />
          </div>
          <div className="logs-section">
            <h2>Logs</h2>
            <ul>
              {logs.map((log, index) => (
                <li key={index}>
                  {log.timestamp.toLocaleString()}: PM2.5 = {log.data.PM2_5} μg/m³
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    };

    export default App;
