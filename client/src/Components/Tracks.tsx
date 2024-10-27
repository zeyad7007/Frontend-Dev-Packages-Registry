// src/components/Tracks.tsx
import React, { useState, useEffect } from 'react';
import { getTracks } from '../api';

const Tracks: React.FC = () => {
  const [tracks, setTracks] = useState<string[]>([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const result = await getTracks();
        setTracks(result);
      } catch (error) {
        console.error("Failed to fetch tracks", error);
      }
    };
    fetchTracks();
  }, []);

  return (
    <div className="container">
      <h2>Planned Tracks</h2>
      <ul>
        {tracks.map((track, index) => (
          <li key={index}>{track}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tracks;
