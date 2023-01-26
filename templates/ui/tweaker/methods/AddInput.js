import GetInputType from '../utils/inputs/GetInputType.js';
import CreateInputRow from '../builders/CreateInputRow.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var AddInput = function (object, key, config) {
    if (arguments.length === 1) {
        config = object;
        object = config.bindingTarget;
        key = config.bindingKey;
    } else if (config === undefined) {
        config = {};
    }

    if (!config.title) {
        config.title = key;
    }

    if (!config.view) {
        config.view = GetInputType(object[key], config);
    }

    // Create InputRow
    var inputRowStyle = GetValue(this.styles, 'inputRow');
    var inputSizer = CreateInputRow(this.scene, config, inputRowStyle);

    var proportion;
    if (this.orientation === 1) { // y
        proportion = 0;
    } else { // x
        proportion = (this.itemWidth > 0) ? 0 : 1;
        inputSizer.setMinWidth(this.itemWidth);
    }

    // Add InputRow to Tweaker
    this.add(
        inputSizer,
        { proportion: proportion, expand: true }
    );

    // Bind target
    inputSizer.setBindingTarget(object, key);

    if (config.monitor) {
        inputSizer.startMonitorTarget();
    }

    if (config.key) {
        this.root.addChildrenMap(config.key, inputSizer);
    }

    return this;
}

export default AddInput;