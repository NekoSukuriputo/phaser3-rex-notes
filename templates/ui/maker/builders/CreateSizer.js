import MergeStyle from './utils/MergeStyle.js';
import Sizer from '../../sizer/Sizer.js';
import CreateChild from './utils/CreateChild.js';

var CreateSizer = function (scene, data, styles, customBuilders) {
    data = MergeStyle(data, styles);

    var backgroundConfig = data.background;
    delete data.background;
    if (backgroundConfig) {
        if (!Array.isArray(backgroundConfig)) {
            backgroundConfig = [backgroundConfig];
        }
        for (var i = 0, cnt = backgroundConfig.length; i < cnt; i++) {
            var childConfig = backgroundConfig[i];
            if (!childConfig.child) {
                childConfig = { child: childConfig };
                backgroundConfig[i] = childConfig;
            }
            CreateChild(scene, childConfig, 'child', styles, customBuilders);
        }
    }

    var childrenConfig = data.children;
    delete data.children;
    if (childrenConfig) {
        for (var i = 0, cnt = childrenConfig.length; i < cnt; i++) {
            var childConfig = childrenConfig[i];
            if (!childConfig.child) {
                childConfig = { child: childConfig };
                childrenConfig[i] = childConfig;
            }
            CreateChild(scene, childConfig, 'child', styles, customBuilders);
        }
    }

    var gameObject = new Sizer(scene, data);
    scene.add.existing(gameObject);

    if (backgroundConfig) {
        for (var i = 0, cnt = backgroundConfig.length; i < cnt; i++) {
            var childConfig = backgroundConfig[i];
            gameObject.addBackground(childConfig.child, childConfig.padding);
        }
    }

    if (childrenConfig) {
        for (var i = 0, cnt = childrenConfig.length; i < cnt; i++) {
            var childConfig = childrenConfig[i];
            gameObject.add(childConfig.child, childConfig);
        }
    }

    return gameObject;
}

export default CreateSizer;