var oldCellData;
var newCellData;
var dataWidth;
var dataHeight;
var timer;

/**
 * 
 * @param startPattern - String - initial pattern name
 * @param dataW - Integer -  data width
 * @param dataH - Integer - data height
 * @param nrOfGen - Integer - how many generations to iterate (only if animateMillis == 0)
 * @param animateMillis - Integer - refresh every x milliseconds; if 0 -> do not animate;
 */
function initGameOfLife(startPattern, dataW, dataH, nrOfGen, animateMillis) {
	if (timer) {
        clearTimeout(timer);
        timer = 0;
    }
	
	if (dataH <= 0 || dataW <= 0 || nrOfGen <= 0 || animateMillis < 0) {
		return;
	}
	
	dataWidth = dataW;
	dataHeight = dataH;
	oldCellData = new Array(dataW * dataH);
	newCellData = new Array(dataW * dataH);

	if (startPattern == "random")
		initCellData(initRandom);
	else if (startPattern == "sierpinski-carpet")
		initCellData(initSierpinskiCarpet);
	else if (startPattern == "glider")
		initCellData(glider);
	
	if (animateMillis > 0) {
		anim();
	} else {
		for (var s = 0; s < nrOfGen; s++) {
			oldCellData = newCellData.slice(0);
			evolve(golHood, golProcessNeighbors, dataW, dataH, oldCellData, newCellData);
		}
		drawRGBA(newCellData, dataW, dataH, translatePixel, 0, 0);
	}
}

function initCellData(func) {
	for (var x = 0; x < dataWidth; x++) {
		for (var y = 0; y < dataHeight; y++) {
			newCellData[x + y * dataWidth] = func(x, y);
		}
	}
}

function initRandom(x, y) {
	var r = Math.random() * 256;
	if (r < 20)
		return 1;
	return 0;
}	

//pairs x,y
var golHood = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1];

function golProcessNeighbors(neighbors, currentValue) {
	var sum = 0;
	for (var i = 0; i < neighbors.length; i++) {
		sum += neighbors[i];
	}
	
//	if (currentValue == 1) {
//		//survive
//		if (sum == 2 || sum == 3)
//			return 1;
//		else
//			return 0;
//	} else {
//		//born
//		if (sum == 3 || sum == 6)
//			return 1;
//		else
//			return 0;
//	}
//	
	
	//good for maps
//	if (currentValue == 1) {
//		//survive
//		if (sum >= 3 && sum <= 8)
//			return 1;
//		else
//			return 0;
//	} else {
//		//born
//		if (sum == 3 || sum == 6 || sum == 7 || sum == 8)
//			return 1;
//		else
//			return 0;
//	}
	
//	if (currentValue == 1) {
//		//survive
//		if (sum >= 5 && sum <= 8)
//			return 1;
//		else
//			return 0;
//	} else {
//		//born
//		if (sum >= 3 && sum <= 8)
//			return 1;
//		else
//			return 0;
//	}
	
		//born
		if (sum >= 2 && sum <= 4)
			return 1;
		else
			return 0;
		
		/*
		 * B3/S23 [Life]
John Conway's rule is by far the best known and most explored CA.

B36/S23 [HighLife]
Very similar to Conway's Life but with an interesting replicator.

B3678/S34678 [Day & Night]
Dead cells in a sea of live cells behave the same as live cells in a sea of dead cells.

B35678/S5678 [Diamoeba]
Creates diamond-shaped blobs with unpredictable behavior.

B2 [Seeds]
Every living cell dies every generation, but most patterns still explode.

B234 [Serviettes or Persian Rug]
A single 2x2 block turns into a set of Persian rugs.

B345/S5 [LongLife]
Oscillators with extremely long periods can occur quite naturally. 
		 * 
		 */
}

function anim() {
	drawRGBA(newCellData, dataWidth, dataHeight, translatePixel, 0, 0);
	timer = setTimeout(anim, 100);
	oldCellData = newCellData.slice(0);
	evolve(golHood, golProcessNeighbors, dataWidth, dataHeight, oldCellData, newCellData);
}

function translatePixel(x, y, data) {
	var r = Math.abs(data-1) * 255;
	var g = Math.abs(data-1) * 255;
	var b = Math.abs(data-1) * 255;
	return [r, g, b, 255];
}
