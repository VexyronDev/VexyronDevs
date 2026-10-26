# Vexyron – Website

Das ist die Webseite für Vexyron. Sie zeigt, ob dein Server gerade läuft, und führt die Tester zur Anmeldung. **Die KI selbst läuft auf deinem PC**, nicht bei GitHub. GitHub liefert nur diese Seite aus.

## Auf GitHub stellen (einmalig)

1. In **GitHub Desktop**: `File › Add local repository…` und diesen Ordner `Vexyron-GitHub` wählen. Wenn er nicht als Repository erkannt wird, auf „create a repository“ klicken.
2. **Publish repository** (oben). Der Name kann `vexyron` sein. Die Seite muss öffentlich sein, sonst geht GitHub Pages im Gratis-Konto nicht.
3. Auf github.com im Repository: **Settings › Pages › Build and deployment › Source: Deploy from a branch › Branch: `main` / `(root)` › Save**.
4. Nach ein bis zwei Minuten steht oben die Adresse, meistens `https://DEINNAME.github.io/vexyron/`. Das ist der Link für deine Tester.

## Jeden Tag: Server starten

1. Doppelklick auf **`Vexyron-Server starten.bat`** auf dem Desktop (Vexyron am PC vorher schließen).
2. Nach ungefähr einer Minute zeigt das Fenster die **Adresse** und den **Einladungscode**. Beides steht auch in `Vexyron-Server-Adresse.txt` auf dem Desktop.
3. Die Adresse ändert sich bei **jedem** Start. Das Programm schreibt sie von selbst in `server.json` in diesem Ordner. Du musst die Datei nur noch hochladen: in GitHub Desktop siehst du die Änderung, schreibst irgendeinen Text unten rein (zum Beispiel „Adresse“), klickst **Commit to main** und dann **Push origin**. Nach ein bis zwei Minuten zeigt die Seite „Server ist online“.
4. Das Fenster offen lassen, solange die Tester dran sind. Fenster schließen oder `Strg+C` beendet den Server.

**Es geht auch ohne Hochladen:** Gib den Testern direkt die Adresse aus dem Fenster. Die Webseite ist nur der schöne Weg dahin.

### Adresse automatisch hochladen (optional)
Wenn dir das Hochladen zu lästig ist: In `%APPDATA%\luauforge\server\config.json` `"autoPublish": true` setzen. Dann macht der Server den Commit und den Push selbst, sobald die neue Adresse da ist. Das klappt nur, wenn dieser Ordner ein Git-Repository ist und du in GitHub Desktop angemeldet bist.

## Die Tester

- Jeder Tester legt sich auf der Anmeldeseite **selbst ein Konto an** (Registrieren, Name, Passwort, Einladungscode). Die Konten sind getrennt: keiner sieht die Chats des anderen. Chats liegen auf dem Gerät des Testers, nicht auf deinem PC.
- Den **Einladungscode** gibst du nur den Leuten, die rein sollen. Neuen Code erzeugen oder Registrierung zumachen: `%APPDATA%\luauforge\server\config.json`, dort `"registration": "closed"` oder `"invite"` und `"invite": "neuer-code"`, dann den Server neu starten.
- Tageslimit pro Tester (`dailyMessages`, Standard 150) und Nachrichten pro Minute (`perMinute`) stehen in derselben Datei.
- Mit `node scripts\test-pc-server.js ADRESSE CODE` im Vexyron-Ordner prüfst du, ob alles läuft (legt zwei Test-Konten an und löscht sie wieder).

## Wichtig

- Der PC muss **an** sein und Internet haben. Der Server hält ihn wach (kein Standby), aber nicht, wenn du ihn herunterfährst.
- Die KI und der Server brauchen Grafikspeicher. Am besten läuft währenddessen nichts anderes mit Vexyron auf der Grafikkarte.
- Trage in `datenschutz.html` die gelb markierten Stellen mit deinen Daten ein, bevor du die Seite weitergibst, und lass sie prüfen.
- Lege **nie** Passwörter, API-Schlüssel (zum Beispiel `fish.json`) oder den Ordner `%APPDATA%\luauforge` in dieses Repository.
