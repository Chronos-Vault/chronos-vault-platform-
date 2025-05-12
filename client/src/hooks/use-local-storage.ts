import { useState, useEffect } from 'react';

/**
 * A hook for storing and retrieving data from localStorage
 * @param key The localStorage key
 * @param initialValue Default value if key doesn't exist in localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get value from localStorage or use initialValue
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      
      // If no item exists, return the initial value
      if (!item) return initialValue;
      
      // Check for known problematic values and handle them
      if (item === 'undefined' || item === 'null' || item === '[object Object]') {
        console.warn(`Found corrupted localStorage value for "${key}": "${item}", resetting to default.`);
        window.localStorage.removeItem(key);
        return initialValue;
      }
      
      try {
        // For boolean values stored as strings
        if (item === 'true') return true as unknown as T;
        if (item === 'false') return false as unknown as T;
        
        // Try to parse as JSON
        const parsed = JSON.parse(item);
        
        // Double-check the parsed result for validity
        if (parsed === null || parsed === undefined) {
          console.warn(`Parsed value for "${key}" is null/undefined, resetting.`);
          window.localStorage.removeItem(key);
          return initialValue;
        }
        
        return parsed;
      } catch (parseError) {
        // If JSON parsing fails but it's not one of the special values above,
        // it might be a plain string, so return it directly
        console.warn(`Error parsing "${key}", treating as string:`, parseError);
        return item as unknown as T;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      // Reset the corrupted key
      window.localStorage.removeItem(key);
      return initialValue;
    }
  };

  // State to store the value
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Set a new value and store it in localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Validate value before storing (check for common problematic values)
      if (valueToStore === undefined || valueToStore === null) {
        console.warn(`Attempted to set undefined/null value for "${key}", using initialValue instead.`);
        
        // Use initial value instead of null/undefined
        setStoredValue(initialValue);
        
        if (typeof window !== 'undefined') {
          // Use a safe fallback value in localStorage
          window.localStorage.setItem(key, JSON.stringify(initialValue));
        }
        return;
      }
      
      // Safety check for complex objects - ensure they can be serialized/deserialized properly
      try {
        const testSerialization = JSON.stringify(valueToStore);
        const testDeserialization = JSON.parse(testSerialization);
        
        // Verify the serialization round-trip didn't corrupt the data
        if (
          (typeof valueToStore === 'object' && valueToStore !== null && 
          Object.keys(valueToStore).length > 0 && 
          Object.keys(testDeserialization).length === 0) ||
          testSerialization === '{}' && JSON.stringify(valueToStore) !== '{}'
        ) {
          console.warn(`Serialization issue detected for "${key}", using safe value`);
          setStoredValue(initialValue);
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          return;
        }
      } catch (serializationError) {
        console.warn(`Failed serialization test for "${key}"`, serializationError);
        setStoredValue(initialValue);
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return;
      }
      
      // If we passed all checks, save state
      setStoredValue(valueToStore);
      
      // Save to localStorage with proper error handling
      if (typeof window !== 'undefined') {
        try {
          const serialized = JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);
        } catch (setError) {
          console.error(`Failed to save "${key}" to localStorage:`, setError);
          
          // Try to recover by removing the item first, then setting it again
          window.localStorage.removeItem(key);
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Update stored value if the key changes
  useEffect(() => {
    setStoredValue(readValue());
  }, [key]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        try {
          // If the value was removed (null)
          if (e.newValue === null) {
            console.log(`"${key}" was removed in another window, resetting to initialValue`);
            setStoredValue(initialValue);
            return;
          }
          
          // Prevent parsing corrupted values
          if (e.newValue === 'undefined' || e.newValue === 'null' || e.newValue === '[object Object]') {
            console.warn(`Received corrupted value for "${key}" from another window: "${e.newValue}"`);
            setStoredValue(initialValue);
            return;
          }
          
          // Handle special string values
          if (e.newValue === 'true') {
            setStoredValue(true as unknown as T);
            return;
          }
          
          if (e.newValue === 'false') {
            setStoredValue(false as unknown as T);
            return;
          }
          
          // Try to parse as JSON
          const parsed = JSON.parse(e.newValue);
          
          // Double-check the result
          if (parsed === null || parsed === undefined) {
            console.warn(`Parsed null/undefined for "${key}" from another window`);
            setStoredValue(initialValue);
            return;
          }
          
          // Update with the valid parsed value
          setStoredValue(parsed);
        } catch (error) {
          console.warn(`Error handling storage event for "${key}":`, error);
          
          // Fallback to treating the value as a plain string
          if (e.newValue) {
            setStoredValue(e.newValue as unknown as T);
          } else {
            setStoredValue(initialValue);
          }
        }
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, initialValue]);

  return [storedValue, setValue];
}