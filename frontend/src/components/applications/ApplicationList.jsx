import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchApplications,
  updateApplicationStage,
  deleteApplication,
  clearMessages,
} from '../../store/slices/applicationSlice';

const STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

export default function ApplicationList() {
  const dispatch = useDispatch();
  const {
    items,
    currentPage,
    totalPages,
    status,
    successMessage,
    warningMessage,
    errorMessage,
  } = useSelector((state) => state.applications);

  const [search, setSearch] = useState('');
  const [editingApp, setEditingApp] = useState(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);

  // Auto-focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Initial load
  useEffect(() => {
    dispatch(fetchApplications({ page: 0, size: 5 }));
  }, [dispatch]);

  // Auto-dismiss success/warning/error banners after 3000ms
  useEffect(() => {
    if (successMessage || warningMessage || errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, warningMessage, errorMessage, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      dispatch(fetchApplications({ page: 0, size: 5 }));
      // If your backend supports server-side search, pass `value` as a param here.
    }, 300);
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchApplications({ page: newPage, size: 5 }));
  };

  const handleStageChange = (id, newStage) => {
    dispatch(updateApplicationStage({ id, stage: newStage }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      dispatch(deleteApplication(id));
    }
  };

  const filteredItems = items.filter((app) =>
    (app.candidate?.user?.fullName || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="application-list">
      <h2>Application Pipeline</h2>

      {successMessage && <div className="success-banner">{successMessage}</div>}
      {warningMessage && <div className="warning-banner">{warningMessage}</div>}
      {errorMessage && <div className="error-banner">{errorMessage}</div>}

      <input
        ref={searchInputRef}
        type="text"
        placeholder="Filter by candidate"
        value={search}
        onChange={handleSearchChange}
      />

      {status === 'loading' && <p>Loading...</p>}

      <table>
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>Stage</th>
            <th>Applied At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((app) => (
            <tr key={app.id}>
              <td>{app.candidate?.user?.fullName}</td>
              <td>{app.job?.title}</td>
              <td>
                <select
                  value={app.currentStage}
                  onChange={(e) => handleStageChange(app.id, e.target.value)}
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </td>
              <td>{app.appliedAt}</td>
              <td>
                <button onClick={() => handleDelete(app.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          disabled={currentPage + 1 >= totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}