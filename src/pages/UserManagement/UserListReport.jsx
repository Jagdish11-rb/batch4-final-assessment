import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserOnboardingReport } from '../../api/userOnboarding';
import './UserListReport.css';

const UserListReport = () => {
  const { user } = useAuth();

  const loggedInRole = (user?.authorities?.[0] || user?.roleName || user?.role || '').toUpperCase().replace(/^ROLE_/, '');
  const userName = user?.user_name || user?.username || user?.sub || '';

  const userTypes = ['Bank User', 'CBC', 'CBC Maker', 'MDS', 'DS', 'Agent'];
  const statuses = ['ALL', 'APPROVED', 'PENDING', 'REJECTED'];

  const [listReportSearchVal, setListReportSearchVal] = useState('');
  const [listReportSelectedRole, setListReportSelectedRole] = useState('ALL');
  const [listReportTableData, setListReportTableData] = useState([]);
  const [isListReportLoading, setIsListReportLoading] = useState(false);
  const [hasSearchedListReport, setHasSearchedListReport] = useState(false);
  const [listReportStartDate, setListReportStartDate] = useState('');
  const [listReportEndDate, setListReportEndDate] = useState('');
  const [listReportSelectedStatus, setListReportSelectedStatus] = useState('ALL');
  const [listReportSearchMode, setListReportSearchMode] = useState('date');
  
  const [listReportPage, setListReportPage] = useState(1);
  const [listReportRowsPerPage, setListReportRowsPerPage] = useState(10);
  
  const [showUserTypeDropdown, setShowUserTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    const handleGlobalClick = () => {
      setShowUserTypeDropdown(false);
      setShowStatusDropdown(false);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleUserListReportSearch = async () => {
    setIsListReportLoading(true);
    setHasSearchedListReport(true);
    setListReportPage(1);

    const roleMapping = {
      'Bank User': 'CBC Maker',
      'CBC': 'CBC',
      'CBC Maker': 'CBC Maker',
      'MDS': 'Master Distributor',
      'DS': 'Distributor',
      'Agent': 'Agent',
      'ALL': 'ALL'
    };

    const currentRole = roleMapping[listReportSelectedRole] || 'ALL';
    const finalRole = currentRole.trim();

    try {
      setListReportTableData([]); 

      let payload;
      if (listReportSearchMode === 'date') {
        payload = {
          startDate: listReportStartDate,
          endDate: listReportEndDate,
          status: (listReportSelectedStatus || 'ALL').trim(),
          role: finalRole,
          username: userName,
          userType: loggedInRole
        };
      } else {
        payload = {
          searchUsername: listReportSearchVal,
          role: finalRole
        };
      }

      const data = await fetchUserOnboardingReport(payload);

      let finalData = [];
      if (data?.resultObj?.result) {
        finalData = Array.isArray(data.resultObj.result) ? data.resultObj.result : [data.resultObj.result];
      } else if (data?.resultObj?.data) {
        finalData = Array.isArray(data.resultObj.data) ? data.resultObj.data : [data.resultObj.data];
      } else if (Array.isArray(data)) {
        finalData = data;
      } else if (data?.result) {
        finalData = Array.isArray(data.result) ? data.result : [data.result];
      }

      setListReportTableData(finalData);
    } catch (error) {
      console.error('List Report Search API failed:', error);
      setListReportTableData([]);
    } finally {
      setIsListReportLoading(false);
    }
  };

  return (
    <div className="audit-trail-view p-24">
      <div className="user-management-header" style={{ marginBottom: '24px' }}>
        <div className="breadcrumb text-secondary" style={{ fontSize: '12px', marginBottom: '8px' }}>User Management  /  <span style={{ color: '#262626' }}>User list report</span></div>
        <h2 className="page-title m-0" style={{ fontSize: '20px', fontWeight: 600, color: '#262626' }}>User list report</h2>
      </div>

      <div className="search-radio-group mb-24" style={{ display: 'flex', gap: '24px' }}>
        <label className="radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
          <input
            type="radio"
            name="list_report_search_mode"
            checked={listReportSearchMode === 'date'}
            onChange={() => setListReportSearchMode('date')}
            style={{ accentColor: '#a80000', cursor: 'pointer', width: '16px', height: '16px', margin: 0 }}
          />
          Search by Date Range
        </label>
        <label className="radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
          <input
            type="radio"
            name="list_report_search_mode"
            checked={listReportSearchMode === 'username'}
            onChange={() => setListReportSearchMode('username')}
            style={{ accentColor: '#a80000', cursor: 'pointer', width: '16px', height: '16px', margin: 0 }}
          />
          Search by User Name
        </label>
      </div>

      <div className="audit-top-bar mb-24" style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        {listReportSearchMode === 'date' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#8c8c8c', fontWeight: 600 }}>Date Range</span>
            <div className="date-range-wrapper date-range-picker" style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '4px', padding: '0 12px', height: '34px' }}>
              <input 
                type="date" 
                value={listReportStartDate}
                onChange={(e) => setListReportStartDate(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                style={{ border: 'none', outline: 'none', width: '130px', color: '#595959', fontSize: '13px', cursor: 'pointer', textAlign: 'center' }} 
              />
              <span style={{ color: '#bfbfbf', margin: '0 4px' }}>→</span>
              <input 
                type="date" 
                value={listReportEndDate}
                onChange={(e) => setListReportEndDate(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                style={{ border: 'none', outline: 'none', width: '130px', color: '#595959', fontSize: '13px', cursor: 'pointer', textAlign: 'center' }} 
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#8c8c8c', fontWeight: 600 }}>Search</span>
            <div className="search-input-wrapper dynamic-search" style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: '4px', display: 'flex', alignItems: 'center', padding: '0 12px', height: '34px' }}>
              <input
                type="text"
                placeholder="Search User Name"
                value={listReportSearchVal}
                onChange={(e) => setListReportSearchVal(e.target.value)}
                style={{ width: '180px', border: 'none', outline: 'none', fontSize: '14px', textAlign: 'center' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#8c8c8c', fontWeight: 600 }}>Role</span>
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowUserTypeDropdown(!showUserTypeDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#262626', height: '34px', minWidth: '140px', justifyContent: 'center' }}
            >
              {listReportSelectedRole === 'ALL' ? 'ALL' : listReportSelectedRole}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#8c8c8c" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {showUserTypeDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #f0f0f0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, width: '160px', marginTop: '4px' }}>
                <div onClick={() => { setListReportSelectedRole('ALL'); setShowUserTypeDropdown(false); }} style={{ padding: '10px 16px', fontSize: '14px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', color: listReportSelectedRole === 'ALL' ? '#A51010' : '#262626', fontWeight: listReportSelectedRole === 'ALL' ? '600' : '400' }}>ALL Types</div>
              {userTypes.map((type, i) => (
                <div key={i} onClick={() => { setListReportSelectedRole(type); setShowUserTypeDropdown(false); }} style={{ padding: '10px 16px', fontSize: '14px', cursor: 'pointer', borderBottom: i < userTypes.length - 1 ? '1px solid #f5f5f5' : 'none', color: listReportSelectedRole === type ? '#A51010' : '#262626', fontWeight: listReportSelectedRole === type ? '600' : '400' }}>{type}</div>
              ))}
            </div>
          )}
        </div>
      </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#8c8c8c', fontWeight: 600 }}>Status</span>
          <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', color: '#262626', height: '34px', minWidth: '120px', justifyContent: 'center' }}
            >
              {listReportSelectedStatus}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#8c8c8c" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {showStatusDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', border: '1px solid #f0f0f0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 101, width: '140px', marginTop: '4px' }}>
                {statuses.map((status, i) => (
                <div key={i} onClick={() => { setListReportSelectedStatus(status); setShowStatusDropdown(false); }} style={{ padding: '10px 16px', fontSize: '14px', cursor: 'pointer', borderBottom: i < statuses.length - 1 ? '1px solid #f5f5f5' : 'none', color: listReportSelectedStatus === status ? '#A51010' : '#262626', fontWeight: listReportSelectedStatus === status ? '600' : '400' }}>{status}</div>
              ))}
            </div>
          )}
        </div>
      </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '11px', visibility: 'hidden' }}>Search</span>
          <button
            onClick={handleUserListReportSearch}
            disabled={isListReportLoading}
            style={{ padding: '0 24px', height: '34px', background: '#a80000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}
          >
            {isListReportLoading ? '...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="nsdl-table-container">
          <table className="nsdl-table nsdl-user-table">
            <thead>
              <tr>
                <th style={{ width: '40px', textAlign: 'center' }}><div className="checkbox-cell"><input type="checkbox" /></div></th>
                <th>first Name <span className="sort-icons">↕</span></th>
                <th>Last Name <span className="sort-icons">↕</span></th>
                <th>User Name <span className="sort-icons">↕</span></th>
                <th>Mobile No. <span className="sort-icons">↕</span></th>
                <th>Email ID <span className="sort-icons">↕</span></th>
                <th>Role <span className="sort-icons">↕</span></th>
                <th>Date Created <span className="sort-icons">↕</span></th>
                <th>Status <span className="sort-icons">↕</span></th>
              </tr>
            </thead>
            <tbody>
              {isListReportLoading ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>Loading dynamic data...</td></tr>
              ) : listReportTableData.length > 0 ? (
                listReportTableData.slice((listReportPage - 1) * listReportRowsPerPage, listReportPage * listReportRowsPerPage).map((row, idx) => (
                  <tr key={idx} style={{ height: '56px' }}>
                    <td style={{ textAlign: 'center' }}><div className="checkbox-cell"><input type="checkbox" style={{ accentColor: '#a80000' }} /></div></td>
                    <td>{row["1"]?.firstName || '---'}</td>
                    <td>{row["1"]?.lastName || '---'}</td>
                    <td>{row.username || '---'}</td>
                    <td>{row["1"]?.mobileNumber || '---'}</td>
                    <td>{row["1"]?.email || '---'}</td>
                    <td>{row.userRole || '---'}</td>
                    <td>{row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB') : '---'}</td>
                    <td>
                      <span style={{ 
                        color: row.status === 'REJECTED' ? '#f5222d' : row.status === 'PENDING' ? '#faad14' : '#52c41a', 
                        background: row.status === 'REJECTED' ? '#fff1f0' : row.status === 'PENDING' ? '#fff7e6' : '#f6ffed', 
                        padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 
                      }}>
                        {row.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : hasSearchedListReport ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>No matching records found.</td></tr>
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '60px', color: '#bfbfbf' }}>
                    <div style={{ fontSize: '14px' }}>Please perform a search to view user list reports.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination-bar" style={{ marginTop: '24px' }}>
        <div className="pagination-left">
          <span className="page-text">Row per page</span>
          <select className="page-select" value={listReportRowsPerPage} onChange={(e) => { setListReportRowsPerPage(Number(e.target.value)); setListReportPage(1); }}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span style={{ marginLeft: '16px', fontSize: '13px', color: '#8c8c8c' }}>
            Showing {(listReportPage - 1) * listReportRowsPerPage + 1} - {Math.min(listReportPage * listReportRowsPerPage, listReportTableData.length)} of {listReportTableData.length}
          </span>
        </div>
        <div className="pagination-right">
           <button disabled={listReportPage === 1} onClick={() => setListReportPage(p => p - 1)} className="page-btn nav-btn">{"<"}</button>
           {Array.from({ length: Math.ceil(listReportTableData.length / listReportRowsPerPage) }, (_, i) => i + 1).map(p => (
             <button key={p} onClick={() => setListReportPage(p)} className={`page-btn ${listReportPage === p ? 'active' : ''}`}>{p}</button>
           ))}
           <button disabled={listReportPage === Math.ceil(listReportTableData.length / listReportRowsPerPage) || listReportTableData.length === 0} onClick={() => setListReportPage(p => p + 1)} className="page-btn nav-btn">{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default UserListReport;
