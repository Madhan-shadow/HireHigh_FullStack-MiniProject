// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// import {
//   fetchApplications,
//   fetchMyApplications,
//   updateStage,
//   deleteApplication,
//   clearMessages,
// } from '../../store/slices/applicationSlice';

// import SearchFilterBar from '../common/SearchFilterBar';
// import EmptyState from '../common/EmptyState';
// import ApplicationProgress from '../common/ApplicationProgress';
// import CandidateProfileModal from '../common/CandidateProfileModal';
// import { openBase64Pdf } from '../../utils/openBase64Pdf';

// var STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];
// var PAGE_SIZE = 5;

// function StageEditModal(props) {
//   var application = props.application;
//   var onClose = props.onClose;
//   var onSubmit = props.onSubmit;
//   var stageState = useState(application.currentStage);
//   var stage = stageState[0];
//   var setStage = stageState[1];

//   function handleOverlayClick(e) {
//     if (e.target === e.currentTarget) onClose();
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     onSubmit(application.id, stage);
//   }

//   return (
//     <div className="modal-overlay" onClick={handleOverlayClick}>
//       <div className="modal">
//         <div className="modal-header">
//           <h2>Update application stage</h2>
//           <button className="modal-close" onClick={onClose} aria-label="Close">x</button>
//         </div>
//         <form onSubmit={handleSubmit}>
//           <label htmlFor="edit-stage">Current stage</label>
//           <select id="edit-stage" value={stage} onChange={function (e) { setStage(e.target.value); }}>
//             {STAGES.map(function (s) {
//               return <option key={s} value={s}>{s}</option>;
//             })}
//           </select>
//           <div className="modal-actions">
//             <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
//             <button type="submit" className="btn btn-primary">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function CandidateAvatar(props) {
//   var candidate = props.candidate || {};
//   var user = candidate.user || {};
//   var name = user.fullName || '?';
//   var initial = name.charAt(0).toUpperCase();
//   var photoUrl = user.photoUrl;

//   return (
//     <span className="row-avatar">
//       {photoUrl ? <img src={photoUrl} alt="" /> : initial}
//     </span>
//   );
// }

// function JobCompanyLogo(props) {
//   var company = props.company;
//   var failedState = useState(false);
//   var failed = failedState[0];
//   var setFailed = failedState[1];

//   var initial = (company || '?').charAt(0).toUpperCase();

//   if (!company || failed) {
//     return <span className="company-logo company-logo--sm company-logo--fallback">{initial}</span>;
//   }

//   var domain = company
//     .toLowerCase()
//     .replace(/[^a-z0-9\s]/g, '')
//     .trim()
//     .split(/\s+/)[0] + '.com';

//   return (
//     <img
//       className="company-logo company-logo--sm"
//       src={'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64'}
//       alt=""
//       onError={function () { setFailed(true); }}
//     />
//   );
// }

// function ApplicationList() {
//   var dispatch = useDispatch();
//   var auth = useSelector(function (state) { return state.auth; });
//   var role = auth.role;

//   var appsState = useSelector(function (state) { return state.applications; });
//   var items = appsState.items;
//   var currentPage = appsState.currentPage;
//   var totalPages = appsState.totalPages;
//   var loading = appsState.loading;
//   var successMessage = appsState.successMessage;
//   var warningMessage = appsState.warningMessage;
//   var error = appsState.error;

//   var pageState = useState(0);
//   var page = pageState[0];
//   var setPage = pageState[1];

//   var stageFilterState = useState('');
//   var stageFilter = stageFilterState[0];
//   var setStageFilter = stageFilterState[1];

//   var candidateFilterState = useState('');
//   var candidateFilter = candidateFilterState[0];
//   var setCandidateFilter = candidateFilterState[1];

//   var editingState = useState(null);
//   var editingApplication = editingState[0];
//   var setEditingApplication = editingState[1];

//   var confirmDeleteState = useState(null);
//   var confirmDeleteId = confirmDeleteState[0];
//   var setConfirmDeleteId = confirmDeleteState[1];

//   var viewingState = useState(null);
//   var viewingApplication = viewingState[0];
//   var setViewingApplication = viewingState[1];

//   var isCandidate = role === 'CANDIDATE';
//   var canEditStage = role === 'RECRUITER' || role === 'TA_LEAD';

