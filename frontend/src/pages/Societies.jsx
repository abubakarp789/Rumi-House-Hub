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
      <section className="mb-12 flex flex-col md:flex-row justify-between items-end gap-gutter">
        <div className="max-w-2xl">
          <span className="font-label-uppercase text-label-uppercase text-secondary mb-4 block tracking-[0.2em]">NAMAL COMMUNITY</span>
          <h1 className="font-display-lg text-display-lg text-primary mb-6">Explore Our Intellectual &amp; Creative Hubs</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
            Join a society to collaborate with like-minded peers, lead impactful initiatives, and shape the cultural fabric of Namal University.
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/events" 
            className="px-6 py-3 border-2 border-primary text-primary font-label-uppercase text-label-uppercase hover:bg-primary hover:text-white transition-all text-center"
          >
            Registration Open
          </Link>
          <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-primary text-white font-label-uppercase text-label-uppercase hover:bg-primary-container transition-all text-center"
          >
            My Societies
          </Link>
        </div>
      </section>

      {/* Search & Filters Bar */}
      <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-outline-variant">
        {/* Category Filter Capsules */}
        <div className="flex flex-wrap gap-2" aria-label="Filter by Category">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 font-label-uppercase text-label-uppercase rounded-full transition-colors ${
                  isSelected 
                    ? 'bg-primary text-white border border-primary' 
                    : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {cat === 'All' ? 'All Hubs' : cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic Search Box */}
        <div className="relative ml-auto w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            placeholder="Search societies..."
            className="pl-10 pr-4 py-2 border border-outline-variant rounded-full bg-surface-container-low focus:ring-1 focus:ring-primary focus:border-primary w-full md:w-64 text-body-sm outline-none transition-all"
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
      <div className="mt-16 flex justify-center">
        <button 
          onClick={handleClearFilters}
          className="flex items-center gap-3 px-12 py-4 border-2 border-outline-variant text-on-surface-variant font-label-uppercase text-label-uppercase hover:border-primary hover:text-primary transition-all group"
        >
          Reset Filters &amp; View All
          <span className="material-symbols-outlined transition-transform group-hover:translate-y-1">expand_more</span>
        </button>
      </div>
    </div>
  );
}
