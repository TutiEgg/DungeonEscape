# Dungeon EEscape
> Hier gehts zur Live Demo 
> [_here_](https://tutiegg.github.io/dungeonescape/). 

> Link zum Github-Repository 
> [_here_](https://github.com/TutiEgg/dungeonescape/). 

> Link zum Design-Dokument
> [_here_](https://github.com/TutiEgg/dungeonescape/blob/main/Design_Dokument.pdf).

## Table of Contents
* [Author Info](#general-information)
* [How to Use](#how-to-use)
* [Checklist](#checklist)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)
<!-- * [License](#license) -->


## General Information
- Author: Luce.Moser
- Semester: WI2022/2023 (5.Semester)
- Kurs: Prototyping Interaktiver Medien-Apps und Games
- Docent: Prof. Jirka Dell´Oro-Friedl


## How to Use
Die Steuerung ist mit den WASD-Tasten möglich, durch zusätzliches drücken der SHIFT-Taste kann der Charakter sprinten.
Nach einem Reload der Seite nicht sofort auf Start klicken !


## Features

| Nr      | Criterion | explanation |
| ----------- | ----------- |----------- |
| 1      | Units and Positions       | 0 ist ganz unten links im Eck. Von diesem Punkt aus sind alle Dungeontile-objekte tabellenförmig gegliedert. Da es nur ein 2D game ist, läuft das Spiel über die X-Y-Achsen|
| 2  | Hierarchy       | Der Hauptgraph ist "Dungeon" unter welchem alle anderen Graphen und Nodes angesprochen werden können. Unter dem "Map"-Graphen sind alle Tiles gegliedert nach "Cols" und "Rows", sodass man sofort weiß welches teil an welcher Position ist.
| 3 | Editor| Die Platzierung der Gegner und dem Spieler ist besser im Code durchzuführen als im Editor, damit diese an diversen Stellen eingesetzt  werden können. Die Map an sich ist einfacher im Editor zu erstellen, da man dort visualiert die Blöcke platzieren kann
|4| Scriptcomponents| Waren für das Exitgate gut, da dieser dem Objekt einfach hinzugefügt und entfernt werden kann. Somit wird auch die Funktionalität hinzugefügt.
|5| Extend | Es wurden viele Klassen benutzt. zB die KEYBOARD-class oder TextureImage-class. (Vectore, Matrix ...)|
|6| Sound | Die Sounds wurdenso ausgewählt, dass eine dunkle und gruselige Atmosphäre bewerkstelligt wird.
|7| VUI| Das Interface ist schlicht gehalten und beinhaltet eine Batterie anzeige unten links und eine Lebensanzeige über dem Kopf des Spielers. Beide Anzeigen werden über den Code verändert.
|8| Event-System| Es wurden Collision-events und Tastatur-klick-events benutzt, diese reagierten auf bestimmte Events und führten eine Funktion aus. Event-Listenet|
|9| External Data | Man kann verschiedene Werte in der settings.json ändern. z.B. die Geschwindigkeit der Spieler oder der Gegner ..
|A| Light | Lichteinflüsse sind deer Hauptbestandteil des Spiels. Das Licht ist ein POINT-Light, welches von oben herab scheint. Ich wollte es von oben herabscheinen lassen, weil ich das bewegen des Lichtes animieren wollte. Ohne Animation würde bei richtungswechsel dass licht plötzlich verschwinden und wieder auftauchen.|
|B| Physics | Es wurden Rigidbodys mit Collisions benutzt um Kollisionen zwischen Spieler und Gegner/ExitGate zu tracken. (Durch COllision-event)|
|C| Net| Wurde nicht benutzt
|D| State Machine| Gegner-actionen werden durch die State-Machines gesteuert. (Momentan nur laufen)
|E|  Animation | Es wurden SpriteSheetAnimationen benutzt und den Charakter sowie die Gegner zu animieren.



