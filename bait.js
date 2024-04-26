"use strict";
import { TSprite } from "../lib/libSprite.js";
import { TPoint } from "../lib/lib2D.js";
import { cvs, imgSheet, SheetData, gameBoard, gameBoardSize, EBoardCellInfoType } from "./game.js";

let currentBaitInstance = null; // Variabel for å holde den gjeldende instansen av TBait

export function TBait(aBoardCell) {
    // Hvis det allerede er en bait, returner den gjeldende instansen
    if (currentBaitInstance !== null) {
        return currentBaitInstance;
    }
        
    // Opprett en ny bait-instans hvis det ikke finnes en eksisterende
    const boardCell = aBoardCell;
    const spa = SheetData.Bait;
    const pos = new TPoint(boardCell.col * spa.width, boardCell.row * spa.height);
    const sp = new TSprite(cvs, imgSheet, spa, pos);

    gameBoard[boardCell.row][boardCell.col].infoType = EBoardCellInfoType.Bait;

    this.BaitPos = function () {
        return boardCell;
    }

    this.draw = function () {
        sp.draw(); // Tegn bait på den angitte posisjonen
    };

    this.update = function () {
        // Hvis det allerede er en bait, avslutt funksjonen uten å gjøre noe
        if (currentBaitInstance !== null) {
            return;
        }

        // Fjern informasjonen om at det er en bait i gjeldende celle
        gameBoard[boardCell.row][boardCell.col].infoType = EBoardCellInfoType.Empty;

        // Generer nye tilfeldige kolonne- og radverdier for bait
        let newCol, newRow;
        do {
            newCol = Math.floor(Math.random() * gameBoardSize.cols);
            newRow = Math.floor(Math.random() * gameBoardSize.rows);
        } while (gameBoard[newRow][newCol].infoType !== EBoardCellInfoType.Empty);

        // Oppdater posisjonen til bait til de nye verdiene
        boardCell.col = newCol;
        boardCell.row = newRow;
        pos.x = newCol * spa.width;
        pos.y = newRow * spa.height;

        // Oppdater spillbrettinformasjonen for å indikere at det er en bait i den nye cellen
        gameBoard[newRow][newCol].infoType = EBoardCellInfoType.Bait;

        // Oppdater tegningen av bait til den nye posisjonen
        sp.updateDestination(pos.x, pos.y);

        console.log("Bait is successfully drawn at:", newCol, newRow);

        // Sett den gjeldende instansen til denne klassen
        currentBaitInstance = this;
    };

    // Returner denne instansen av TBait uansett om det allerede er en instans eller ikke
    return this;
}
