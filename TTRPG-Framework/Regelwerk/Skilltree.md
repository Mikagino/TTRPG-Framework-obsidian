Aufgeteilt in Stufen. Um einen Skill der nächsten Stufe freizuschalten benötigt man entweder einen Skill der gleichen Eigenschaft eine Stufe darunter oder zwei mit unterschiedlichen Eigenschaften eine Stufe darunter.

```mermaid
mindmap
  root((Skilltree))
        
        [**Körperkontrolle** *AG/GE*|*AG/WN*|*WN/GE* 0
        Checks in den gewählten Eigenschaften können einmal wiederholt werden]
            [**Flinkhand** *GE* 2
            Zwei Aktionen, außer Bewegung, wie eine ausführen, einmal pro Kampfrunde; Fernkampf auch im Nahkampf möglich]
                {{**Geschickswille** *GE* 4
                bei geschafftem GE-Check wird WP entsprechend der Differenz regeneriert}}
            {{**Feingespür** *WN* 2
            Geschaffte WN-Checks gewinnen, egal ob Gegner besser ist, Schattenschritt gleicht aus}}
            [**Bewegungsspezialist** *AG* 2
            AG-Check zu gelungenem Check ändern]
```
```mermaid
mindmap
  root((Skilltree))

        {{**Flinkheit** *AG* 0
        AG-Checks/Angriffe gegen Spieler um AG/2 aufgerundet erschwert}}
            [**Weitsprung** *AG/ST* 2
            Sprung über ein Feld als Bewegung; Angriff + Bewegung möglich]
            [**Wandlauf** *AG/GE* 2
            Lauf von Boden über Wandfeld; Angriff + Bewegung möglich]
            {{**Schattenschritt** *AG* 2
            Geschaffte AG-Checks gewinnen, egal ob Gegner besser ist, Feingespür gleicht aus; im Kampf können Angriffe von hinten durchgeführt werden}}
```


``` mermaid
mindmap
  root((Skilltree))
        [**Täuschungsmanöver** *GE* 0
        Spieler und Gegner variable Erschwernis geben]
            {{**Präzision** *GE* 2
            Krit. range erhöht -> 1-2, 19-20}}
                [**Effektives Täuschungsmanöver** *GE* 4
                Spieler entscheidet über Effekt bei Treffer einer Finte: Bluten D4, Schildbruch D4, Waffenverlust D4]
                [**Tötungswille** *GE* 4
                Bei Verursachen einer tödlichen Wunde regeneriert der Spieler WP entsprechend der Stufe des Ziels/2]
            [**Konter** *GE/ST* 2
            geschaffte Verteidigung in Angriff umwandeln]
                [**Effektiver Konter** *GE/ST* 4
                Spieler entscheidet über Effekt bei geschafftem Konter: Schmettern D4, Betäubung D4, Waffenverlust D4]

        [**Wucht** *ST* 0
        Nahkampf: ST-Check erhöht DMG um Differenz; Fernkampf: Ziel dahinter erhält DMG/2 abgerundet, bsp. 3 1 0]
            {{**Muskelprotz** *ST* 2
            Stärke steigert schon bei Hälfte der Checks das Level}}
                {{**Angeberwille** *ST* 4
                Regeneriert WP bei angeberischen/epischen Check}}
                    [**Letzter Kampf** *ST* 6
                    Eine letzte freie Runde nach dem Erhalten des Todesschlags]
            [**Hochsprung** *ST/AG* 2
            Sprung auf höher gelegenes Gelände; Kampf: Schaden auf alle im aktuellen Feld]
            {{**Kombo** *ST/GE* 2
            Checks erhalten einen Würfelvorteil für jeden direkt davor geschafften}}
                [**Effektive Wucht** *ST/GE* 4
                Spieler entscheidet über Effekt bei Wucht: Schmettern D4, Betäuben D4, Durchschlag D4]
        
        [*CH*]
            [**Betören** *CH* 2
            Ein Ziel betören, erhält also]


    (**Wissen**)

        [**Handwerk** *GE*
        Herstellung aus Materialien ermöglicht]
            [**Alchemie** *GE/WI*]
            [**Kochkunst** *GE/WN*]
            [**Schmiedekunst** *GE/ST*]
            [**Natürliches Bauen** *GE*
            Handwerk mit natürlichen Materialien ermöglicht]

        [**Forschung** *WI*]

        {{**"Rassen"-freund** *CH*
        Checks gegenüber bestimmter Rasse erhalten doppelten CH-Wert}}

```

```mermaid
mindmap
	root((Skilltree))
		{{**Panzer** *RW|SR* 0
			RW um 5 oder SR um 2 erhöht}}
				[**Präsenz** *RW/ST* 2
				Alle Aufmerksamkeit auf Spieler ziehen; positive Auswirkung, wenn CH zu Talenten zählt, sonst negativ]
					{{**Schadenswille** *RW* 4
					Ein Drittel vom verursachtem Schaden wird  abgerundet WP regeneriert}}
					[**Unerschütterliche Präsenz** *RW/CH* 4
					Verbündete ignorieren den nächsten Effekt AoE 2]
				{{**Effekt-Resistenz** *RW* 2
				Erhaltener Schaden durch bestimmten Effekt wird halbiert}}
					{{**Effekt-Immunität** *RW* 4
					Kein Schaden durch bestimmten Effekt}}
					[**Immunitätswille** *RW* 4
					Der nächste erhaltene DMG wird zu Heilung]
				{{**Berserker** *SR/ST* 2
				Unter Hälfte der LP kosten Fähigkeiten nur die Hälfte abgerundet, auch 0 möglich}}
					{{**Todeskampf** *SR/ST* 4
					Auf dem Boden hat der Spieler eine Aktion/Reaktion pro Runde mit einem Würfelnachteil}}
						[**Untödliche Wunde** *SR/ST* 6
						Der Spieler kann nach einer tödlichen Wunde mit 2 Aktionen wieder aufstehen]
					{{**Schmerzenswille** *SR/ST* 4
					Beim Erhalten von Schaden wird immer auf WP gewürfelt und bei Erfolg einer regeneriert; schnelleres Aufleveln, durch mehr Checks}}
						[**Gesteigerter Wille** *SR/ST* 6
						Durch eigene Fähigkeiten können 1/2 der WP mehr als maximal möglich erreicht werden]
```
