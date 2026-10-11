
:LiArrowBigRightDash: Elegante eigenschaften, jede eigenschaft ist nicht nur zum Rollen, sondern übernimmt mehrere Rollen im Spiel (pun intended xD). Die einzelnen Eigenschaften haben immer eine defensive (DEF), offensiv (OFF) UND eine Roleplay (RP) Rolle.

- **Offensiv (OFF)**: 1 von 3
- **Defensiv (DEF):** 3 von 3
- **Roleplay (RP)**: 6 von 6

| Körperliche      | Beschreibung                                      | Weitere Rollen                                                     |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| Geschick (GE)    | Wie gut kannst du dich selbst körperlich bewegen? | Bewegung (DEF), leichte Waffen (OFF), Fingerfertigkeit (RP)        |
| Stärke (ST)      | Wie gut kannst du anderes bewegen?                | ??? (DEF), Waffenloser Kampf & schwere Waffen (OFF), Traglast (RP) |
| Wahrnehmung (WN) | Wie gut sind deine Sinne?                         | Schwierigkeit (DEF), Fernkampf (OFF), Sinnesorgane (RP)            |

| Geistig           | Beschreibung                             | Weitere Rollen                                 |
| ----------------- | ---------------------------------------- | ---------------------------------------------- |
| Willenskraft (WK) | Wie ist deine mentale Stärke?            | Lebenspunkte (DEF), ??? (OFF), Widerstand (RP) |
| Weisheit (WI)     | Wie gut kannst du denken?                | ??? (DEF), Magie (OFF), Lernen (RP)            |
| Charisma (CH)     | Wie gut kannst du mit Lebewesen umgehen? | (DEF), Betören (OFF), Kommunikation (RP)       |
>[!example]- Beispielwerte
>2 — Untergrenze
>4 — Unbeholfen
>8 — Durchschnitt
>10 — Anfänger
>13 — Fortgeschritten
>16 — Experte
>18 — Obergrenze

## Berechnete Werte
Besondere Eigenschaften werden aus den Grundeigenschaften ermittelt.

| Weitere           | Beschreibung                                   | Ermittlung                             |
| ----------------- | ---------------------------------------------- | -------------------------------------- |
| Lebenspunkte (LP) | Wie gut ist deine Verfassung?                  | $(("WK" - 7) / 2) + 16$ (aufgerundet)  |
| Gold (G)          | Wie viel Gold besitzt du zu Spielbeginn?       | $("GE" + "CH" + "WI") * 2$             |
| Ausweichen (AW)   | Wie gut weichst du automatisch in Kämpfen aus? | $("GE" + "WN") / 3 + 12$ (aufgerundet) |
^formula

Hier eine Tabelle um LP, ohne die obere Formel zu ermitteln.

| WK    | LP  |
| ----- | --- |
| 2-3   | 14  |
| 4-5   | 15  |
| 6-7   | 16  |
| 8-9   | 17  |
| 10-11 | 18  |
| 12-13 | 19  |
| 14-15 | 20  |
| 16-17 | 21  |
| 18-19 | 22  |
^LP-Table

Hier eine Tabelle, um AW zu ermitteln, indem WN und GE zusammengerechnet wird.

| $"WN"+"GE"$ | AW  |
| ----------- | --- |
| 4-6         | 14  |
| 7-9         | 15  |
| 10-12       | 16  |
| 13-15       | 17  |
| 16-18       | 18  |
| 19-21       | 19  |
| 22-24       | 20  |
| 25-27       | 21  |
| 28-30       | 22  |
| 31-33       | 23  |
| 34-36       | 24  |
| 37-39       | 25  |
