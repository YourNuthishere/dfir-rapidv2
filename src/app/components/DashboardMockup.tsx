import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, CheckCircle, Shield } from 'lucide-react';

const timelineData = [
  { time: '00:00', events: 2 },
  { time: '04:00', events: 5 },
  { time: '08:00', events: 15 },
  { time: '12:00', events: 42 },
  { time: '16:00', events: 28 },
  { time: '20:00', events: 8 },
];

const threatsData = [
  { name: 'Malware', count: 12 },
  { name: 'Phishing', count: 8 },
  { name: 'Ransomware', count: 3 },
  { name: 'Lateral Mvmt', count: 5 },
];

export function DashboardMockup() {
  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-blue-950/90 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-cyan-500/20">
        <div>
          <h3 className="text-2xl font-bold text-white">Live Investigation Dashboard</h3>
          <p className="text-sm text-gray-400 mt-1">Incident ID: INC-2026-03-22-001</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Active Monitoring</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">247</div>
              <div className="text-xs text-gray-400">Events Collected</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">28</div>
              <div className="text-xs text-gray-400">Threats Detected</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">18</div>
              <div className="text-xs text-gray-400">IOCs Identified</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-gray-400">Evidence Chain</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/30 border border-cyan-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-4">Event Timeline</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="events" stroke="#06b6d4" fillOpacity={1} fill="url(#colorEvents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-black/30 border border-cyan-500/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-4">Threat Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={threatsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Events Log */}
      <div className="mt-6 bg-black/30 border border-cyan-500/20 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Recent Events</h4>
        <div className="space-y-2">
          {[
            { time: '14:23:47', event: 'Ransomware signature detected: TeslaCrypt variant', severity: 'high' },
            { time: '14:23:45', event: 'Suspicious PowerShell execution detected', severity: 'medium' },
            { time: '14:23:42', event: 'File encryption activity on C:\\Users\\Documents', severity: 'high' },
            { time: '14:23:38', event: 'Network connection to known C2 server: 185.220.101.23', severity: 'critical' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 text-xs p-2 hover:bg-white/5 rounded transition-colors">
              <span className="text-gray-500 font-mono">{log.time}</span>
              <div className={`w-2 h-2 rounded-full ${
                log.severity === 'critical' ? 'bg-red-500' :
                log.severity === 'high' ? 'bg-orange-500' :
                'bg-yellow-500'
              }`} />
              <span className="text-gray-300 flex-1">{log.event}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
