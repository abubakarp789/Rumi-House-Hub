import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import EventCard from './EventCard';
import SocietyCard from './SocietyCard';

it('renders event capacity from the backend capacity and registered fields', () => {
  render(
    <MemoryRouter>
      <EventCard event={{
        _id: 'event-1',
        title: 'Research Showcase',
        capacity: 120,
        registered: 45,
        location: 'Academic Block',
        startDateTime: '2026-06-22T10:00:00.000Z',
        societyId: { name: 'Namal Computing Society' }
      }} />
    </MemoryRouter>
  );

  expect(screen.getByText('45/120 Seats')).toBeVisible();
});

it('renders the society patron from the backend patronName field', () => {
  render(
    <MemoryRouter>
      <SocietyCard society={{
        _id: 'society-1',
        name: 'Namal Literary & Debating Society (LDS)',
        category: 'literary',
        description: 'A student society.',
        patronName: 'Dr. Ayesha Khan',
        facultyCoordinator: 'Mr. Ali Raza',
        memberCount: 32
      }} />
    </MemoryRouter>
  );

  expect(screen.getByText('Dr. Ayesha Khan')).toBeVisible();
  expect(screen.getByText('32 Active')).toBeVisible();
});
