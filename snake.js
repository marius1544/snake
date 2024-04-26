"use strict";
//-----------------------------------------------------------------------------------------
//----------- Import modules, js files  ---------------------------------------------------
//-----------------------------------------------------------------------------------------
import { TSprite } from "../lib/libSprite.js";
import { TPoint } from "../lib/lib2D.js";
import { cvs, imgSheet, SheetData, EDirection, gameBoard, gameBoardSize, EBoardCellInfoType, gameProps } from "./game.js";
import { moveSnakeElement, ESpriteIndex } from "./snake_lib.js";



//-----------------------------------------------------------------------------------------
//----------- Classes ---------------------------------------------------------------------

//-----------------------------------------------------------------------------------------

export function TSnakeHead(aBoardCell) {
  const boardCell = aBoardCell;
  const spa = SheetData.Head;
  const pos = new TPoint(boardCell.col * spa.width, boardCell.row * spa.height);
  const sp = new TSprite(cvs, imgSheet, spa, pos);
  let boardCellInfo = gameBoard[boardCell.row][boardCell.col];
  let direction = boardCellInfo.direction;
  let newDirection = direction;
  boardCellInfo.infoType = EBoardCellInfoType.Snake;

  this.draw = function () {
      sp.setIndex(direction);
      sp.draw();
  };

  this.setDirection = function (aDirection) {
      if ((direction === EDirection.Right || direction === EDirection.Left) && (aDirection === EDirection.Up || aDirection === EDirection.Down)) {
          newDirection = aDirection;
      } else if ((direction === EDirection.Up || direction === EDirection.Down) && (aDirection === EDirection.Right || aDirection === EDirection.Left)) {
          newDirection = aDirection;
      }
  };

  this.update = function () {
      direction = moveSnakeElement(newDirection, boardCell, spa);
      if (!this.checkCollision()) {
          boardCellInfo = gameBoard[boardCell.row][boardCell.col];
          
          if (boardCellInfo.infoType === EBoardCellInfoType.Bait) {
              gameProps.bait.update();
              console.log("Bait is successfully eaten!");
              
              direction = newDirection; // Oppdater retningen til slangen
          }
          boardCellInfo.infoType = EBoardCellInfoType.Snake;
      }

      pos.x = boardCell.col * spa.width;
      pos.y = boardCell.row * spa.height;
      sp.updateDestination(pos.x, pos.y);
  };

  this.checkCollision = function () {
      return boardCell.row < 0 || boardCell.row >= gameBoardSize.rows || boardCell.col < 0 || boardCell.col >= gameBoardSize.cols;
  };
  
  this.SnakePos = function () {
      return boardCell;
  };
}

export function TSnakeBody(aBoardCell, aDirection, aSpriteIndex) {
  const boardCell = aBoardCell;
  const spa = SheetData.Body;
  const pos = new TPoint(boardCell.col * spa.width, boardCell.row * spa.height);
  const sp = new TSprite(cvs, imgSheet, spa, pos);
  let direction = gameBoard[boardCell.row][boardCell.col].direction;
  let spriteIndex = ESpriteIndex.RL;
  if (aDirection !== undefined && aSpriteIndex !== undefined) {
      direction = aDirection;
      spriteIndex = aSpriteIndex;
  }

  this.draw = function () {
      sp.setIndex(spriteIndex);
      sp.draw();
  };

  this.update = function () {
      spriteIndex = moveSnakeElement(direction, boardCell, spa);
      direction = gameBoard[boardCell.row][boardCell.col].direction;
      pos.x = boardCell.col * spa.width;
      pos.y = boardCell.row * spa.height;
      sp.updateDestination(pos.x, pos.y);
  };

  this.MakeBody = function () {
      return new TSnakeBody(new TBoardCell(boardCell.col, boardCell.row), direction, spriteIndex);
  };
}

export function TSnakeTail(aBoardCell) {
  const boardCell = aBoardCell;
  const spi = SheetData.Tail;
  const pos = new TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
  const sp = new TSprite(cvs, imgSheet, spi, pos);
  let direction = gameBoard[boardCell.row][boardCell.col].direction;

  this.draw = function () {
      sp.setIndex(direction);
      sp.draw();
  };

  this.update = function () {
      gameBoard[boardCell.row][boardCell.col].infoType = EBoardCellInfoType.Empty;
      direction = moveSnakeElement(direction, boardCell, spi);
      pos.x = boardCell.col * spi.width;
      pos.y = boardCell.row * spi.height;
      sp.updateDestination(pos.x, pos.y);

      // Check if the tail is on a cell containing bait
      if (gameBoard[boardCell.row][boardCell.col].infoType === EBoardCellInfoType.Bait) {
          // Check if the tail collides with the bait
          baitCollition();
          console.log("Bait is successfully eaten!");
          generateNewBait(); // Generate a new bait
          console.log("Bait is removed from the board");

          // Add a new segment to the snake
          const newBodyPart = new TSnakeBody(new TBoardCell(boardCell.col, boardCell.row));
          gameProps.snake.push(newBodyPart);
      }
  };
}







