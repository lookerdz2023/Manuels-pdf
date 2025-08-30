import type { Book } from '../types';

// IMPORTANT: Remplacez cette URL par le lien de publication CSV de votre propre Google Sheet.
// Pour obtenir ce lien : Dans Google Sheets, allez dans "Fichier" -> "Partager" -> "Publier sur le web".
// Choisissez la feuille de calcul souhaitée, sélectionnez "Valeurs séparées par des virgules (.csv)", puis cliquez sur "Publier".
// Copiez le lien généré ici.
const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRn210PIVwwr5P4c0ROctLdow560UZhO7EZfdP9NJqyhuQskVy7LAnC8pVqkBdFlBvIJ03JaEzdbJ31/pub?gid=0&single=true&output=csv';

// Mappage des en-têtes attendus dans le CSV vers les clés de l'objet Book.
// Le CSV doit avoir 5 colonnes dans cet ordre: niveau, matiere, titre, miniature, pdfUrl.
const CSV_HEADERS: (keyof Book)[] = ['level', 'subject', 'title', 'coverUrl', 'pdfUrl'];

/**
 * Analyse une seule ligne d'un fichier CSV, en gérant les champs entre guillemets qui peuvent contenir des virgules.
 * C'est une implémentation simple pour éviter d'ajouter une bibliothèque externe.
 * @param row La chaîne de caractères représentant une ligne du CSV.
 * @returns Un tableau de chaînes de caractères représentant les valeurs des cellules.
 */
const parseCsvRow = (row: string): string[] => {
    const values: string[] = [];
    let currentVal = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
            // Gère le cas des doubles guillemets ("") à l'intérieur d'un champ
            if (inQuotes && row[i + 1] === '"') {
                currentVal += '"';
                i++; // On saute le deuxième guillemet de la paire
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(currentVal);
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    values.push(currentVal); // Ajoute la dernière valeur

    // Nettoie les valeurs : supprime les espaces superflus et les guillemets de début/fin
    return values.map(v => v.trim().replace(/^"|"$/g, ''));
};


export const fetchAndParseBooks = async (): Promise<Book[]> => {
  try {
    // Ajout de { cache: 'no-store' } pour s'assurer que les données les plus récentes sont toujours récupérées.
    const response = await fetch(googleSheetCsvUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Erreur réseau : ${response.statusText}`);
    }
    const csvText = await response.text();
    // Gère les fins de ligne Windows (\r\n) et Unix (\n) pour une meilleure robustesse
    const rows = csvText.trim().split(/\r?\n/);

    // Ignorer la première ligne (en-têtes)
    const dataRows = rows.slice(1);

    const books: Book[] = dataRows.map(row => {
      // Gère les virgules à l'intérieur des champs cités avec un parseur plus robuste.
      if (!row) return null;
      const values = parseCsvRow(row);
      
      if (values.length !== CSV_HEADERS.length) {
          console.warn("Ligne CSV ignorée car le nombre de colonnes est incorrect:", row);
          return null;
      }
      
      const book = values.reduce((obj, val, index) => {
        const key = CSV_HEADERS[index];
        if (key) {
          (obj as any)[key] = val;
        }
        return obj;
      }, {} as Book);
      return book;
    // Filtre assoupli : on ne requiert que les champs essentiels (niveau, matière, titre).
    // Cela permet de charger des livres même si les URLs sont manquantes.
    }).filter((book): book is Book => !!book && !!book.level && !!book.subject && !!book.title);

    if (books.length === 0 && dataRows.length > 0) {
        console.warn("Aucun livre n'a été chargé malgré la présence de données. Vérifiez le format du fichier CSV et le mappage des en-têtes.");
    }

    return books;
  } catch (error) {
    console.error("Échec du chargement ou de l'analyse des données de la feuille de calcul :", error);
    if (googleSheetCsvUrl.includes('YOUR_CSV_URL_HERE')) {
       throw new Error("Veuillez remplacer l'URL de démonstration de Google Sheet dans 'services/dataService.ts' par votre propre URL de CSV publié.");
    }
    throw new Error("Impossible de charger les données des livres. Veuillez vérifier l'URL du CSV et votre connexion internet.");
  }
};
