  "use strict";

  import { TBait } from "./bait.js";
  import { TSnakeHead, TSnakeBody, TSnakeTail } from "./snake.js";
  import { TSprite, TSpriteButton } from "../lib/libSprite.js";
  import { TPoint } from "../lib/lib2D.js";

  //-----------------------------------------------------------------------------------------
  //----------- variables and object --------------------------------------------------------
  //-----------------------------------------------------------------------------------------
  export let cvs = null;
  export let ctx = null;
  export let imgSheet = null;
  export const gameBoardSize = { cols: 24, rows: 18 };
  export const SheetData = {
    Head: { x: 0, y: 0, width: 38, height: 38, count: 4 },
    Body: { x: 0, y: 38, width: 38, height: 38, count: 6 },
    Tail: { x: 0, y: 76, width: 38, height: 38, count: 4 },
    Bait: { x: 0, y: 114, width: 38, height: 38, count: 1 },
    Play: { x: 0, y: 155, width: 202, height: 202, count: 10 },
    Retry: { x: 614, y: 995, width: 169, height: 167, count: 1 },
    Resume: { x: 0, y: 357, width: 202, height: 202, count: 2 },
    Home: { x: 0, y: 357, width: 202, height: 202, count: 1 },
    Number: { x: 0, y: 560, width: 81, height: 86, count: 10 },
    GameOver: { x: 0, y: 647, width: 856, height: 580, count: 1 },
  };


  export const EDirection = { Up: 0, Right: 1, Left: 2, Down: 3 };

  export const EBoardCellInfoType = { Empty: 0, Snake: 1, Bait: 2 };

  //-----------------------------------------------------------------------------------------
  //----------- Knapper --------------------------------------------------------
  export const sprites = SheetData;

  function universalButton(){
    return;
  }


  let spPlayButton = null;
  let spGameOver = null;
  let spResumeButton = null;
  let spNumber = null;



  export const EGameStatus = { New: 0, Running: 1, Pause: 2, GameOver: 3 };
  let insertNewBody = null;
  let insertBody = null;

  

  export function TBoardCell(aCol, aRow) {
    this.col = aCol;
    this.row = aRow;

  }
  export function TBoardCellInfo() {
    this.direction = EDirection.Right;
    this.infoType = EBoardCellInfoType.Empty;
  }

  export let gameBoard = null;
  export let gameStatus = EGameStatus.New;

  let snakeSpeed = 5;

  let hndUpdateGame = null;
  export const gameProps = {
    snake: null,
    bait: null,
    startButton: null,
    resumeButton: null
  };


  //-----------------------------------------------------------------------------------------
  //----------- functions -------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------}

  function loadGame() {
    
    cvs = document.getElementById("cvs");
    cvs.width = gameBoardSize.cols * SheetData.Head.width;
    cvs.height = gameBoardSize.rows * SheetData.Head.height;
    ctx = cvs.getContext("2d");


    
    spPlayButton = new TSpriteButton(cvs, imgSheet, SheetData.Play, { x: 400, y: 155 }, buttonClicked);
    spGameOver = new TSpriteButton(cvs, imgSheet, SheetData.GameOver, { x: 20, y: 47 }, buttonClicked);
    spResumeButton = new TSpriteButton(cvs, imgSheet, SheetData.Resume, { x: 400, y: 227 }, buttonClicked);
    spNumber = new TSprite(cvs, imgSheet, SheetData.Number, { x: 600, y: 260 });


      
    
    function scoreTracker(score){
      score = spNumber.setIndex(score);
      if(score)
      spNumber.update();
    }
  

  

    function buttonClicked() {
      if (gameStatus === EGameStatus.New) {
          gameStatus = EGameStatus.Running;
          console.log("Play button clicked!");
       } else if(gameStatus === EGameStatus.Pause){
        gameStatus = EGameStatus.Running;  
        console.log("Resume button clicked!");
      }


      
      // Legg til handlingen som skal utføres når knappen klikkes
    }


    if (gameStatus === EGameStatus.New) {
      spPlayButton.draw();
      console.log("Main Menu is shown");
    } else if (gameStatus === EGameStatus.Running) {
      console.log("Game is running");
    } else if (gameStatus === EGameStatus.GameOver) {
      spNumber.draw();
      console.log("Game Over");
      newGame();
      spGameOver.draw();
    } else if (gameStatus === EGameStatus.Pause) {
      spResumeButton.draw();
      console.log("Game is paused");
      console.log(gameStatus);
    }
    



    newGame();



    requestAnimationFrame(drawGame);
    console.log("Game canvas is rendering!");
  }

  //-----------------------------------------------------------------------------------------

  function newGame() {
    if (hndUpdateGame) {
      clearInterval(hndUpdateGame);
    }

    gameBoard = [];
    for (let i = 0; i < gameBoardSize.rows; i++) {
      const row = [];
      for (let j = 0; j < gameBoardSize.cols; j++) {
        row.push(new TBoardCellInfo());
      }
      gameBoard.push(row);
    }

    gameProps.snake = [];
    let newSnakeElement = new TSnakeHead(new TBoardCell(2, 10));
    gameProps.snake.push(newSnakeElement);
    newSnakeElement = new TSnakeBody(new TBoardCell(1, 10));
    gameProps.snake.push(newSnakeElement);
    newSnakeElement = new TSnakeTail(new TBoardCell(0, 10));
    gameProps.snake.push(newSnakeElement);

    gameProps.bait = new TBait(new TBoardCell(1, 1));

    hndUpdateGame = setInterval(updateGame, 500/snakeSpeed);

    
    
    console.log("Game update sequence is running!");

  }

  function drawGame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    

  // If setning som sjekker at hvis spillet er game over, eller på pause, så skal den ikke kjøre updateGame funksjonen
  if(gameStatus === EGameStatus.New){
    spPlayButton.draw();
  } else if(gameStatus === EGameStatus.Running){
    gameProps.bait.draw();
    for(let i = 0; i < gameProps.snake.length; i++) {
      gameProps.snake[i].draw();
    }
  } else if(gameStatus === EGameStatus.GameOver){
    spGameOver.draw();
    spNumber.draw();
  } else if(gameStatus === EGameStatus.Pause){
    spResumeButton.draw();
    console.log("Game is paused");
  }
    


    requestAnimationFrame(drawGame);

  }
  //-----------------------------------------------------------------------------------------



  function updateGame() {
    if (gameStatus !== EGameStatus.New) {
        // Update snake's movement
        for (let i = 0; i < gameProps.snake.length; i++) {
            const snakeElement = gameProps.snake[i];
            if (snakeElement === gameProps.snake[0]) {
                // Check for collision with walls or itself
                if (gameProps.snake[0].checkCollision()) {
                    gameStatus = EGameStatus.GameOver;
                    console.log("Game is Over");
                    clearInterval(hndUpdateGame);
                    spGameOver.draw();
                    return; // Exit the function since the game is over
                }
            }
            snakeElement.update(); // Update the position of the snake
        }

        // Check if there's a collision with the bait
        if (baitCollition()) {
            // Remove the bait and generate a new one
            gameProps.bait.update();
           
            
            // Adjust the snake's speed
            const increaseSpeed = 10;
            clearInterval(hndUpdateGame);
            snakeSpeed -= increaseSpeed;
            if (snakeSpeed < 150) {
                snakeSpeed = 150;
            }
        }

        gameProps.bait.update(); // Update the bait position

        // Check if the snake needs to grow
        if (insertBody !== null) {
            const snakeTail = gameProps.snake.pop();
            gameProps.snake.push(insertBody);
            gameProps.snake.push(snakeTail);
            insertBody = null;
            insertNewBody = null;
        }
    }
}



  //-----------------------------------------------------------------------------------------
  //----------- Snake ---------------------------------------------------------------




  //-----------------------------------------------------------------------------------------
  //----------- Events ----------------------------------------------------------------------

  /* export function baitDrawn(snakeHeadCell) {
    let isBaitPresent = false;

    // Sjekk om det allerede er et agn til stede på brettet
    for (let i = 0; i < gameProps.bait.length; i++) {
      let bait = gameProps.bait[i];
      if (bait.row === snakeHeadCell.row && bait.col === snakeHeadCell.col) {
        isBaitPresent = true;
        break;
      }
    }

    // Generer et nytt agn hvis det ikke allerede er et til stede på brettet
    if (!isBaitPresent) {
      generateNewBait();
    }
  }

  export function generateNewBait() {
    const newBaitCol = Math.floor(Math.random() * gameBoardSize.cols);
    const newBaitRow = Math.floor(Math.random() * gameBoardSize.rows);
    console.log("New bait generated at:", newBaitCol, newBaitRow);
    gameProps.bait = new TBait(new TBoardCell(newBaitCol, newBaitRow));
  }

*/




  //-----------------------------------------------------------------------------------------
  export function init() {
    console.log("Initializing the game");
    imgSheet = new Image();
    imgSheet.addEventListener("load", imgSheetLoad);
    imgSheet.addEventListener("error", imgSheetError);
    imgSheet.src = "./media/spriteSheet.png";
    
    document.addEventListener("keydown", keydown);

    


  }
  //-----------------------------------------------------------------------------------------

  function imgSheetLoad() {
    console.log("Sprite Sheet is loaded, game is ready to start!");
    loadGame();
  }

  //-----------------------------------------------------------------------------------------
  function imgSheetError(aEvent) {
    console.log("Error loading Sprite Sheet!", aEvent.target.src);
  }
  //-----------------------------------------------------------------------------------------
 
  
  export function baitCollition() {


    if (
        gameProps.bait.BaitPos().row === gameProps.snake[0].SnakePos().row &&
        gameProps.bait.BaitPos().col === gameProps.snake[0].SnakePos().col
    ) {
        console.log("Collision detected!");
        gameProps.bait.update();

        insertNewBody = true;

        const increaseSpeed = 10;
        clearInterval(hndUpdateGame);
        snakeSpeed -= increaseSpeed;
        if (snakeSpeed < 150) {
            snakeSpeed = 150;
        }
        return true; // Indicate collision detected
    }
    return false; // No collision detected
}


  


  //-----------------------------------------------------------------------------------------

  function keydown(aEvent) {
    const snakeHead = gameProps.snake[0];
    switch (aEvent.key) {
        case "ArrowLeft":
            snakeHead.setDirection(EDirection.Left);
            break;
        case "ArrowRight":
            snakeHead.setDirection(EDirection.Right);
            break;
        case "ArrowUp":
            snakeHead.setDirection(EDirection.Up);
            break;
        case "ArrowDown":
            snakeHead.setDirection(EDirection.Down);
            break;
        case " ":
            if (gameStatus === EGameStatus.Pause) {
                gameStatus = EGameStatus.Running;
                snakeSpeed = 5;
                hndUpdateGame = setInterval(updateGame, 500/snakeSpeed);
            } else if (gameStatus === EGameStatus.Running) {
                gameStatus = EGameStatus.Pause;
                snakeSpeed = 0;
                clearInterval(hndUpdateGame);
            } 
            break;
    }
  }

