import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/api';
import SocietyCard from '../components/SocietyCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['All', 'Technical', 'Literary', 'Arts', 'Sports', 'Social'];

export default function Societies() {
  const [societies, setSocieties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSocieties() {
      try {
        setLoading(true);
        setError('');
        const categoryFilter = selectedCategory === 'All' ? '' : selectedCategory.toLowerCase();
        const data = await api.getSocieties(categoryFilter);
        setSocieties(data);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve societies from the MERN backend.');
      } finally {
        setLoading(false);
      }
    }
    loadSocieties();
  }, [selectedCategory]);

  const filteredSocieties = societies.filter((soc) =>
    soc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    soc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  return (
    <div className="p-margin-desktop max-w-container-max mx-auto w-full pt-10">
      {/* Hero Header Section */}
      <section className="mb-12 flex flex-col md:flex-row justify-between items-end gap-gutter animate-fade-in-up">
        <div className="max-w-2xl text-left">
          <span className="atrium-eyebrow mb-4 block">NAMAL COMMUNITY</span>
          <h1 className="atrium-h1 text-[2.8rem] leading-tight mb-6">Explore Our Intellectual &amp; Creative Hubs</h1>
          <p className="atrium-desc max-w-lg">
            Join a society to collaborate with like-minded peers, lead impactful initiatives, and shape the cultural fabric of Namal University.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Link 
            to="/events" 
            className="atrium-btn-outline px-6 py-3 rounded text-center flex-1 md:flex-none"
          >
            Registration Open
          </Link>
          <Link 
            to="/dashboard" 
            className="atrium-btn-primary px-6 py-3 rounded text-center flex-1 md:flex-none"
          >
            My Societies
          </Link>
        </div>
      </section>

      {/* Search & Filters Bar */}
      <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-[#e5e9e7] animate-fade-in-up animate-delay-100">
        {/* Category Filter Capsules */}
        <div className="flex flex-wrap gap-2" aria-label="Filter by Category">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`atrium-filter-btn ${isSelected ? 'active' : ''}`}
              >
                {cat === 'All' ? 'All Hubs' : cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic Search Box */}
        <div className="relative ml-auto w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#71887e]">search</span>
          <input
            type="text"
            placeholder="Search societies..."
            className="atrium-search-input md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search Societies"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-error-container text-on-error-container border border-error rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Main Societies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <LoadingState count={6} />
        </div>
      ) : filteredSocieties.length === 0 ? (
        <EmptyState
          message="No active clubs or societies match the current search filters."
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filteredSocieties.map((soc) => (
            <SocietyCard key={soc._id} society={soc} />
          ))}
        </div>
      )}

      {/* Discover More Footer Section */}
      <div className="mt-16 flex justify-center animate-fade-in-up animate-delay-300">
        <button 
          onClick={handleClearFilters}
          className="atrium-btn-outline flex items-center gap-3 px-12 py-4 rounded-lg group"
        >
          Reset Filters &amp; View All
          <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">expand_more</span>
        </button>
      </div>
    </div>
  );
}
