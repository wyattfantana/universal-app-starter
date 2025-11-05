// Dashboard component - placeholder
export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Clients</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Estimates</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">£0.00</p>
        </div>
      </div>
    </div>
  );
}
