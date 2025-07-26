import { useState, useEffect } from "react";
import quoteModel from "../models/QuoteModel.js";

export function useQuoteModel() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBGColor, setCurrentBGColor] = useState("#DBC4F0");

  useEffect(() => {
    // Subscribe to model changes
    const unsubscribe = quoteModel.subscribe(() => {
      setQuotes(quoteModel.getAllQuotes());
      setCurrentBGColor(quoteModel.getCurrentBGColor());
    });

    // Initial load
    const loadData = async () => {
      await quoteModel.load();
      setQuotes(quoteModel.getAllQuotes());
      setCurrentBGColor(quoteModel.getCurrentBGColor());
      setLoading(false);
    };

    loadData();

    return unsubscribe;
  }, []);

  return {
    quotes,
    loading,
    currentBGColor,
    getRandomQuote: () => quoteModel.getRandomQuote(),
    addQuote: (text, author) => quoteModel.addQuote(text, author),
    editQuote: (id, text, author) => quoteModel.editQuote(id, text, author),
    deleteQuote: (id) => quoteModel.deleteQuote(id),
    importQuotes: (newQuotes) => quoteModel.importQuotes(newQuotes),
    exportQuotes: () => quoteModel.exportQuotes(),
    clearQuotes: () => quoteModel.clear(),
    getBGColors: () => quoteModel.getBGColors(),
    setCurrentBGColor: (color) => quoteModel.setCurrentBGColor(color),
    createGradientFromColor: (color) =>
      quoteModel.createGradientFromColor(color),
  };
}
