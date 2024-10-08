import AddChild from '../basesizer/utils/AddChild.js';
import GetBoundsConfig from '../utils/GetBoundsConfig.js';
import IsArray from '../../../plugins/utils/object/IsArray.js';
import GetNearestChildIndex from './GetNearestChildIndex.js';

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const GetValue = Phaser.Utils.Objects.GetValue;
const ALIGN_CENTER = Phaser.Display.Align.CENTER;

var Add = function (gameObject, paddingConfig, childKey, index) {
    if (gameObject === '\n') {
        this.addNewLine();
        return this;
    }

    var offsetX, offsetY;
    var offsetOriginX, offsetOriginY;

    AddChild.call(this, gameObject);

    if (IsPlainObject(paddingConfig)) {
        var config = paddingConfig;
        paddingConfig = GetValue(config, 'padding', 0);
        childKey = GetValue(config, 'key', undefined);
        index = GetValue(config, 'index', undefined);

        offsetX = GetValue(config, 'offsetX', 0);
        offsetY = GetValue(config, 'offsetY', 0);
        offsetOriginX = GetValue(config, 'offsetOriginX', 0);
        offsetOriginY = GetValue(config, 'offsetOriginY', 0);
    }
    if (paddingConfig === undefined) {
        paddingConfig = 0;
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
    config.align = ALIGN_CENTER;
    config.padding = GetBoundsConfig(paddingConfig);
    config.alignOffsetX = offsetX;
    config.alignOffsetY = offsetY;
    config.alignOffsetOriginX = offsetOriginX;
    config.alignOffsetOriginY = offsetOriginY;

    if ((index === undefined) || (index >= this.sizerChildren.length)) {
        this.sizerChildren.push(gameObject);
    } else {
        this.sizerChildren.splice(index, 0, gameObject);
    }

    if (childKey !== undefined) {
        this.addChildrenMap(childKey, gameObject)
    }
    return this;
};

export default {
    add(gameObject, paddingConfig, childKey) {
        if (IsArray(gameObject)) {
            var gameObjects = gameObject;
            for (var i = 0, cnt = gameObjects.length; i < cnt; i++) {
                Add.call(this, gameObjects[i], paddingConfig);
            }
        } else {
            Add.call(this, gameObject, paddingConfig, childKey);
        }
        return this;
    },

    addNewLine() {
        this.sizerChildren.push('\n');
        return this;
    },

    insert(index, gameObject, paddingConfig, childKey) {
        Add.call(this, gameObject, paddingConfig, childKey, index);
        return this;
    },

    insertAtPosition(x, y, gameObject, paddingConfig, childKey) {
        var index = GetNearestChildIndex.call(this, x, y);
        if (index === -1) {
            index = undefined;
        }
        this.insert(index, gameObject, paddingConfig, childKey);
        return this;
    }
}