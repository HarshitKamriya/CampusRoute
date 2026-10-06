import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ExternalLink } from 'lucide-react';
import { campusLegend } from '../data/campusLegend.js';

const CampusMapModal = ({ isOpen, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState('all');
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filterList = (list) => {
    if (!filter.trim()) return list;
    const q = filter.toLowerCase();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.shortName && item.shortName.toLowerCase().includes(q))
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Campus Map — NIT Srinagar</h2>
            <p className="modal-subtitle">Hazratbal, Srinagar, J&K · Illustrated Campus Layout</p>
          </div>
          <div className="modal-header-actions">
            <div className="zoom-bar">
              <button onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))} disabled={zoom <= 0.5}><ZoomOut size={16} /></button>
              <span>{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(z + 0.25, 3))} disabled={zoom >= 3}><ZoomIn size={16} /></button>
              <button onClick={() => setZoom(1)}><RotateCcw size={14} /></button>
            </div>
            <a href="/campus-map.png" target="_blank" rel="noopener noreferrer" className="modal-icon-btn" title="Open full image"><ExternalLink size={16} /></a>
            <button className="modal-icon-btn modal-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-image-area">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform .2s ease' }}>
              <img src="/campus-map.png" alt="NIT Srinagar Campus Map" className="modal-campus-img" />
            </div>
          </div>

          <aside className="modal-sidebar">
            <input
              type="text"
              className="sidebar-search"
              placeholder="Search buildings…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />

            <div className="sidebar-tabs">
              {['all', 'academic', 'hostels'].map((t) => (
                <button key={t} className={`sidebar-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                  {t === 'all' ? 'All' : t === 'academic' ? 'Departments' : 'Hostels'}
                </button>
              ))}
            </div>

            <div className="sidebar-list">
              {(tab === 'all' || tab === 'academic') && filterList(campusLegend.academic).length > 0 && (
                <div className="sidebar-group">
                  <h4>Academic Departments</h4>
                  {filterList(campusLegend.academic).map((item) => (
                    <div key={item.number} className="sidebar-item">
                      <span className="item-num num-academic">{item.number}</span>
                      <div className="item-detail">
                        <span className="item-name">{item.name}</span>
                        <span className="item-grid">{item.grid}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(tab === 'all' || tab === 'hostels') && filterList(campusLegend.hostels).length > 0 && (
                <div className="sidebar-group">
                  <h4>Hostels</h4>
                  {filterList(campusLegend.hostels).map((item) => (
                    <div key={item.number} className="sidebar-item">
                      <span className="item-num num-hostel">{item.number}</span>
                      <div className="item-detail">
                        <span className="item-name">{item.name}</span>
                        <span className="item-grid">{item.grid}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CampusMapModal;
