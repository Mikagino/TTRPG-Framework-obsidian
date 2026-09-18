# Legende
<font color="#974806">ORANGE</font>: muss getestet werden, aber klingt gut :LiSmile:
<font color="#c00000">ROT</font>: sehr unsicher über Implementierung 🥲

---
# Charakter
## <font color="#c00000">Eigenschaften</font>
=> Elegante eigenschaften, jede eigenschaft ist nicht nur zum Rollen, sondern übernimmt mehrere Rollen im Spiel (pun intended xD). Die einzelnen Eigenschaften haben eine passiv-defensive (DEF) oder passiv-offensiv (OFF) Rolle UND eine roleplay (RP) Rolle.

- **OFF:** 1 von 3
- **DEF:** 3 von 3
- **RP:** 6 von 6

| Körperliche | Kurz | Beschreibung                                      | Weitere Rollen                         |
| ----------- | ---- | ------------------------------------------------- | -------------------------------------- |
| Geschick    | GE   | Wie gut kannst du dich selbst körperlich bewegen? | Bewegung (DEF), Fingerfertigkeit (RP)  |
| Stärke      | ST   | Wie gut kannst du anderes bewegen?                | Waffenloser Kampf (OFF), Traglast (RP) |
| Wahrnehmung | WN   | Wie gut sind deine Sinne?                         | Schwierigkeit (DEF), Sinnesorgane (RP) |

| Geistig      | Kurz | Beschreibung                             | Weitere Rollen                      |
| ------------ | ---- | ---------------------------------------- | ----------------------------------- |
| Willenskraft | WK   | Wie ist deine mentale Stärke?            | Lebenspunkte (DEF), Widerstand (RP) |
| Weisheit     | WI   | Wie gut kannst du denken?                | (OFF), Lernen (RP)                  |
| Charisma     | CH   | Wie gut kannst du mit Lebewesen umgehen? | (OFF), Kommunikation (RP)           |

| Weitere      | Kurz | Beschreibung                  | Weitere Rollen |
| ------------ | ---- | ----------------------------- | -------------- |
| Lebenspunkte | LP   | Wie gut ist deine Verfassung? |                |
|              |      |                               |                |
|              |      |                               |                |

> [!info] Formula
> **Life Points (LP):** ((WP - 7) / 2) + 16 (rounded up)
> **Start Gold:** (DEX + CH + WI)
^formula


| WP    | LP  |
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

## Eigenschaftsvorschlag :)
#### Konzentration (KN)
Wie gut kannst du dich auf eine Aufgabe konzentrieren?
(Vorschlag für geistige Eigenschaft 🙂)

### Stärke
Körperlich

- Stärke
- Kraft
- Sprungkraft
- Tragelast

### Geschick
Körperlich

- Fingerfertigkeit
- Agilität
- Geschwindigkeit
- Heimlichkeit

### Konstitution
Körperlich

- Resistenz
- Trefferpunkte
- Ausdauer
- Genesung

### Scharfsinn
Geistig

- Intelligenz
- Wahrnehmung
- Nachforschungen
- Konzentration
- Innere Ruhe
- Zusammenhänge erkennen
- Rätsel lösen

### Wissen
Geistig

- Geschichte
- Natur
- Pflanzen
- Tiere
- Heilkunde

### Charisma
Geistig

- Auftreten
- Täuschen
- Überzeugen
- Verhandeln

---
# Würfe
## <font color="#c00000">Deckung</font>
<font color="#c00000">Sobald Base teilweise von Terrain verdeckt (aus Sicht der Mitte der Base des Angreifers), wird Angriff auf Ziel erschwert</font>
## Aufwändige Tests
Mehrere Eigenschaftstests mit bestimmtem Aufwand, jeder Wurf dauert eine Zeit-Einheit (1 Einheit = ~5 Aufwand = 30 Minuten). Differenzen jedes Wurfs aufsummiert >= Aufwand à geschafft. <font color="#c00000">Wenn x über dem Restaufwand geworfen wird, gilt nur ein Bruchteil der Einheit (Aufwandsbonus).</font>
Für Würfe in speziellen Gebieten bekommt man alle Würfe der verschiedenen Fertigkeiten, die in diese Richtung gehen als Boni/Mali.

| Stufe                              | Bonus   | Schwierigkeit (25+5x) | Aufwand <font color="#c00000">(15+15x)</font> |
| ---------------------------------- | ------- | --------------------- | --------------------------------------------- |
| <font color="#c00000">Unwissen (U) |         | 20         </font>    | ?                                             |
| Anfänger (A)                       | ==D6==  | 25                    | 15                                            |
| Fortgeschritten (F)                | ==D10== | 30                    | 30                                            |
| Experte (X)                        | ==D20== | 35                    | 45                                            |
## <font color="#c00000">Kampfwahrnehmung (basierend auf WN)</font>
In einem Kampf muss die Wahrnehmung des anderen übertroffen werden, um zu treffen

| f() Geschick | f() Kampfgeschick      |
| ------------ | ---------------------- |
|              | $-1$                   |
| 8            | $20 - 3*"Größenstufe"$ |
|              | $+1$                   |
## <font color="#c00000">Größe</font>
Größen werden in folgende Kategorien aufgeteilt, mit den entsprechenden Punkten zur Verteilung auf Level 0 ($f()=42+Delta*12$).
1. Maus 18 ($Delta=-2$)
2. Hund 30 ($Delta=-1$)
3. Mensch 42
4. Pferd 54 ($Delta=+1$)
5. Troll 66 ($Delta=+2$)
6. Drache 78 ($Delta=+3$)
7. Berg 90 ($Delta=+4$)
Entsprechend der Differenz zur Stufe des Ziels erhält man $3*Delta_"Selbst-Ziel"$ Bonus/Malus (Bsp.: Mensch zu Troll sind 2 Stufen, also ein Bonus von $3*2=6$)

