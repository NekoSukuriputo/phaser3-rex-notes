import FrameManager from '../../../plugins/texture/framemanager/FrameManager.js';
import RandomPieceEdges from './RandomPieceEdges.js';
import JigsawPiece from '../jigsawpiece/JigsawPiece.js';


var DefaultGetFrameNameCallback = function (c, r) {
    return `${c},${r}`;
}

var GenerateFrames = function (scene, {
    baseKey,
    targetKey,
    columns, rows,
    edgeWidth, edgeHeight,
    edges,
    drawMaskCallback,
    getFrameNameCallback = DefaultGetFrameNameCallback
}) {

    var textureManager = scene.sys.textures;
    var baseFrame = textureManager.getFrame(baseKey, '__BASE');
    var baseFrameWidth = baseFrame.cutWidth,
        baseFrameHeight = baseFrame.height;

    if (edgeWidth === undefined) {
        edgeWidth = (baseFrameWidth / columns) / 7;
    }
    if (edgeHeight === undefined) {
        edgeHeight = (baseFrameHeight / rows) / 7;
    }

    if (edges === undefined) {
        edges = RandomPieceEdges(columns, rows);
    }

    var frameWidth = ((baseFrameWidth - (edgeWidth * (columns - 1))) / columns) + (2 * edgeWidth);
    var frameHeight = ((baseFrameHeight - (edgeHeight * (rows - 1))) / rows) + (2 * edgeHeight);

    var frameManager = new FrameManager(scene, {
        key: targetKey,
        width: (frameWidth * columns),
        height: (frameHeight * rows),
        cellWidth: frameWidth,
        cellHeight: frameHeight,
        useDynamicTexture: true,
        fillColor: 0x888888,
    })

    var sample = new JigsawPiece(scene, {
        width: frameWidth, height: frameHeight,
        indentX: edgeWidth, indentY: edgeHeight,
        key: baseKey
    });

    var startX = -edgeWidth,
        startY = -edgeHeight;
    var scrollX = startX,
        scrollY = startY;
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            sample.drawPiece({
                scrollX,
                scrollY,
                edgeMode: edges[c][r],
                drawMaskCallback
            });

            frameManager.paste(getFrameNameCallback(c, r), sample);

            scrollX += frameWidth - edgeWidth;
        }

        scrollX = startX;
        scrollY += frameHeight - edgeHeight;
    }

    sample.destroy();
    frameManager.destroy();

    return {
        baseKey,
        targetKey,
        columns, rows,

        frameWidth,
        frameHeight,
        edgeWidth,
        edgeHeight,
        getFrameNameCallback,
    }
}

export default GenerateFrames;