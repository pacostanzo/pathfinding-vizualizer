import shortid from 'shortid';

export const createGridUtil = (state) => {
  const { rows, columns } = state;

  const gridCells = [];

  for (let i = 0; i < rows; i++) {
    gridCells.push([]);
    for (let j = 0; j < columns; j++) {
      gridCells[i].push({
        id: shortid(),
        i,
        j,
        isWall: false,
        isPlayer: false,
        isTarget: false,
      });
    }
  }

  return gridCells;
};

export const createMazeUtil = (state) => {
  const { rows, columns, playerPos, targetPos } = state;
  const gridCells = [...state.gridCells];

  //convert edges to walls
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (i === 0 || j === 0 || i === rows - 1 || j === columns - 1) {
        gridCells[i][j].isWall = true;
      }
    }
  }

  gridCells[playerPos.i][playerPos.j].isPlayer = true;
  gridCells[targetPos.i][targetPos.j].isTarget = true;

  recursiveDivision(gridCells, 0, rows - 2, 0, columns - 2);
  clearPlayerAndTargetWalls(playerPos, targetPos, gridCells);

  return gridCells;
};

function recursiveDivision(gridCells, minI, maxI, minJ, maxJ) {
  if (minI >= maxI || minJ >= maxJ) return;

  let horizontal = maxI - minI > maxJ - minJ ? true : false;

  if (horizontal) {
    //wall cordinate
    let wallI = randomVerticalCoordinate(minI, maxI, 'wall');
    buildWall(wallI, maxI, minJ, maxJ, 'horizontal', gridCells);
    buildPassage(wallI, maxI, minJ, maxJ, 'horizontal', gridCells);

    //call function on top and bottom half
    recursiveDivision(gridCells, minI, wallI - 1, minJ, maxJ); //top
    recursiveDivision(gridCells, wallI + 1, maxI, minJ, maxJ); //bottom
  } else {
    //wall cordinate
    let wallJ = randomHorizontalCoordinate(minJ, maxJ, 'wall');
    buildWall(minI, maxI, wallJ, maxJ, 'vertical', gridCells);
    buildPassage(minI, maxI, wallJ, maxJ, 'vertical', gridCells);

    recursiveDivision(gridCells, minI, maxI, minJ, wallJ - 1); //left
    recursiveDivision(gridCells, minI, maxI, wallJ + 1, maxJ); //right
  }
}

function buildWall(minI, maxI, minJ, maxJ, direction, gridCells) {
  if (direction === 'horizontal') {
    while (minJ <= maxJ) {
      gridCells[minI][minJ].isWall = true;
      minJ++;
    }
  } else {
    while (minI <= maxI) {
      gridCells[minI][minJ].isWall = true;
      minI++;
    }
  }
}

function buildPassage(minI, maxI, minJ, maxJ, direction, gridCells) {
  if (direction === 'horizontal') {
    let passageJ = randomHorizontalCoordinate(minJ, maxJ, 'passage');
    if (
      minI === 0 ||
      passageJ === 0 ||
      minI === gridCells.length - 1 ||
      passageJ === gridCells[0].length - 1
    )
      return;
    gridCells[minI][passageJ].isWall = false;
  } else {
    let passageI = randomVerticalCoordinate(minI, maxI, 'passage');
    if (
      minJ === 0 ||
      passageI === 0 ||
      minJ === gridCells[0].length - 1 ||
      passageI === gridCells.length - 1
    )
      return;
    gridCells[passageI][minJ].isWall = false;
  }
}

function clearPlayerAndTargetWalls(playerPos, targetPos, gridCells) {
  if (gridCells[playerPos.i][playerPos.j].isWall) {
    gridCells[playerPos.i][playerPos.j].isWall = false;
    gridCells[playerPos.i][playerPos.j].isPlayer = true;
    console.log('das');
  }
  if (gridCells[targetPos.i][targetPos.j].isWall) {
    gridCells[targetPos.i][targetPos.j].isWall = false;
    gridCells[targetPos.i][targetPos.j].isTarget = true;
    console.log('sas');
  }
}

//return I
function randomVerticalCoordinate(minI, maxI, type) {
  if (type === 'wall') {
    return Math.floor(random(minI, maxI) / 2) * 2;
  }
  return Math.floor(random(minI, maxI) / 2) * 2 + 1;
}

//return J
function randomHorizontalCoordinate(minJ, maxJ, type) {
  if (type === 'wall') {
    return Math.floor(random(minJ, maxJ) / 2) * 2;
  }
  return Math.floor(random(minJ, maxJ) / 2) * 2 + 1;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