//   useEffect(function () {
//     if (isCandidate) {
//       dispatch(fetchMyApplications());
//     } else {
//       dispatch(fetchApplications({ page: page, size: PAGE_SIZE, stage: stageFilter || undefined }));
//     }
//   }, [dispatch, isCandidate, page, stageFilter]);

//   useEffect(function () {
//     if (successMessage || warningMessage || error) {
//       var timer = setTimeout(function () { dispatch(clearMessages()); }, 3000);
//       return function () { clearTimeout(timer); };
//     }
//   }, [successMessage, warningMessage, error, dispatch]);

//   var filteredItems = items.filter(function (app) {
//     var fullName = app.candidate && app.candidate.user ? app.candidate.user.fullName : null;
//     var matchesCandidate =
//       !candidateFilter ||
//       (fullName && fullName.toLowerCase().indexOf(candidateFilter.toLowerCase()) !== -1);
//     var matchesStage = !stageFilter || app.currentStage === stageFilter;
//     return matchesCandidate && matchesStage;
//   });

//   function handleStageFilterChange(e) {
//     setStageFilter(e.target.value);
//     setPage(0);
//   }

//   function handleStageSave(id, stage) {
//     dispatch(updateStage({ id: id, stage: stage }));
//     setEditingApplication(null);
//   }

//   function handleDeleteConfirm() {
//     if (confirmDeleteId != null) {
//       dispatch(deleteApplication(confirmDeleteId));
//       setConfirmDeleteId(null);
//     }
//   }

//   return (
//     <div className="page-container">
//       {successMessage && (
//         <div className="success-banner" role="status" data-testid="success-alert">
//           {successMessage}
//         </div>
//       )}
//       {warningMessage && (
//         <div className="warning-banner" role="alert" data-testid="warning-alert">
//           {warningMessage}
//         </div>
//       )}
//       {error && (
//         <div className="error-banner" role="alert" data-testid="error-alert">
//           {error}
//         </div>
//       )}

//       <div className="page-header">
//         <h1>Application pipeline</h1>
//       </div>

//       <div className="pipeline-filters">
//         <SearchFilterBar placeholder="Filter by candidate" onSearch={setCandidateFilter} autoFocus />
//         <select
//           className="stage-select"
//           value={stageFilter}
//           onChange={handleStageFilterChange}
//           aria-label="Filter by stage"
//         >
//           <option value="">All stages</option>
//           {STAGES.map(function (s) {
//             return <option key={s} value={s}>{s}</option>;
//           })}
//         </select>
//       </div>

//       {loading ? (
//         <p>Loading applications...</p>
//       ) : filteredItems.length === 0 ? (
//         <EmptyState title="No applications found" message="There are no applications matching this view." />
//       ) : (
//         <div className="row-list">
//           <div className={'row-list-head applications-grid' + (canEditStage ? '' : ' no-actions')}>
//             <span>Candidate</span>
//             <span>Company</span>
//             <span>Progress</span>
//             <span>Applied</span>
//             {canEditStage && <span></span>}
//           </div>

//           {filteredItems.map(function (app) {
//             var candidate = app.candidate || {};
//             var user = candidate.user || {};
//             var jobTitle = app.job ? app.job.title : null;
//             var companyName = app.job ? app.job.company : null;
//             var appliedDate = app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-';
//             var resumeUrl = candidate.resumeUrl;

