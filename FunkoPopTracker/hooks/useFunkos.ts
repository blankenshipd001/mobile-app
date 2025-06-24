import { useState, useEffect } from 'react';
import { initDatabase, addFunkoPop, getAllFunkoPops, deleteFunkoPop, updateFunkoPop, getFunkoPopById } from '../utils/database';
import { Funko } from '@/utils/funko';

export const useFunkos = () => {
  const [funkos, setFunkos] = useState<Funko[]>([]);
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
      const data: Funko[] = await getAllFunkoPops();
      setFunkos(data);
    } catch (error) {
      console.error('Error loading funkos:', error);
    }
  };

  const addFunko = async (funkoData: Funko): Promise<boolean> => {
    try {
      await addFunkoPop(funkoData);
      await loadFunkos(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error adding funko:', error);
      return false;
    }
  };

  //TODO this feels wrong come back to this
  const getFunkoById = async (id: string): Promise<Funko | null> => {
    try {
      const funko = await getFunkoPopById(id.toString());
      if (!funko) {
        console.error('Funko not found with ID:', id);
        return null;
      }
      return funko;
    } catch (error) {
      console.error('Error fetching funko by ID:', error);
      return null;
    }
  };

  const removeFunko = async (id: string): Promise<boolean> => {
    try {
      await deleteFunkoPop(id);
      await loadFunkos(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting funko:', error);
      return false;
    }
  };

  const editFunko = async (id: string, funkoData: Funko): Promise<boolean> => {
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
    getFunkoById,
    refreshFunkos: loadFunkos
  };
};