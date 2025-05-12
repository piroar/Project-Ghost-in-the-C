# Project-Ghost-in-the-C

Κύριο Πρόβλημα: Κάθε μέρα να εκχωρείται ένας γρίφος μέσω LLM στην ιστοσελίδα, τον οποίο να πρέπει να επιλύσει ο χρήστης
3 Μεγάλα Υποπροβλήματα:
1.Επικοινωνία με LLM και εισαγωγή γρίφου κάθε μέρα
2.Παροχή δυνατότητας επίλυσης του γρίφου στον χρήστη μέσω κάποιου terminal και έλεγχος της λύσης
3.Εμφάνιση (background, ευχηρστία)

Ανάλυση Υποπροβλήματος 1.:
1.1:Επικοινωνία με LLM
1.2:Έλεγχος ώρας  και επανάληψη του 1.1 μετά από ένα προκαθορισμένο χρονικό διάστημα(24 ώρες)

Ανάλυση Υποπροβλήματος 2.:
2.1:Παροχή terminal για την επίλυση του γρίφου
2.2:Έλεγχος της λύσης


site:
npm run dev

docker shell:
sudo docker run -p 4200:4200 shellinabox
shelluser:password

server:
source env/bin/activate
node server.cjs(ανοίγει το venv με τα dependencies)
deactivate

Απαιτήσεις:
1) architecture diagram
2) docker based όλο
3) unit tests και structured outputs
(check highlight.js)