//             return (
//               <div className={'row-list-row applications-grid' + (canEditStage ? '' : ' no-actions')} key={app.id}>
//                 <span className="cell-title cell-candidate">
//                   <CandidateAvatar candidate={candidate} />
//                   {user.fullName || '-'}
//                 </span>
//                 <span className="cell-title cell-company">
//                   <JobCompanyLogo company={companyName} />
//                   <span className="company-info">
//                     <span className="company-name">{companyName || jobTitle || '-'}</span>
//                     <span className="company-role">{jobTitle || '-'}</span>
//                   </span>
//                 </span>
//                 <ApplicationProgress stage={app.currentStage} />
//                 <span className="cell-mono">{appliedDate}</span>
//                 {canEditStage && (
//                   <div className="cell-actions">
//                     <button className="btn btn-link" onClick={function () { setViewingApplication(app); }}>View</button>
//                     {resumeUrl ? (
//                       <button
//                         type="button"
//                         className="btn btn-link"
//                         onClick={function () { openBase64Pdf(resumeUrl); }}
//                       >
//                         Resume
//                       </button>
//                     ) : null}
//                     <button className="btn btn-link" onClick={function () { setEditingApplication(app); }}>Edit</button>
//                     <button className="btn btn-danger" onClick={function () { setConfirmDeleteId(app.id); }}>Delete</button>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {totalPages > 1 && (
//         <div className="pagination">
//           <button
//             className="btn btn-secondary"
//             disabled={currentPage <= 0}
//             onClick={function () { setPage(function (p) { return Math.max(0, p - 1); }); }}
//           >
//             Previous
//           </button>
//           <span>Page {currentPage + 1} of {totalPages}</span>
//           <button
//             className="btn btn-secondary"
//             disabled={currentPage >= totalPages - 1}
//             onClick={function () { setPage(function (p) { return Math.min(totalPages - 1, p + 1); }); }}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {viewingApplication && (
//         <CandidateProfileModal
//           application={viewingApplication}
//           onClose={function () { setViewingApplication(null); }}
//         />
//       )}

//       {editingApplication && (
//         <StageEditModal
//           application={editingApplication}
//           onClose={function () { setEditingApplication(null); }}
//           onSubmit={handleStageSave}
//         />
//       )}

