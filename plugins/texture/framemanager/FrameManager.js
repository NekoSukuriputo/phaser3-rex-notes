import Methods from './methods/Methods.js';
import GetGame from '../../utils/system/GetGame.js';
import CreateTexture from '../../utils/texture/CreateTexture.js';
import GetWhiteFrame from '../../utils/texture/GetWhiteFrame.js';

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetValue = Phaser.Utils.Objects.GetValue;

class FrameManager {
    constructor(scene, key, width, height, cellWidth, cellHeight, fillColor, useDynamicTexture) {
        if (IsPlainObject(key)) {
            var config = key;
            key = GetValue(config, 'key');
            width = GetValue(config, 'width');
            height = GetValue(config, 'height');
            cellWidth = GetValue(config, 'cellWidth');
            cellHeight = GetValue(config, 'cellHeight');
            fillColor = GetValue(config, 'fillColor');
            useDynamicTexture = GetValue(config, 'useDynamicTexture');
        } else {
            if (typeof (fillColor) === 'boolean') {
                useDynamicTexture = fillColor;
                fillColor = undefined;
            }
        }

        if (width === undefined) {
            width = 4096;
        }
        if (height === undefined) {
            height = 4096;
        }
        if (cellWidth === undefined) {
            cellWidth = 64;
        }
        if (cellHeight === undefined) {
            cellHeight = 64;
        }
        if (useDynamicTexture === undefined) {
            useDynamicTexture = false;
        }

        var game = GetGame(scene);

        this.useDynamicTexture = useDynamicTexture;
        this.texture = CreateTexture(game, key, width, height, useDynamicTexture);
        this.canvas = (useDynamicTexture) ? undefined : this.texture.getCanvas();
        this.context = (useDynamicTexture) ? undefined : this.texture.getContext();
        this.bitmapFontCache = game.cache.bitmapFont;

        if (fillColor !== undefined) {
            if (useDynamicTexture) {
                this.texture.fill(fillColor);

            } else {
                var context = this.context;
                context.fillStyle = fillColor;
                context.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        this.key = key;
        this.width = width;
        this.height = height;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.columnCount = Math.floor(width / cellWidth);
        this.rowCount = Math.floor(height / cellHeight);
        this.totalCount = this.columnCount * this.rowCount;

        this.frameNames = Array(this.totalCount);
        for (var i = 0, cnt = this.frameNames.length; i < cnt; i++) {
            this.frameNames[i] = undefined;
        }
       
        if (useDynamicTexture) {
             // For clear rectangle
            var whiteFrame = GetWhiteFrame(game);
            this.whiteFrameWidth = whiteFrame.cutWidth;
            this.whiteFrameHeight = whiteFrame.cutHeight;
        }
    }

    destroy() {
        this.texture = undefined;
        this.canvas = undefined;
        this.context = undefined;
        this.frameNames = undefined;
        this.bitmapFontCache = undefined;
    }

    getFrameIndex(frameName) {
        return this.frameNames.indexOf(frameName);
    }

    contains(frameName) {
        return this.getFrameIndex(frameName) !== -1;
    }

    addFrameName(index, frameName) {
        this.frameNames[index] = frameName;
        return this;
    }

    get isFull() {
        return this.getFrameIndex(undefined) === -1;
    }

    getTopLeftPosition(frameIndex, out) {
        if (out === undefined) {
            out = {};
        }

        var columnIndex = frameIndex % this.columnCount;
        var rowIndex = Math.floor(frameIndex / this.rowCount);
        out.x = columnIndex * this.cellWidth;
        out.y = rowIndex * this.cellHeight;
        return out;
    }

    updateTexture() {
        if (this.useDynamicTexture) {

        } else {
            this.texture.refresh();
        }
        return this;
    }

}

Object.assign(
    FrameManager.prototype,
    Methods
);

export default FrameManager;