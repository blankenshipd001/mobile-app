import { useState, useEffect } from 'react';
import { initDatabase, addFunkoPop, getAllFunkoPops, deleteFunkoPop, updateFunkoPop, getFunkoPopById } from '../utils/database';
import { Funko } from '@/utils/funko';

export const useFunkos = () => {
  const [funkos, setFunkos] = useState<Funko[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDB();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Initializes the database and loads the Funko Pops.
   * This function is called once when the component mounts.
   * It sets up the database and fetches all Funko Pops to display.
   * @returns {Promise<void>} A promise that resolves when the database is initialized and Funko Pops are loaded.
   * @throws {Error} If there is an error during database initialization or loading Funkos.
   */
  const initDB = async (): Promise<void> => {
    try {
      await initDatabase();
      await loadFunkos();
    } catch (error) {
      console.error('Database initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads all Funko Pops from the database.
   * This function fetches all Funko Pops and updates the state.
   * It is called after the database is initialized to populate the initial list of Funkos.
   * @returns {Promise<void>} A promise that resolves when the Funkos are loaded.
   * @throws {Error} If there is an error while fetching Funkos from the database
   */
  const loadFunkos = async (): Promise<void> => {
    try {
      const data: Funko[] = await getAllFunkoPops();
      setFunkos(data);
    } catch (error) {
      console.error('Error loading funkos:', error);
    }
  };

  /**
   * Adds a new Funko Pop to the database.
   * This function takes Funko data as input, adds it to the database, and refreshes the list of Funkos.
   * @param {Funko} funkoData - The Funko data to be added.
   * @returns {Promise<boolean>} A promise that resolves to true if the Funko was added successfully, false otherwise.
   */
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

  /**
   * Get a specific Funko Pop by its ID.
   * This function retrieves a Funko Pop from the database using its ID.
   * It returns the Funko object if found, or null if not found.  
   * 
   * @param id - The ID of the Funko Pop to retrieve.
   * This function fetches a Funko Pop by its ID from the database.
   * If the Funko Pop is found, it returns the Funko object; otherwise,
   * it returns null.
   * @returns {Promise<Funko | null>} A promise that resolves to the Funko Pop object if found, or null if not found.
   * @throws {Error} If there is an error while fetching the Funko Pop by
   */
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

  /**
   * Removes a Funko Pop from the database.
   * This function deletes a Funko Pop by its ID and refreshes the list of Funkos.
   * @param {string} id - The ID of the Funko Pop to be removed.
   * @returns {Promise<boolean>} A promise that resolves to true if the Funko was removed successfully, false otherwise.
   * @throws {Error} If there is an error while deleting the Funko Pop from the database 
   */
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

  /**
   * Edits an existing Funko Pop in the database.
   * This function updates an existing Funko Pop in the database.
   * It takes the Funko Pop ID and the updated Funko data as input,
   * updates the Funko Pop in the database, and refreshes the list of Funkos.
   * 
   * @param id - The ID of the Funko Pop to be edited.
   * @param {Funko} funkoData - The updated Funko data to be saved.
   * @returns {Promise<boolean>} A promise that resolves to true if the Funko was edited successfully, false otherwise.
   * @throws {Error} If there is an error while updating the Funko Pop in the database
   */
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