### Lebenspunkte
LP wird durch Größe beeinflusst mit folgender Gleichung. Die Base LP können aus der Tabelle genommen oder berechnet werden. Je nachdem ob die Kreatur größer oder kleiner als ein Mensch ist, wird eine andere Formel für die finale LP verwendet.
![[Kurzleitfaden (Ideen)#^LP-Table]]

> [!info] LP-Gleichung, je nach Größe
> $"LP"_"base" = [(("WP" - 8) / 2) + 16 ]$ (rounded up)
> $"LP"_"bigger"="LP"_"base"*6^("Größe"Delta)$
> $"LP"_"smaller"="LP"_"base"/(2^("Größe"Delta))$


> [!example]
> Pferd $->$ $16*6^1=96$ usw.
> Troll $->$ $16*6^2=576$ usw.
## <font color="#c00000">Hinterhalt</font>
Aus dem Hinterhalt anzugreifen senkt die Schwierigkeit von Angriffen um 5
## <font color="#c00000">Kritischer Wurf</font>
Erhöht/Senkt einmalig den Wissenswürfel um eine Stufe (nicht stapelnd)

---
# Bewegung
## Distanzmessung
In Zoll oder Hexagons, vom vorderen Ende bis zum vorderen Ende der Base gemessen; Fernkampf/AoE trifft, sobald Base teilweise innerhalb der Messung ist; Bewegung ist nur durch Gänge, die breiter als Base sind möglich (meist ~1")
## <font color="#c00000">Bewegungsreichweite (BW)</font>

| AG (jeden 2.) | Reichweite in Zoll " $(("AG"/2)+2.5+3*Delta_"Relation zu Mensch")$ |
| ------------- | ------------------------------------------------------------------ |
| 2-3           | 4                                                                  |
| 4-5           | 5                                                                  |
| 6-7           | 6                                                                  |
| 8-9           | 7                                                                  |
| 10-11         | 8                                                                  |
| 12-13         | 9                                                                  |
| 14-15         | 10                                                                 |
| 16-17         | 11                                                                 |
| 18-19         | 12                                                                 |
## <font color="#c00000">Erschwerte Bewegung</font>
Bewegungsdistanz wird halbiert (oder entsprechend Zusatzregel)
## <font color="#c00000">Schwieriges Terrain</font>
Terrain mit Eigenschafts-Label und Schwierigkeit, Bewegung ist erschwert. Beim Betreten eines anderen schwierigen Terrains, endet die Bewegung :LiRightArrow: Eigenschafts-Test x (je nach Terrain)
**Erfolg:** kann erschwerte Bewegung bis zu maximaler Distanz beenden
**Misserfolg:** bleibt im Terrain, Bewegung endet; nächste Bewegung :LiRightArrow: Eigenschafts-Test vor Bewegung
### Beispiele:
**Felswand:** 18 (AG)
**Fluss:** 16 (AG)
**Ölpfütze:** 10 (AG)


---
# Kampf
## <font color="#c00000">Tanzende Initiative</font>
- Jeder hat 3 Aktionen pro Runde
- Initiative beginnt bei einem und bewegt sich von Entität zu Entität (durch Ak, Rk o.ä.) :LiChevronRight: wer beginnt? (folgende Reihenfolge)
	1. **Überraschung:** Welche Partei hat wen überrascht?
	2. **Nähe:** Wer ist am nächsten zu einem Ziel?
	3. **Bewegung:** Wer hat die höchste Bewegungsreichweite? (Oder Präsenz?!)
### Mögliche Aktionen
- Angriff (fügt Schaden zu, gibt Ziel die Initiative, wenn nicht getroffen)
- Verteidigung (wehrt Angriff ab, übernimmt Initiative bei Erfolg)
- Bewegung/Ausweichen (Initiative bei Gegner lassen, aber Bewegung, würfeln nur wenn man angegriffen wird)

---
# Skilltree
## Talents
Die 3 höchsten Eigenschaften sind die Talente eines Charakters, bei Gleichstand entscheidet der Spieler und notiert oder markiert diese 3 Eigenschaften. Sobald der Wert einer Eigenschaft die eines Talents um 2 übersteigt wird sie stattdessen zu einem Talent, hierbei zählt nur das wirkliche Level des Charakters,<font color="#c00000"> keine Items o.ä.</font>
Beim Aufstieg eines Talents erhält der Charakter einen Fähigkeitspunkt (Skillpoint), der zum Freischalten von Fähigkeiten verwendet werden kann (siehe folgende Liste).

---
# Falldamage
above 3m -> Meter / 2 * speed
> [!example]
> 4m :LiArrowRight: 2DMG

---
# Easy Weight
Each item is in a weight class. You can carry one Item above your current weight class. Above that you get DisAdv +1 for each item. You cannot carry items 2 classes above your weight class.
ST :LiArrowRight: Weight class
2+   :LiArrowRight: Weightless (Feather)
5+   :LiArrowRight: Handy (Sword, 1-5kg)
10+ :LiArrowRight: Balanced (Shovel 5-10kg)
15+ :LiArrowRight: Massive (Plate armor, 10-50kg)
25+ :LiArrowRight: Gigantic (Cart, 50+kg)

---

# Skilltree
![[Skilltree]]