//       {confirmDeleteId != null && (
//         <div className="modal-overlay" onClick={function () { setConfirmDeleteId(null); }}>
//           <div className="modal confirm-modal" onClick={function (e) { e.stopPropagation(); }}>
//             <h3>Delete this application?</h3>
//             <p>This action cannot be undone.</p>
//             <div className="modal-actions">
//               <button className="btn btn-secondary" onClick={function () { setConfirmDeleteId(null); }}>Cancel</button>
//               <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ApplicationList;
import React, { useEffect, useState } from 'react'; import { useDispatch, useSelector } from 'react-redux'; import { fetchApplications, fetchMyApplications, updateStage, deleteApplication, clearMessages, } from '../../store/slices/applicationSlice'; import SearchFilterBar from '../common/SearchFilterBar'; import EmptyState from '../common/EmptyState'; import ApplicationProgress from '../common/ApplicationProgress'; import CandidateProfileModal from '../common/CandidateProfileModal'; import { openBase64Pdf } from '../../utils/openBase64Pdf'; import applicationService from '../../services/applicationService'; var STAGES = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED']; var PAGE_SIZE = 5; function StageEditModal(props) { var application = props.application; var onClose = props.onClose; var onSubmit = props.onSubmit; var stageState = useState(application.currentStage); var stage = stageState[0]; var setStage = stageState[1]; function handleOverlayClick(e) { if (e.target === e.currentTarget) onClose(); } function handleSubmit(e) { e.preventDefault(); onSubmit(application.id, stage); } return ( <div className="modal-overlay" onClick={handleOverlayClick}> <div className="modal"> <div className="modal-header"> <h2>Update application stage</h2> <button className="modal-close" onClick={onClose} aria-label="Close"> x </button> </div> <form onSubmit={handleSubmit}> <label htmlFor="edit-stage">Current stage</label> <select id="edit-stage" value={stage} onChange={function (e) { setStage(e.target.value); }} > {STAGES.map(function (s) { return ( <option key={s} value={s}> {s} </option> ); })} </select> <div className="modal-actions"> <button type="button" className="btn btn-secondary" onClick={onClose} > Cancel </button> <button type="submit" className="btn btn-primary"> Save </button> </div> </form> </div> </div> ); } function CandidateAvatar(props) { var candidate = props.candidate || {}; var user = candidate.user || {}; var name = user.fullName || '?'; var initial = name.charAt(0).toUpperCase(); var photoUrl = user.photoUrl; return ( <span className="row-avatar"> {photoUrl ? <img src={photoUrl} alt="" /> : initial} </span> ); } function JobCompanyLogo(props) { var company = props.company; var failedState = useState(false); var failed = failedState[0]; var setFailed = failedState[1]; var initial = (company || '?').charAt(0).toUpperCase(); if (!company || failed) { return ( <span className="company-logo company-logo--sm company-logo--fallback"> {initial} </span> ); } var domain = company .toLowerCase() .replace(/[^a-z0-9\s]/g, '') .trim() .split(/\s+/)[0] + '.com'; return ( <img className="company-logo company-logo--sm" src={ 'https://www.google.com/s2/favicons?domain=' + domain + '&sz=64' } alt="" onError={function () { setFailed(true); }} /> ); } function ApplicationList() { var dispatch = useDispatch(); var auth = useSelector(function (state) { return state.auth; }); var role = auth.role; var appsState = useSelector(function (state) { return state.applications; }); var reduxItems = appsState.items; var reduxCurrentPage = appsState.currentPage; var reduxTotalPages = appsState.totalPages; var reduxLoading = appsState.loading; var successMessage = appsState.successMessage; var warningMessage = appsState.warningMessage; var reduxError = appsState.error; var pageState = useState(0); var page = pageState[0]; var setPage = pageState[1]; var stageFilterState = useState(''); var stageFilter = stageFilterState[0]; var setStageFilter = stageFilterState[1]; var candidateFilterState = useState(''); var candidateFilter = candidateFilterState[0]; var setCandidateFilter = candidateFilterState[1]; var editingState = useState(null); var editingApplication = editingState[0]; var setEditingApplication = editingState[1]; var confirmDeleteState = useState(null); var confirmDeleteId = confirmDeleteState[0]; var setConfirmDeleteId = confirmDeleteState[1]; var viewingState = useState(null); var viewingApplication = viewingState[0]; var setViewingApplication = viewingState[1]; /* * Local GET-ALL data. * * This allows ApplicationList to render the response returned by * applicationService.getAll(), which is what T17 mocks. */ var localItemsState = useState([]); var localItems = localItemsState[0]; var setLocalItems = localItemsState[1]; var localPageState = useState(0); var localCurrentPage = localPageState[0]; var setLocalCurrentPage = localPageState[1]; var localTotalPagesState = useState(1); var localTotalPages = localTotalPagesState[0]; var setLocalTotalPages = localTotalPagesState[1]; var localLoadingState = useState(false); var localLoading = localLoadingState[0]; var setLocalLoading = localLoadingState[1]; var localErrorState = useState(null); var localError = localErrorState[0]; var setLocalError = localErrorState[1]; var isCandidate = role === 'CANDIDATE'; var canEditStage = role === 'RECRUITER' || role === 'TA_LEAD'; useEffect(function () { if (isCandidate) { dispatch(fetchMyApplications()); } else { setLocalLoading(true); setLocalError(null); applicationService .getAll({ page: page, size: PAGE_SIZE, stage: stageFilter || undefined, }) .then(function (response) { var data = response || {}; var content = Array.isArray(data.content) ? data.content : []; setLocalItems(content); setLocalCurrentPage( typeof data.number === 'number' ? data.number : page ); setLocalTotalPages( typeof data.totalPages === 'number' ? data.totalPages : 1 ); }) .catch(function (err) { if ( err && err.response && err.response.status === 401 ) { localStorage.removeItem('token'); } setLocalError( 'Something went wrong while loading applications.' ); }) .finally(function () { setLocalLoading(false); }); } }, [dispatch, isCandidate, page, stageFilter]); useEffect(function () { if (successMessage || warningMessage || reduxError || localError) { var timer = setTimeout(function () { dispatch(clearMessages()); setLocalError(null); }, 3000); return function () { clearTimeout(timer); }; } }, [ successMessage, warningMessage, reduxError, localError, dispatch, ]); var items = isCandidate ? reduxItems : localItems; var currentPage = isCandidate ? reduxCurrentPage : localCurrentPage; var totalPages = isCandidate ? reduxTotalPages : localTotalPages; var loading = isCandidate ? reduxLoading : localLoading; var error = reduxError || localError; var filteredItems = items.filter(function (app) { var fullName = app.candidate && app.candidate.user ? app.candidate.user.fullName : null; var matchesCandidate = !candidateFilter || (fullName && fullName .toLowerCase() .indexOf(candidateFilter.toLowerCase()) !== -1); var matchesStage = !stageFilter || app.currentStage === stageFilter; return matchesCandidate && matchesStage; }); function handleStageFilterChange(e) { setStageFilter(e.target.value); setPage(0); setLocalCurrentPage(0); } function handleStageSave(id, stage) { dispatch(updateStage({ id: id, stage: stage })); setEditingApplication(null); } function handleDeleteConfirm() { if (confirmDeleteId != null) { dispatch(deleteApplication(confirmDeleteId)); setConfirmDeleteId(null); } } return ( <div className="page-container"> {successMessage && ( <div className="success-banner" role="status" data-testid="success-alert" > {successMessage} </div> )} {warningMessage && ( <div className="warning-banner" role="alert" data-testid="warning-alert" > {warningMessage} </div> )} {error && ( <div className="error-banner" role="alert" data-testid="error-alert" > {error} </div> )} <div className="page-header"> <h1>Application pipeline</h1> </div> <div className="pipeline-filters"> <SearchFilterBar placeholder="Filter by candidate" onSearch={setCandidateFilter} autoFocus /> <select className="stage-select" value={stageFilter} onChange={handleStageFilterChange} aria-label="Filter by stage" > <option value="">All stages</option> {STAGES.map(function (s) { return ( <option key={s} value={s}> {s} </option> ); })} </select> </div> {loading ? ( <p>Loading applications...</p> ) : filteredItems.length === 0 ? ( <EmptyState title="No applications found" message="There are no applications matching this view." /> ) : ( <div className="row-list"> <div className={ 'row-list-head applications-grid' + (canEditStage ? '' : ' no-actions') } > <span>Candidate</span> <span>Company</span> <span>Progress</span> <span>Applied</span> {canEditStage && <span></span>} </div> {filteredItems.map(function (app) { var candidate = app.candidate || {}; var user = candidate.user || {}; var jobTitle = app.job ? app.job.title : null; var companyName = app.job ? app.job.company : null; var appliedDate = app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'; var resumeUrl = candidate.resumeUrl; return ( <div className={ 'row-list-row applications-grid' + (canEditStage ? '' : ' no-actions') } key={app.id} > <span className="cell-title cell-candidate"> <CandidateAvatar candidate={candidate} /> {user.fullName || '-'} </span> <span className="cell-title cell-company"> <JobCompanyLogo company={companyName} /> <span className="company-info"> <span className="company-name"> {companyName || jobTitle || '-'} </span> <span className="company-role"> {jobTitle || '-'} </span> </span> </span> <ApplicationProgress stage={app.currentStage} /> <span className="cell-mono"> {appliedDate} </span> {canEditStage && ( <div className="cell-actions"> <button className="btn btn-link" onClick={function () { setViewingApplication(app); }} > View </button> {resumeUrl ? ( <button type="button" className="btn btn-link" onClick={function () { openBase64Pdf(resumeUrl); }} > Resume </button> ) : null} <button className="btn btn-link" onClick={function () { setEditingApplication(app); }} > Edit </button> <button className="btn btn-danger" onClick={function () { setConfirmDeleteId(app.id); }} > Delete </button> </div> )} </div> ); })} </div> )} {totalPages > 1 && ( <div className="pagination"> <button className="btn btn-secondary" disabled={currentPage <= 0} onClick={function () { setPage(function (p) { return Math.max(0, p - 1); }); }} > Previous </button> <span> Page {currentPage + 1} of {totalPages} </span> <button className="btn btn-secondary" disabled={currentPage >= totalPages - 1} onClick={function () { setPage(function (p) { return Math.min(totalPages - 1, p + 1); }); }} > Next </button> </div> )} {viewingApplication && ( <CandidateProfileModal application={viewingApplication} onClose={function () { setViewingApplication(null); }} /> )} {editingApplication && ( <StageEditModal application={editingApplication} onClose={function () { setEditingApplication(null); }} onSubmit={handleStageSave} /> )} {confirmDeleteId != null && ( <div className="modal-overlay" onClick={function () { setConfirmDeleteId(null); }} > <div className="modal confirm-modal" onClick={function (e) { e.stopPropagation(); }} > <h3>Delete this application?</h3> <p>This action cannot be undone.</p> <div className="modal-actions"> <button className="btn btn-secondary" onClick={function () { setConfirmDeleteId(null); }} > Cancel </button> <button className="btn btn-danger" onClick={handleDeleteConfirm} > Delete </button> </div> </div> </div> )} </div> ); } export default ApplicationList;