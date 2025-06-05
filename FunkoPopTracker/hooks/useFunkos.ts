import { useState, useEffect } from 'react';
import { initDatabase, addFunkoPop, getAllFunkoPops, deleteFunkoPop, updateFunkoPop } from '../utils/database';

export const useFunkos = () => {
  const [funkos, setFunkos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      await initDatabase();
      await loadFunkos();
    } catch (error) {
      console.error('Database initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFunkos = async () => {
    try {
      const data = await getAllFunkoPops();
      setFunkos(data);
    } catch (error) {
      console.error('Error loading funkos:', error);
    }
  };

  const addFunko = async (funkoData) => {
    try {
      await addFunkoPop(funkoData);
      await loadFunkos(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error adding funko:', error);
      return false;
    }
  };

  const removeFunko = async (id) => {
    try {
      await deleteFunkoPop(id);
      await loadFunkos(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting funko:', error);
      return false;
    }
  };

  const editFunko = async (id, funkoData) => {
    try {
      await updateFunkoPop(id, funkoData);
      await loadFunkos(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating funko:', error);
      return false;
    }
  };

  return {
    funkos,
    loading,
    addFunko,
    removeFunko,
    editFunko,
    refreshFunkos: loadFunkos
  };
};