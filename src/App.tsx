import React, { useState, useEffect } from 'react';
import { Thermometer, Wifi, WifiOff, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IoTHub = () => {
  const [devices, setDevices] = useState([
    { id: 'DEV-001', name: 'Capteur Salon', temp: 20, status: 'online', history: [] },
    { id: 'DEV-002', name: 'Capteur Cuisine', temp: 22, status: 'online', history: [] },
    { id: 'DEV-003', name: 'Capteur Chambre', temp: 19, status: 'online', history: [] },
    { id: 'DEV-004', name: 'Capteur Bureau', temp: 21, status: 'online', history: [] },
    { id: 'DEV-005', name: 'Capteur Garage', temp: 15, status: 'online', history: [] }
  ]);
  const [chartData, setChartData] = useState([]);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();
      
      setDevices(prevDevices => {
        const updatedDevices = prevDevices.map(device => {
          const tempChange = (Math.random() - 0.5) * 2;
          const newTemp = Math.max(10, Math.min(35, device.temp + tempChange));
          const isOnline = Math.random() > 0.05;
          
          return {
            ...device,
            temp: parseFloat(newTemp.toFixed(1)),
            status: isOnline ? 'online' : 'offline',
            lastUpdate: timestamp
          };
        });

        const newChartPoint = {
          time: timestamp,
          ...Object.fromEntries(
            updatedDevices.map(d => [d.name, d.status === 'online' ? d.temp : null])
          )
        };

        setChartData(prev => [...prev.slice(-19), newChartPoint]);
        setMessageCount(prev => prev + updatedDevices.filter(d => d.status === 'online').length);

        return updatedDevices;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const avgTemp = devices
    .filter(d => d.status === 'online')
    .reduce((sum, d) => sum + d.temp, 0) / devices.filter(d => d.status === 'online').length || 0;

  const onlineDevices = devices.filter(d => d.status === 'online').length;

  const getStatusColor = (status) => status === 'online' ? 'text-green-500' : 'text-red-500';
  const getTempColor = (temp) => {
    if (temp < 18) return 'text-blue-500';
    if (temp > 25) return 'text-orange-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Activity className="w-10 h-10 text-blue-400" />
            Hub IoT - Monitoring de Température
          </h1>
          <p className="text-blue-200">Simulation en temps réel de 5 capteurs IoT</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Devices Actifs</p>
                <p className="text-4xl font-bold text-white">{onlineDevices}/5</p>
              </div>
              <Wifi className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Température Moyenne</p>
                <p className="text-4xl font-bold text-white">{avgTemp.toFixed(1)}°C</p>
              </div>
              <Thermometer className="w-12 h-12 text-orange-400" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Messages Reçus</p>
                <p className="text-4xl font-bold text-white">{messageCount}</p>
              </div>
              <Activity className="w-12 h-12 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Historique des Températures</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="time" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" domain={[10, 35]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Legend />
              <Line type="monotone" dataKey="Capteur Salon" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Capteur Cuisine" stroke="#10b981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Capteur Chambre" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Capteur Bureau" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Capteur Garage" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(device => (
            <div 
              key={device.id} 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{device.name}</h3>
                  <p className="text-sm text-blue-200">{device.id}</p>
                </div>
                {device.status === 'online' ? (
                  <Wifi className={`w-6 h-6 ${getStatusColor(device.status)}`} />
                ) : (
                  <WifiOff className={`w-6 h-6 ${getStatusColor(device.status)}`} />
                )}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <Thermometer className={`w-8 h-8 ${getTempColor(device.temp)}`} />
                <span className={`text-4xl font-bold ${getTempColor(device.temp)}`}>
                  {device.temp}°C
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/20">
                <span className="text-sm text-blue-200">Status:</span>
                <span className={`text-sm font-semibold ${getStatusColor(device.status)}`}>
                  {device.status.toUpperCase()}
                </span>
              </div>
              
              {device.lastUpdate && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-blue-200">Dernière MAJ:</span>
                  <span className="text-sm text-white">{device.lastUpdate}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IoTHub;