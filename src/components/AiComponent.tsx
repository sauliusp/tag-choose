import React, { useState, useEffect } from 'react';
import { aiService } from '../services/AiService';
import { useStoreContext } from '../StoreContext';

const AiComponent = () => {
  const { computed } = useStoreContext();
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<{
    defaultTemperature: number;
    defaultTopK: number;
    maxTopK: number;
  } | null>(null);

  useEffect(() => {
    async function fetchDefaults() {
      try {
        const defaults = await aiService.initDefaults();
        setDefaults(defaults);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchDefaults();
  }, []);

  const handlePrompt = async (prompt: string) => {
    try {
      if (!defaults) throw new Error('Defaults not loaded');
      const params = {
        systemPrompt:
          'You are a friendly AI assistant that helps categorize web pages into folders. You are given a page URL and title and asked to categorize it into one or more folders.',
        temperature: defaults.defaultTemperature,
        topK: defaults.defaultTopK,
      };
      const result = await aiService.runPrompt(prompt, params);
      setResponse(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {response && <p>Response: {response}</p>}
      <p>{computed.prompt}</p>
      <button onClick={() => handlePrompt(computed.prompt)}>Run Prompt</button>
    </div>
  );
};

export default AiComponent;
