import AddChild from '../basesizer/utils/AddChild.js';
import GetBoundsConfig from '../utils/GetBoundsConfig.js';
import ALIGNMODE from '../utils/AlignConst.js';

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetValue = Phaser.Utils.Objects.GetValue;
const ALIGN_CENTER = Phaser.Display.Align.CENTER;


var GetEmptyCellIndex = function (columnIndex, rowIndex, cells, columnCount, rowCount) {
    if ((typeof (columnIndex) === 'number') || (typeof (rowIndex) === 'number')) {
        if (columnIndex === undefined) {
            var idx;
            for (var i = 0; i < columnCount; i++) {
                idx = (rowIndex * columnCount) + i;
                if (!cells[idx]) {
                    return idx;
                }
            }
        } else if (rowIndex === undefined) {
            var idx;
            for (var i = 0; i < rowCount; i++) {
                idx = (i * columnCount) + columnIndex;
                if (!cells[idx]) {
                    return idx;
                }
            }
        } else {
            var idx = (rowIndex * columnCount) + columnIndex;
            if (!cells[idx]) {
                return idx;
            }
        }

    } else if (rowIndex === true) {
        var idx;
        for (var i = 0; i < columnCount; i++) {
            for (var j = 0; j < rowCount; j++) {
                idx = (j * columnCount) + i;
                if (!cells[idx]) {
                    return idx;
                }
            }
        }
    } else {
        for (var i = 0, cnt = cells.length; i < cnt; i++) {
            if (!cells[i]) {
                return i;
            }
        }
    }
    return null;
}

var Add = function (gameObject, columnIndex, rowIndex, align, paddingConfig, expand, childKey) {
    var offsetX, offsetY;
    var offsetOriginX, offsetOriginY;

    AddChild.call(this, gameObject);
    if (IsPlainObject(columnIndex)) {
        var config = columnIndex;
        columnIndex = GetValue(config, 'column', undefined);
        rowIndex = GetValue(config, 'row', undefined);
        align = GetValue(config, 'align', ALIGN_CENTER);
        paddingConfig = GetValue(config, 'padding', 0);
        expand = GetValue(config, 'expand', false);
        childKey = GetValue(config, 'key', undefined);

        offsetX = GetValue(config, 'offsetX', 0);
        offsetY = GetValue(config, 'offsetY', 0);
        offsetOriginX = GetValue(config, 'offsetOriginX', 0);
        offsetOriginY = GetValue(config, 'offsetOriginY', 0);
    }

    // Get insert index
    var itemIndex = GetEmptyCellIndex(columnIndex, rowIndex, this.sizerChildren, this.columnCount, this.rowCount);
    if (itemIndex === null) {
        // Specific index mode
        if ((typeof (columnIndex) === 'number') && (typeof (rowIndex) === 'number')) {
            return this;
        }

        if ((rowIndex === true) || (typeof (rowIndex) === 'number')) {
            this.addEmptyColumn();
        } else {
            this.addEmptyRow();
        }

        // Get insert index again
        itemIndex = GetEmptyCellIndex(columnIndex, rowIndex, this.sizerChildren, this.columnCount, this.rowCount);
    }

    if (typeof (align) === 'string') {
        align = ALIGNMODE[align];
    }
    if (align === undefined) {
        align = ALIGN_CENTER;
    }
    if (paddingConfig === undefined) {
        paddingConfig = 0;
    }
    if (expand === undefined) {
        expand = true;
    }

    if (offsetX === undefined) {
        offsetX = 0;
    }
    if (offsetY === undefined) {
        offsetY = 0;
    }
    if (offsetOriginX === undefined) {
        offsetOriginX = 0;
    }
    if (offsetOriginY === undefined) {
        offsetOriginY = 0;
    }

    var config = this.getSizerConfig(gameObject);
    config.align = align;
    config.padding = GetBoundsConfig(paddingConfig);

    if (IsPlainObject(expand)) {
        config.expandWidth = GetValue(expand, 'width', false);
        config.expandHeight = GetValue(expand, 'height', false);
    } else {
        config.expandWidth = expand;
        config.expandHeight = expand;
    }

    config.alignOffsetX = offsetX;
    config.alignOffsetY = offsetY;
    config.alignOffsetOriginX = offsetOriginX;
    config.alignOffsetOriginY = offsetOriginY;

    this.sizerChildren[itemIndex] = gameObject;

    if (childKey !== undefined) {
        this.addChildrenMap(childKey, gameObject)
    }
    return this;
}

export default {
    add: Add
}