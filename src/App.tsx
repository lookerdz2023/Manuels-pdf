import React, { useState, useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Book } from './types';
import { fetchAndParseBooks } from './services/dataService';
import CustomSelect from './components/Select';
import BookCover from './components/BookCover';

const telegramButtonStyle: CSSProperties = {
  display: 'inline-block',
  padding: '10px 20px',
  margin: '20px 0',
  backgroundColor: '#0088cc',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold',
  textAlign: 'center'
};

const App: React.FC = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const books = await fetchAndParseBooks();
        setAllBooks(books);
      } catch (e: any) {
        setError(e.message || 'Une erreur inconnue est survenue.');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  const levels = useMemo(() => {
    return [...new Set(allBooks.map((book) => book.level))].sort();
  }, [allBooks]);

  const subjects = useMemo(() => {
    if (!selectedLevel) return [];
    return [
      ...new Set(
        allBooks
          .filter((book) => book.level === selectedLevel)
          .map((book) => book.subject)
      ),
    ].sort();
  }, [allBooks, selectedLevel]);

  const titles = useMemo(() => {
    if (!selectedLevel || !selectedSubject) return [];
    return allBooks
      .filter(
        (book) =>
          book.level === selectedLevel && book.subject === selectedSubject
      )
      .map((book) => book.title)
      .sort();
  }, [allBooks, selectedLevel, selectedSubject]);

  const selectedBook = useMemo(() => {
    if (!selectedLevel || !selectedSubject || !selectedTitle) return null;
    return allBooks.find(
      (book) =>
        book.level === selectedLevel &&
        book.subject === selectedSubject &&
        book.title === selectedTitle
    );
  }, [allBooks, selectedLevel, selectedSubject, selectedTitle]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLevel(e.target.value);
    setSelectedSubject('');
    setSelectedTitle('');
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
    setSelectedTitle('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTitle(e.target.value);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center' }}>
        <h1>Manuels PDF</h1>
        <a
          href="https://t.me/joinchat/+IYnhtbsCFy0yNDZk"
          target="_blank"
          rel="noopener noreferrer"
          style={telegramButtonStyle}
        >
          Join Telegram group to download
        </a>
      </header>
      {loading && <p>Chargement des données...</p>}
      {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}
      {!loading && !error && (
        <main style={{ marginTop: '30px' }}>
          <CustomSelect
            id="level-select"
            label="Niveau"
            value={selectedLevel}
            options={levels}
            onChange={handleLevelChange}
          />
          <CustomSelect
            id="subject-select"
            label="Matière"
            value={selectedSubject}
            options={subjects}
            onChange={handleSubjectChange}
            disabled={!selectedLevel}
          />
          <CustomSelect
            id="title-select"
            label="Titre"
            value={selectedTitle}
            options={titles}
            onChange={handleTitleChange}
            disabled={!selectedLevel || !selectedSubject}
          />
          {selectedBook && (
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <h2 style={{ marginBottom: '16px' }}>{selectedBook.title}</h2>
              <BookCover coverUrl={selectedBook.coverUrl} pdfUrl={selectedBook.pdfUrl} />
            </div>
          )}
        </main>
      )}
    </div>
  );
};

export default App;
