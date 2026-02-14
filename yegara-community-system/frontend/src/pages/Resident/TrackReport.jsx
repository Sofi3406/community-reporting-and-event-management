import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const TrackReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await reportsAPI.getOne(id);
      setReport(response.data.data);
    } catch (error) {
      toast.error('Unable to load report details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        Report not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Report status</h1>
          <p className="text-gray-600 mt-2">Track progress and updates for your report.</p>
        </div>
        <Link to="/resident/reports" className="text-primary-600 hover:text-primary-700">
          Back to reports
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
            <p className="text-gray-600 mt-1">{report.description}</p>
          </div>
          <div className="text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Category:</span> {report.category}</p>
            <p><span className="font-medium text-gray-800">Status:</span> {report.status}</p>
            <p><span className="font-medium text-gray-800">Created:</span> {new Date(report.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">Update history</h3>
        {report.updates && report.updates.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {report.updates.map((update, index) => (
              <li key={index} className="border-l-2 border-primary-200 pl-4">
                <p className="text-sm text-gray-500">
                  {update.timestamp ? new Date(update.timestamp).toLocaleString() : 'Update'}
                </p>
                <p className="text-gray-800 font-medium">{update.status}</p>
                <p className="text-gray-600">{update.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-600">There are no updates yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrackReport;
