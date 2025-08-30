import React from 'react';

interface BookCoverProps {
  coverUrl: string | null;
  pdfUrl: string | null;
}

const BookCover: React.FC<BookCoverProps> = ({ coverUrl, pdfUrl }) => {
  const placeholder = (
    <div style={{
      width: '300px',
      height: '400px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #ccc',
      color: '#aaa'
    }}>
      La couverture du livre apparaîtra ici.
    </div>
  );

  const image = (
    <img
      src={coverUrl || ''}
      alt="Couverture du livre"
      style={{
        maxWidth: '300px',  // Limite la largeur à 300px maximum
        height: 'auto',     // La hauteur s'ajustera automatiquement pour garder les proportions
        display: 'block'    // Empêche les espaces indésirables sous l'image
      }}
    />
  );

  const content = coverUrl ? image : placeholder;

  if (pdfUrl && coverUrl) {
    return (
      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
};

export default BookCover;
